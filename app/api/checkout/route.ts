import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { initStripe } from '@/lib/initStripe';

export async function POST(request: NextRequest) {
  try {
    await initStripe();

    const { priceId, cardTitle, shareId, senderName, successUrl, cancelUrl, addYoutubeClip } = await request.json();

    const stripe = await getUncachableStripeClient();
    const origin = request.headers.get('origin') || request.nextUrl.origin;

    const lineItems: Array<{ price: string; quantity: number }> = [];

    if (priceId) {
      lineItems.push({ price: priceId, quantity: 1 });
    }

    if (addYoutubeClip) {
      const youtubeAddonPriceId = process.env.YOUTUBE_ADDON_PRICE_ID;
      if (!youtubeAddonPriceId) {
        return NextResponse.json({ error: 'YouTube add-on not configured' }, { status: 500 });
      }
      lineItems.push({ price: youtubeAddonPriceId, quantity: 1 });
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No items to checkout' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${origin}/?payment=success&card=${cardTitle || ''}`,
      cancel_url: cancelUrl || `${origin}/?payment=cancelled`,
      metadata: {
        cardTitle: cardTitle || '',
        shareId: shareId || '',
        senderName: senderName || '',
        youtube_clip: addYoutubeClip ? 'true' : 'false',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
