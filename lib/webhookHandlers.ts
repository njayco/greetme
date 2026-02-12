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
          await WebhookHandlers.saveGiftCardPaymentMethod(session, shareId);
        }
      }
    } catch (err: any) {
      console.error('Webhook processing error:', err.message);
    }
  }

  static async saveGiftCardPaymentMethod(session: any, shareId: string): Promise<void> {
    const stripe = await getUncachableStripeClient();
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
      let customerId: string | null = null;
      let paymentMethodId: string | null = null;

      if (session.mode === 'setup') {
        const setupIntentId = session.setup_intent;
        if (setupIntentId) {
          const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
          customerId = typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id || null;
          paymentMethodId = typeof setupIntent.payment_method === 'string' ? setupIntent.payment_method : setupIntent.payment_method?.id || null;

          if (!customerId && paymentMethodId) {
            const customer = await stripe.customers.create({
              metadata: { shareId, source: 'greetme_gift_card' },
            });
            customerId = customer.id;

            await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
          }
        }
      } else if (session.mode === 'payment') {
        customerId = session.customer;
        const paymentIntentId = session.payment_intent;

        if (paymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          paymentMethodId = typeof paymentIntent.payment_method === 'string' ? paymentIntent.payment_method : paymentIntent.payment_method?.id || null;
        }

        if (!customerId && paymentMethodId) {
          const customer = await stripe.customers.create({
            metadata: { shareId, source: 'greetme_gift_card' },
          });
          customerId = customer.id;
          await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
        }
      }

      if (customerId && paymentMethodId) {
        await client.query(
          `UPDATE shared_cards SET stripe_customer_id = $1, stripe_payment_method_id = $2, gift_card_status = 'pending' WHERE id = $3`,
          [customerId, paymentMethodId, shareId]
        );
        console.log(`Gift card payment method saved for share ${shareId}: customer=${customerId}, pm=${paymentMethodId}`);
      } else {
        console.error(`Could not save payment method for gift card share ${shareId}: customer=${customerId}, pm=${paymentMethodId}`);
        await client.query(
          `UPDATE shared_cards SET gift_card_status = 'setup_failed' WHERE id = $1`,
          [shareId]
        );
      }
    } catch (err: any) {
      console.error('Error saving gift card payment method:', err.message);
      await client.query(
        `UPDATE shared_cards SET gift_card_status = 'setup_failed' WHERE id = $1`,
        [shareId]
      );
    } finally {
      await client.end();
    }
  }
}
