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

    await client.end();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Confirm payment error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
