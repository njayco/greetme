import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('category');

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

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
