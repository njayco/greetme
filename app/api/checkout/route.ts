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

    const lineItems: Array<{ price?: string; price_data?: any; quantity: number }> = [];

    if (priceId) {
      lineItems.push({ price: priceId, quantity: 1 });
    }

    if (addYoutubeClip) {
      const youtubeAddonPriceId = await getOrCreateYoutubeAddonPrice(stripe);
      lineItems.push({ price: youtubeAddonPriceId, quantity: 1 });
    }

    const hasImmediateCharges = lineItems.length > 0;
    const hasGiftCard = giftCard && giftCard.brandCode && giftCard.amountCents > 0;

    if (!hasImmediateCharges && !hasGiftCard) {
      return NextResponse.json({ error: 'No items to checkout' }, { status: 400 });
    }

    const resolvedSuccessUrl = successUrl || `${origin}/?payment=success&card=${cardTitle || ''}`;
    const resolvedCancelUrl = cancelUrl || `${origin}/?payment=cancelled`;

    if (hasGiftCard && !hasImmediateCharges) {
      console.log('Gift card only - using setup mode to save payment method');
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'setup',
        success_url: resolvedSuccessUrl,
        cancel_url: resolvedCancelUrl,
        metadata,
      });

      return NextResponse.json({ url: session.url });
    }

    if (hasGiftCard && hasImmediateCharges) {
      console.log('Gift card + other items - payment mode with setup_future_usage');
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        allow_promotion_codes: true,
        payment_intent_data: {
          setup_future_usage: 'off_session',
        },
        success_url: resolvedSuccessUrl,
        cancel_url: resolvedCancelUrl,
        metadata,
      });

      return NextResponse.json({ url: session.url });
    }

    console.log('No gift card - standard payment mode');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: resolvedSuccessUrl,
      cancel_url: resolvedCancelUrl,
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    console.error('Checkout request body was:', JSON.stringify(body));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
