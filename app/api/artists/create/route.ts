import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { initStripe } from '@/lib/initStripe';
import { backupCardToStorage } from '@/lib/cardBackup';
import { getOrCreateYoutubeAddonPrice } from '@/lib/youtubeAddon';

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateShortId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coverUrl,
      centerfold,
      caption,
      backMessage,
      categories,
      artistName,
      addToCatalog,
      toName,
      fromName,
      personalNote,
      youtube,
      voiceNoteUrl,
    } = body;

    if (!coverUrl || !centerfold || !backMessage || !artistName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: 'At least one category is required' }, { status: 400 });
    }

    if (centerfold.length > 250) {
      return NextResponse.json({ error: 'Card message too long (max 250 chars)' }, { status: 400 });
    }

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    let cardId = generateId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await client.query('SELECT id FROM custom_cards WHERE id = $1', [cardId]);
      if (existing.rows.length === 0) break;
      cardId = generateId();
      attempts++;
    }

    const safeCreatorName = String(artistName).trim().slice(0, 100);
    const safeCenterfold = String(centerfold).trim().slice(0, 250);
    const safeCaption = caption ? String(caption).trim().slice(0, 100) : null;
    const safeBack = String(backMessage).trim().slice(0, 100);
    const isPublicBool = Boolean(addToCatalog);
    const safeSender = fromName ? String(fromName).trim().slice(0, 50) : safeCreatorName;
    const safeRecipient = toName ? String(toName).trim().slice(0, 50) : '';
    const safePersonalNote = personalNote ? String(personalNote).trim().slice(0, 200) : '';

    await client.query(
      `INSERT INTO custom_cards (id, cover_image_url, centerfold_message, caption, back_message, category_ids, creator_name, is_public, is_approved, is_paid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [cardId, coverUrl, safeCenterfold, safeCaption, safeBack, categories, safeCreatorName, isPublicBool, isPublicBool, isPublicBool]
    );

    backupCardToStorage({
      id: cardId,
      cover_image_url: coverUrl,
      centerfold_message: safeCenterfold,
      caption: safeCaption,
      back_message: safeBack,
      category_ids: categories,
      creator_name: safeCreatorName,
      is_public: isPublicBool,
      is_approved: isPublicBool,
      is_paid: isPublicBool,
      stripe_session_id: null,
      created_at: new Date().toISOString(),
    }).catch(err => console.error('Backup error:', err));

    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || request.headers.get('host') || '';

    const hasYoutubeClip = youtube && youtube.videoId && youtube.url && youtube.title;
    const needsYoutubePayment = hasYoutubeClip;

    if (!isPublicBool && !needsYoutubePayment) {
      await client.end();
      await initStripe();
      const stripe = await getUncachableStripeClient();
      const origin = request.headers.get('origin') || request.nextUrl.origin;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Greeting Card',
              description: `Custom card by ${safeCreatorName}`,
            },
            unit_amount: 499,
          },
          quantity: 1,
        }],
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `${origin}/artists?payment=artist_success&cardId=${cardId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/artists?payment=artist_cancelled`,
        metadata: {
          customCardId: cardId,
          creatorName: safeCreatorName,
          senderName: safeSender,
          recipientName: safeRecipient,
          personalNote: safePersonalNote,
        },
      });

      const updateClient = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await updateClient.connect();
      await updateClient.query('UPDATE custom_cards SET stripe_session_id = $1 WHERE id = $2', [session.id, cardId]);
      await updateClient.end();

      return NextResponse.json({ id: cardId, checkoutUrl: session.url });
    }

    if (needsYoutubePayment) {
      await client.end();
      await initStripe();
      const stripe = await getUncachableStripeClient();
      const origin = request.headers.get('origin') || request.nextUrl.origin;

      const lineItems: any[] = [];

      if (!isPublicBool) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Custom Greeting Card',
              description: `Custom card by ${safeCreatorName}`,
            },
            unit_amount: 499,
          },
          quantity: 1,
        });
      }

      const ytAddonPriceId = await getOrCreateYoutubeAddonPrice(stripe);
      lineItems.push({ price: ytAddonPriceId, quantity: 1 });

      let shareShortId = generateShortId();
      let shareAttempts = 0;
      const shareClient = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await shareClient.connect();
      while (shareAttempts < 5) {
        const existing = await shareClient.query('SELECT id FROM shared_cards WHERE id = $1', [shareShortId]);
        if (existing.rows.length === 0) break;
        shareShortId = generateShortId();
        shareAttempts++;
      }

      const safeVoiceNoteUrl = voiceNoteUrl ? String(voiceNoteUrl).trim().slice(0, 500) : null;

      await shareClient.query(
        `INSERT INTO shared_cards (id, card_id, sender_name, recipient_name, personal_note, custom_card_id, youtube_video_id, youtube_url, youtube_title, youtube_start_seconds, youtube_end_seconds, youtube_clip_enabled, voice_note_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          shareShortId, null, safeSender, safeRecipient, safePersonalNote, cardId,
          String(youtube.videoId).slice(0, 20),
          String(youtube.url).slice(0, 500),
          String(youtube.title).slice(0, 200),
          Number(youtube.startSeconds) || 0,
          Number(youtube.endSeconds) || 30,
          false,
          safeVoiceNoteUrl,
        ]
      );
      await shareClient.end();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: `${origin}/artists?payment=artist_success&cardId=${cardId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/artists?payment=artist_cancelled`,
        metadata: {
          customCardId: cardId,
          creatorName: safeCreatorName,
          senderName: safeSender,
          recipientName: safeRecipient,
          personalNote: safePersonalNote,
          shareId: shareShortId,
          youtube_clip: 'true',
        },
      });

      const updateClient = new pg.Client({ connectionString: process.env.DATABASE_URL });
      await updateClient.connect();
      await updateClient.query('UPDATE custom_cards SET stripe_session_id = $1 WHERE id = $2', [session.id, cardId]);
      await updateClient.end();

      return NextResponse.json({ id: cardId, checkoutUrl: session.url });
    }

    let shareShortId = generateShortId();
    let shareAttempts = 0;
    while (shareAttempts < 5) {
      const existing = await client.query('SELECT id FROM shared_cards WHERE id = $1', [shareShortId]);
      if (existing.rows.length === 0) break;
      shareShortId = generateShortId();
      shareAttempts++;
    }

    const safeVoiceNoteUrl2 = voiceNoteUrl ? String(voiceNoteUrl).trim().slice(0, 500) : null;

    await client.query(
      'INSERT INTO shared_cards (id, card_id, sender_name, recipient_name, personal_note, custom_card_id, voice_note_url) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [shareShortId, null, safeSender, safeRecipient, safePersonalNote, cardId, safeVoiceNoteUrl2]
    );

    await client.end();

    const shareUrl = `https://${domain}/c/${shareShortId}`;
    return NextResponse.json({ id: cardId, shareUrl });
  } catch (error: any) {
    console.error('Create custom card error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
