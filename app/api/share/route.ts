import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import { findCardById } from '@/lib/cardData';

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
    const { cardId, customCardId, from, to, note, youtube, giftCard, voiceNoteUrl, cashGift, signatureUrl } = await request.json();

    if (!customCardId && !cardId) {
      return NextResponse.json({ error: 'cardId or customCardId is required' }, { status: 400 });
    }

    if (!from || !to) {
      return NextResponse.json({ error: 'from and to are required' }, { status: 400 });
    }

    const senderName = String(from).trim().slice(0, 100);
    const recipientName = String(to).trim().slice(0, 100);
    const personalNote = note ? String(note).trim().slice(0, 500) : '';

    if (!senderName || !recipientName) {
      return NextResponse.json({ error: 'from and to must not be empty' }, { status: 400 });
    }

    let numericCardId: number | null = null;
    let safeCustomCardId: string | null = null;

    if (customCardId) {
      safeCustomCardId = String(customCardId).trim().slice(0, 8);
    } else {
      numericCardId = Number(cardId);
      if (isNaN(numericCardId) || !findCardById(numericCardId)) {
        return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 });
      }
    }

    let youtubeVideoId: string | null = null;
    let youtubeUrl: string | null = null;
    let youtubeTitle: string | null = null;
    let youtubeStartSeconds: number | null = null;
    let youtubeEndSeconds: number | null = null;

    if (youtube && youtube.enabled) {
      if (!youtube.videoId || !youtube.url || !youtube.title || youtube.startSeconds == null) {
        return NextResponse.json({ error: 'YouTube clip requires videoId, url, title, and startSeconds' }, { status: 400 });
      }

      youtubeStartSeconds = Math.max(0, Math.floor(Number(youtube.startSeconds)));
      youtubeEndSeconds = youtubeStartSeconds + 30;
      youtubeVideoId = String(youtube.videoId).trim().slice(0, 20);
      youtubeUrl = String(youtube.url).trim().slice(0, 500);
      youtubeTitle = String(youtube.title).trim().slice(0, 200);
    }

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    let shortId = generateShortId();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await client.query('SELECT id FROM shared_cards WHERE id = $1', [shortId]);
      if (existing.rows.length === 0) break;
      shortId = generateShortId();
      attempts++;
    }

    let giftCardBrand: string | null = null;
    let giftCardAmountCents: number | null = null;
    let giftCardRecipientEmail: string | null = null;

    if (giftCard && giftCard.brandCode && giftCard.amountCents && giftCard.recipientEmail) {
      giftCardBrand = String(giftCard.brandCode).trim().slice(0, 100);
      giftCardAmountCents = Math.max(100, Math.floor(Number(giftCard.amountCents)));
      giftCardRecipientEmail = String(giftCard.recipientEmail).trim().slice(0, 255);
    }

    const safeVoiceNoteUrl = voiceNoteUrl ? String(voiceNoteUrl).trim().slice(0, 500) : null;
    const safeSignatureUrl = signatureUrl ? String(signatureUrl).trim().slice(0, 500) : null;

    let cashGiftAmount: number | null = null;
    let cashGiftCashtag: string | null = null;

    if (cashGift && cashGift.cashtag && cashGift.amount > 0) {
      const rawTag = String(cashGift.cashtag).trim().replace(/^\$/, '').replace(/[^a-zA-Z0-9_]/g, '');
      const rawAmount = Math.floor(Number(cashGift.amount));
      if (rawTag.length < 1 || rawTag.length > 30) {
        return NextResponse.json({ error: 'Invalid Cash App tag' }, { status: 400 });
      }
      if (rawAmount < 1 || rawAmount > 500) {
        return NextResponse.json({ error: 'Cash gift amount must be between $1 and $500' }, { status: 400 });
      }
      cashGiftCashtag = rawTag;
      cashGiftAmount = rawAmount;
    }

    await client.query(
      `INSERT INTO shared_cards (id, card_id, sender_name, recipient_name, personal_note, custom_card_id, youtube_video_id, youtube_url, youtube_title, youtube_start_seconds, youtube_end_seconds, youtube_clip_enabled, gift_card_brand, gift_card_amount_cents, gift_card_recipient_email, gift_card_status, voice_note_url, cash_gift_amount, cash_gift_cashtag, cash_gift_status, signature_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
      [shortId, numericCardId, senderName, recipientName, personalNote, safeCustomCardId, youtubeVideoId, youtubeUrl, youtubeTitle, youtubeStartSeconds, youtubeEndSeconds, false, giftCardBrand, giftCardAmountCents, giftCardRecipientEmail, giftCardBrand ? 'pending' : null, safeVoiceNoteUrl, cashGiftAmount, cashGiftCashtag, cashGiftCashtag ? 'pending' : null, safeSignatureUrl]
    );

    await client.end();

    const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || request.headers.get('host') || '';
    const shortUrl = `https://${domain}/c/${shortId}`;

    return NextResponse.json({ url: shortUrl, id: shortId });
  } catch (error: any) {
    console.error('Share link error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
