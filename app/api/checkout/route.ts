import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { initStripe } from '@/lib/initStripe';
import { getOrCreateYoutubeAddonPrice } from '@/lib/youtubeAddon';

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    await initStripe();

    body = await request.json();
    const { priceId, cardTitle, shareId, senderName, successUrl, cancelUrl, addYoutubeClip } = body;

    console.log('Checkout request:', JSON.stringify({ priceId, cardTitle, shareId, addYoutubeClip }));

    const stripe = await getUncachableStripeClient();
    const origin = request.headers.get('origin') || request.nextUrl.origin;

    const lineItems: Array<{ price: string; quantity: number }> = [];

    if (priceId) {
      lineItems.push({ price: priceId, quantity: 1 });
    }

    if (addYoutubeClip) {
      const youtubeAddonPriceId = await getOrCreateYoutubeAddonPrice(stripe);
      lineItems.push({ price: youtubeAddonPriceId, quantity: 1 });
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No items to checkout' }, { status: 400 });
    }

    console.log('Creating checkout with line_items:', JSON.stringify(lineItems));

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
    console.error('Checkout request body was:', JSON.stringify(body));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
