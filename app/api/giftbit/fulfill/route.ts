import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';
import { createCampaign, getLinks } from '@/lib/giftbitClient';

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stripeSessionId, shareId, brandCode, brandName, amountCents, recipientEmail, recipientName, senderName } = body;

    if (!stripeSessionId || !shareId || !brandCode || !amountCents || !recipientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const existing = await client.query(
      'SELECT id FROM giftbit_orders WHERE stripe_session_id = $1',
      [stripeSessionId]
    );
    if (existing.rows.length > 0) {
      await client.end();
      return NextResponse.json({ message: 'Already fulfilled', orderId: existing.rows[0].id });
    }

    const orderId = generateId();
    const campaignId = `greetme-${orderId}-${Date.now()}`;

    await client.query(
      `INSERT INTO giftbit_orders (id, stripe_session_id, share_id, brand_code, brand_name, amount_cents, currency, recipient_email, recipient_name, sender_name, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'USD', $7, $8, $9, 'pending')`,
      [orderId, stripeSessionId, shareId, brandCode, brandName || '', amountCents, recipientEmail, recipientName || '', senderName || '']
    );

    try {
      const campaignResult = await createCampaign({
        id: campaignId,
        message: `${senderName || 'Someone'} sent you a gift card with your GreetMe greeting card!`,
        subject: `You received a ${brandName || 'Gift Card'} from ${senderName || 'a friend'}!`,
        contacts: [{ email: recipientEmail, firstname: recipientName || undefined }],
        brand_codes: [brandCode],
        price_in_cents: amountCents,
        delivery_type: 'SHORTLINK',
      });

      const giftbitCampaignId = campaignResult.campaign?.uuid || campaignId;

      await client.query(
        `UPDATE giftbit_orders SET giftbit_campaign_id = $1, status = 'sent', raw_response = $2, updated_at = NOW() WHERE id = $3`,
        [giftbitCampaignId, JSON.stringify(campaignResult), orderId]
      );

      let linkUrl = null;
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const linksData = await getLinks(giftbitCampaignId);
        if (linksData.links && linksData.links.length > 0) {
          linkUrl = linksData.links[0].url || linksData.links[0].shortlink;
        }
      } catch (linkErr: any) {
        console.log('Links not ready yet, will be available later:', linkErr.message);
      }

      if (linkUrl) {
        await client.query(
          `UPDATE giftbit_orders SET giftbit_link_url = $1, updated_at = NOW() WHERE id = $2`,
          [linkUrl, orderId]
        );
        await client.query(
          `UPDATE shared_cards SET gift_card_link = $1, gift_card_status = 'sent' WHERE id = $2`,
          [linkUrl, shareId]
        );
      } else {
        await client.query(
          `UPDATE shared_cards SET gift_card_status = 'sent' WHERE id = $1`,
          [shareId]
        );
      }

      await client.end();
      return NextResponse.json({ success: true, orderId, linkUrl, status: 'sent' });
    } catch (giftbitErr: any) {
      console.error('Giftbit campaign creation failed:', giftbitErr.message);
      await client.query(
        `UPDATE giftbit_orders SET status = 'failed', raw_response = $1, updated_at = NOW() WHERE id = $2`,
        [JSON.stringify({ error: giftbitErr.message }), orderId]
      );
      await client.query(
        `UPDATE shared_cards SET gift_card_status = 'failed' WHERE id = $1`,
        [shareId]
      );
      await client.end();
      return NextResponse.json({ error: 'Gift card fulfillment failed', orderId }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Fulfill error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
