import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { initStripe } from '@/lib/initStripe';

export async function POST(request: NextRequest) {
  try {
    await initStripe();

    const { priceId, cardTitle, successUrl, cancelUrl } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 });
    }

    const stripe = await getUncachableStripeClient();

    const origin = request.headers.get('origin') || request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: successUrl || `${origin}/?payment=success&card=${cardTitle || ''}`,
      cancel_url: cancelUrl || `${origin}/?payment=cancelled`,
      metadata: {
        cardTitle: cardTitle || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
