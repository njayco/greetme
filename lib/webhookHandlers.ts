import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import pg from 'pg';

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
          const youtubeAddonPriceId = process.env.YOUTUBE_ADDON_PRICE_ID;
          if (youtubeAddonPriceId && session.id) {
            try {
              const stripe = await getUncachableStripeClient();
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
              hasYoutubeAddon = lineItems.data.some(
                (item: any) => item.price?.id === youtubeAddonPriceId
              );
            } catch (err: any) {
              console.error('Failed to verify YouTube addon line items:', err.message);
            }
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
      }
    } catch (err: any) {
      console.error('YouTube clip webhook processing error:', err.message);
    }
  }
}
