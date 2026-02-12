import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { initStripe } from '@/lib/initStripe';
import { getOrCreateYoutubeAddonPrice } from '@/lib/youtubeAddon';

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    await initStripe();

    body = await request.json();
    const { priceId, cardTitle, shareId, senderName, successUrl, cancelUrl, addYoutubeClip, giftCard } = body;

    console.log('Checkout request:', JSON.stringify({ priceId, cardTitle, shareId, addYoutubeClip, hasGiftCard: !!giftCard }));

    const stripe = await getUncachableStripeClient();
    const origin = request.headers.get('origin') || request.nextUrl.origin;

    const lineItems: Array<{ price?: string; price_data?: any; quantity: number }> = [];

    if (priceId) {
      lineItems.push({ price: priceId, quantity: 1 });
    }

    if (addYoutubeClip) {
      const youtubeAddonPriceId = await getOrCreateYoutubeAddonPrice(stripe);
      lineItems.push({ price: youtubeAddonPriceId, quantity: 1 });
    }

    if (giftCard && giftCard.brandCode && giftCard.amountCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${giftCard.brandName || 'Gift Card'} Gift Card`,
            description: `$${(giftCard.amountCents / 100).toFixed(2)} gift card for ${giftCard.recipientEmail || 'recipient'}`,
          },
          unit_amount: giftCard.amountCents,
        },
        quantity: 1,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No items to checkout' }, { status: 400 });
    }

    console.log('Creating checkout with line_items:', JSON.stringify(lineItems));

    const metadata: any = {
      cardTitle: cardTitle || '',
      shareId: shareId || '',
      senderName: senderName || '',
      youtube_clip: addYoutubeClip ? 'true' : 'false',
    };

    if (giftCard) {
      metadata.gift_card = 'true';
      metadata.gift_card_brand = giftCard.brandCode || '';
      metadata.gift_card_brand_name = giftCard.brandName || '';
      metadata.gift_card_amount_cents = String(giftCard.amountCents || 0);
      metadata.gift_card_recipient_email = giftCard.recipientEmail || '';
      metadata.gift_card_recipient_name = giftCard.recipientName || '';
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: successUrl || `${origin}/?payment=success&card=${cardTitle || ''}`,
      cancel_url: cancelUrl || `${origin}/?payment=cancelled`,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    console.error('Checkout request body was:', JSON.stringify(body));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
