import { NextResponse } from 'next/server';
import pg from 'pg';

export async function POST(request: Request) {
  try {
    const { shareId } = await request.json();

    if (!shareId || typeof shareId !== 'string' || shareId.length > 10) {
      return NextResponse.json({ error: 'Invalid share ID' }, { status: 400 });
    }

    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

    const existing = await pool.query(
      'SELECT cash_gift_status FROM shared_cards WHERE id = $1',
      [shareId]
    );

    if (existing.rows.length === 0) {
      await pool.end();
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (!existing.rows[0].cash_gift_status) {
      await pool.end();
      return NextResponse.json({ error: 'No cash gift on this card' }, { status: 400 });
    }

    if (existing.rows[0].cash_gift_status === 'confirmed') {
      await pool.end();
      return NextResponse.json({ status: 'confirmed', message: 'Already confirmed' });
    }

    await pool.query(
      'UPDATE shared_cards SET cash_gift_status = $1, cash_gift_confirmed_at = NOW() WHERE id = $2',
      ['confirmed', shareId]
    );

    await pool.end();
    return NextResponse.json({ status: 'confirmed' });
  } catch (error) {
    console.error('Cash gift confirm error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
