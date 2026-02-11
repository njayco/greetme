import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import { getAllBackedUpCards } from '@/lib/cardBackup';

async function restoreMissingCards(client: pg.Client): Promise<number> {
  try {
    const backedUpCards = await getAllBackedUpCards();
    if (backedUpCards.length === 0) return 0;

    const existingResult = await client.query('SELECT id FROM custom_cards');
    const existingIds = new Set(existingResult.rows.map((r: any) => r.id));

    let restoredCount = 0;
    for (const card of backedUpCards) {
      if (existingIds.has(card.id)) continue;
      try {
        await client.query(
          `INSERT INTO custom_cards (id, cover_image_url, centerfold_message, caption, back_message, category_ids, creator_name, is_public, is_approved, is_paid, stripe_session_id, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [card.id, card.cover_image_url, card.centerfold_message, card.caption, card.back_message, card.category_ids, card.creator_name, card.is_public, card.is_approved, card.is_paid, card.stripe_session_id, card.created_at]
        );
        restoredCount++;
      } catch (insertErr: any) {
        console.error(`Failed to restore card ${card.id}:`, insertErr.message);
      }
    }

    if (restoredCount > 0) {
      console.log(`Restored ${restoredCount} custom cards from backup`);
    }
    return restoredCount;
  } catch (err: any) {
    console.error('Backup restore check failed:', err.message);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('category');

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    await restoreMissingCards(client);

    let query = 'SELECT * FROM custom_cards WHERE is_public = true AND is_approved = true';
    const params: any[] = [];

    if (categoryId) {
      query += ' AND $1 = ANY(category_ids)';
      params.push(categoryId);
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const result = await client.query(query, params);
    await client.end();

    const cards = result.rows.map((row: any) => ({
      id: row.id,
      coverImageUrl: row.cover_image_url,
      centerfoldMessage: row.centerfold_message,
      caption: row.caption,
      backMessage: row.back_message,
      categoryIds: row.category_ids,
      creatorName: row.creator_name,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error('Fetch custom cards error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
