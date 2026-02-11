import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { initStripe } from '@/lib/initStripe';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, cardId } = await request.json();

    if (!sessionId || !cardId) {
      return NextResponse.json({ error: 'sessionId and cardId are required' }, { status: 400 });
    }

    await initStripe();
    const stripe = await getUncachableStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    await client.query(
      'UPDATE custom_cards SET is_paid = true WHERE id = $1 AND stripe_session_id = $2',
      [cardId, sessionId]
    );

    const shareId = session.metadata?.shareId;

    if (shareId) {
      const existing = await client.query('SELECT id FROM shared_cards WHERE id = $1', [shareId]);
      if (existing.rows.length > 0) {
        const hasYoutubeClip = session.metadata?.youtube_clip === 'true';
        if (hasYoutubeClip) {
          const youtubeAddonPriceId = process.env.YOUTUBE_ADDON_PRICE_ID;
          if (youtubeAddonPriceId) {
            try {
              const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
              const addonPaid = lineItems.data.some(
                (item: any) => item.price?.id === youtubeAddonPriceId
              );
              if (addonPaid) {
                await client.query(
                  'UPDATE shared_cards SET youtube_clip_enabled = true WHERE id = $1',
                  [shareId]
                );
              }
            } catch (err: any) {
              console.error('Failed to verify YouTube addon:', err.message);
            }
          }
        }

        await client.end();
        const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || request.headers.get('host') || '';
        const shareUrl = `https://${domain}/c/${shareId}`;
        return NextResponse.json({ success: true, shareUrl });
      }
    }

    const senderName = session.metadata?.senderName || session.metadata?.creatorName || '';
    const recipientName = session.metadata?.recipientName || '';
    const personalNoteVal = session.metadata?.personalNote || '';

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let shareShortId = '';
    for (let i = 0; i < 7; i++) shareShortId += chars.charAt(Math.floor(Math.random() * chars.length));

    let shareAttempts = 0;
    while (shareAttempts < 5) {
      const existing = await client.query('SELECT id FROM shared_cards WHERE id = $1', [shareShortId]);
      if (existing.rows.length === 0) break;
      shareShortId = '';
      for (let i = 0; i < 7; i++) shareShortId += chars.charAt(Math.floor(Math.random() * chars.length));
      shareAttempts++;
    }

    await client.query(
      'INSERT INTO shared_cards (id, card_id, sender_name, recipient_name, personal_note, custom_card_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [shareShortId, null, senderName, recipientName, personalNoteVal, cardId]
    );

    await client.end();

    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || request.headers.get('host') || '';
    const shareUrl = `https://${domain}/c/${shareShortId}`;

    return NextResponse.json({ success: true, shareUrl });
  } catch (error: any) {
    console.error('Confirm payment error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
