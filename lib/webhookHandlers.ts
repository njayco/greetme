import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import pg from 'pg';
import { createCampaign, getLinks } from './giftbitClient';

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '.'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    try {
      const event = JSON.parse(payload.toString());
      if (event.type === 'checkout.session.completed') {
        const session = event.data?.object;
        const metadata = session?.metadata;
        const shareId = metadata?.shareId;

        if (!shareId) return;

        let hasYoutubeAddon = false;

        if (metadata?.youtube_clip === 'true') {
          if (session.id) {
            try {
              const stripe = await getUncachableStripeClient();
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
              hasYoutubeAddon = lineItems.data.some(
                (item: any) => {
                  if (item.price?.unit_amount === 99 && item.price?.currency === 'usd') {
                    return true;
                  }
                  return false;
                }
              );
            } catch (err: any) {
              console.error('Failed to verify YouTube addon line items:', err.message);
              hasYoutubeAddon = true;
            }
          } else {
            hasYoutubeAddon = true;
          }
        }

        if (hasYoutubeAddon) {
          const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
          await client.connect();
          await client.query(
            'UPDATE shared_cards SET youtube_clip_enabled = true WHERE id = $1',
            [shareId]
          );
          await client.end();
          console.log(`YouTube clip enabled for share ${shareId}`);
        }

        if (metadata?.gift_card === 'true') {
          await WebhookHandlers.fulfillGiftCard(session.id, shareId, metadata);
        }
      }
    } catch (err: any) {
      console.error('Webhook processing error:', err.message);
    }
  }

  static async fulfillGiftCard(stripeSessionId: string, shareId: string, metadata: any): Promise<void> {
    const brandCode = metadata.gift_card_brand;
    const brandName = metadata.gift_card_brand_name || brandCode;
    const amountCents = parseInt(metadata.gift_card_amount_cents, 10);
    const recipientEmail = metadata.gift_card_recipient_email;
    const recipientName = metadata.gift_card_recipient_name || '';
    const senderName = metadata.senderName || '';

    if (!brandCode || !amountCents || !recipientEmail) {
      console.error('Missing gift card metadata for fulfillment');
      return;
    }

    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
      const existing = await client.query(
        'SELECT id FROM giftbit_orders WHERE stripe_session_id = $1',
        [stripeSessionId]
      );
      if (existing.rows.length > 0) {
        console.log('Gift card already fulfilled for session:', stripeSessionId);
        await client.end();
        return;
      }

      const orderId = generateId();
      const campaignId = `greetme-${orderId}-${Date.now()}`;

      await client.query(
        `INSERT INTO giftbit_orders (id, stripe_session_id, share_id, brand_code, brand_name, amount_cents, currency, recipient_email, recipient_name, sender_name, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'USD', $7, $8, $9, 'pending')`,
        [orderId, stripeSessionId, shareId, brandCode, brandName, amountCents, recipientEmail, recipientName, senderName]
      );

      try {
        const campaignResult = await createCampaign({
          id: campaignId,
          message: `${senderName || 'Someone'} sent you a gift card with your GreetMe greeting card!`,
          subject: `You received a ${brandName} gift card from ${senderName || 'a friend'}!`,
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
          console.log('Gift card links not ready yet:', linkErr.message);
        }

        if (linkUrl) {
          await client.query(
            `UPDATE giftbit_orders SET giftbit_link_url = $1, updated_at = NOW() WHERE id = $2`,
            [linkUrl, orderId]
          );
        }

        await client.query(
          `UPDATE shared_cards SET gift_card_status = 'sent', gift_card_link = $1 WHERE id = $2`,
          [linkUrl, shareId]
        );

        console.log(`Gift card fulfilled for share ${shareId}, order ${orderId}, link: ${linkUrl || 'pending'}`);
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
      }
    } finally {
      await client.end();
    }
  }
}
