import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { createCampaign, getLinks } from '@/lib/giftbitClient';
import pg from 'pg';

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: shareId } = await params;
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query(
      'SELECT * FROM shared_cards WHERE id = $1',
      [shareId]
    );

    if (result.rows.length === 0) {
      await client.end();
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const card = result.rows[0];

    if (!card.gift_card_brand || !card.gift_card_amount_cents) {
      await client.end();
      return NextResponse.json({ error: 'No gift card attached to this card' }, { status: 400 });
    }

    if (card.gift_card_status === 'redeemed') {
      await client.end();
      return NextResponse.json({ error: 'Gift card has already been redeemed', alreadyRedeemed: true }, { status: 400 });
    }

    if (!card.stripe_customer_id || !card.stripe_payment_method_id) {
      await client.end();
      return NextResponse.json({ error: 'Payment method not set up. The sender may need to complete checkout first.' }, { status: 400 });
    }

    const stripe = await getUncachableStripeClient();

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: card.gift_card_amount_cents,
        currency: 'usd',
        customer: card.stripe_customer_id,
        payment_method: card.stripe_payment_method_id,
        confirm: true,
        off_session: true,
        description: `GreetMe Gift Card - ${card.gift_card_brand} for ${card.gift_card_recipient_email}`,
        metadata: {
          shareId,
          type: 'gift_card_redemption',
          brand: card.gift_card_brand,
        },
      });
    } catch (stripeErr: any) {
      console.error('Gift card charge failed:', stripeErr.message);
      await client.query(
        `UPDATE shared_cards SET gift_card_status = 'charge_failed' WHERE id = $1`,
        [shareId]
      );
      await client.end();
      return NextResponse.json({ error: 'Payment failed. The sender\'s card could not be charged.' }, { status: 402 });
    }

    if (paymentIntent.status !== 'succeeded') {
      await client.query(
        `UPDATE shared_cards SET gift_card_status = 'charge_failed' WHERE id = $1`,
        [shareId]
      );
      await client.end();
      return NextResponse.json({ error: 'Payment was not successful. Please try again later.' }, { status: 402 });
    }

    const orderId = generateId();
    const campaignId = `greetme-${orderId}-${Date.now()}`;
    const senderName = card.sender_name || 'Someone';
    const recipientName = card.recipient_name || '';
    const brandName = card.gift_card_brand;
    const recipientEmail = card.gift_card_recipient_email;

    await client.query(
      `INSERT INTO giftbit_orders (id, stripe_session_id, share_id, brand_code, brand_name, amount_cents, currency, recipient_email, recipient_name, sender_name, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'USD', $7, $8, $9, 'pending')`,
      [orderId, paymentIntent.id, shareId, card.gift_card_brand, brandName, card.gift_card_amount_cents, recipientEmail, recipientName, senderName]
    );

    try {
      const campaignResult = await createCampaign({
        id: campaignId,
        message: `${senderName} sent you a gift card with your GreetMe greeting card!`,
        subject: `You received a ${brandName} gift card from ${senderName}!`,
        contacts: [{ email: recipientEmail, firstname: recipientName || undefined }],
        brand_codes: [card.gift_card_brand],
        price_in_cents: card.gift_card_amount_cents,
        delivery_type: 'SHORTLINK',
      });

      const giftbitCampaignId = campaignResult.campaign?.uuid || campaignId;

      await client.query(
        `UPDATE giftbit_orders SET giftbit_campaign_id = $1, status = 'sent', raw_response = $2, updated_at = NOW() WHERE id = $3`,
        [giftbitCampaignId, JSON.stringify(campaignResult), orderId]
      );

      let linkUrl = null;
      let retries = 0;
      while (!linkUrl && retries < 3) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
          const linksData = await getLinks(giftbitCampaignId);
          if (linksData.shortlinks && linksData.shortlinks.length > 0) {
            linkUrl = linksData.shortlinks[0].shortlink;
          } else if (linksData.links && linksData.links.length > 0) {
            linkUrl = linksData.links[0].url || linksData.links[0].shortlink;
          }
        } catch (linkErr: any) {
          console.log(`Gift card link attempt ${retries + 1} not ready:`, linkErr.message);
        }
        retries++;
      }

      if (linkUrl) {
        await client.query(
          `UPDATE giftbit_orders SET giftbit_link_url = $1, updated_at = NOW() WHERE id = $2`,
          [linkUrl, orderId]
        );
      }

      await client.query(
        `UPDATE shared_cards SET gift_card_status = 'redeemed', gift_card_link = $1 WHERE id = $2`,
        [linkUrl, shareId]
      );

      await client.end();

      return NextResponse.json({
        success: true,
        redeemed: true,
        giftCardLink: linkUrl,
        amount: card.gift_card_amount_cents,
        brand: brandName,
      });
    } catch (giftbitErr: any) {
      console.error('Giftbit campaign creation failed after charge:', giftbitErr.message);

      await client.query(
        `UPDATE giftbit_orders SET status = 'failed', raw_response = $1, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify({ error: giftbitErr.message }), orderId]
      );
      await client.query(
        `UPDATE shared_cards SET gift_card_status = 'charge_succeeded_fulfill_failed' WHERE id = $1`,
        [shareId]
      );
      await client.end();

      return NextResponse.json({
        error: 'Payment succeeded but gift card generation failed. Our team will resolve this shortly.',
        charged: true,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Redeem error:', error.message);
    await client.end();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
