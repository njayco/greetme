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
    const { cardId, from, to, note } = await request.json();

    if (!cardId || !from || !to) {
      return NextResponse.json({ error: 'cardId, from, and to are required' }, { status: 400 });
    }

    const senderName = String(from).trim().slice(0, 100);
    const recipientName = String(to).trim().slice(0, 100);
    const personalNote = note ? String(note).trim().slice(0, 500) : '';
    const numericCardId = Number(cardId);

    if (!senderName || !recipientName) {
      return NextResponse.json({ error: 'from and to must not be empty' }, { status: 400 });
    }

    if (isNaN(numericCardId) || !findCardById(numericCardId)) {
      return NextResponse.json({ error: 'Invalid card ID' }, { status: 400 });
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

    await client.query(
      'INSERT INTO shared_cards (id, card_id, sender_name, recipient_name, personal_note) VALUES ($1, $2, $3, $4, $5)',
      [shortId, numericCardId, senderName, recipientName, personalNote]
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
