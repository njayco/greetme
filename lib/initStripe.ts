import { getStripeSync } from './stripeClient';

let initialized = false;

export async function initStripe() {
  if (initialized) return;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  try {
    const { runMigrations } = await import('stripe-replit-sync');

    console.log('Initializing Stripe schema...');
    await runMigrations({ databaseUrl, schema: 'stripe' });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    const domain = process.env.REPLIT_DOMAINS?.split(',')[0];
    if (domain) {
      try {
        console.log('Setting up managed webhook...');
        const webhookBaseUrl = `https://${domain}`;
        const result = await stripeSync.findOrCreateManagedWebhook(
          `${webhookBaseUrl}/api/stripe/webhook`
        );
        if (result?.webhook?.url) {
          console.log(`Webhook configured: ${result.webhook.url}`);
        } else {
          console.log('Webhook setup completed (no URL returned)');
        }
      } catch (webhookError: any) {
        console.warn('Webhook setup failed (non-fatal):', webhookError.message);
      }
    }

    stripeSync.syncBackfill()
      .then(() => console.log('Stripe data synced'))
      .catch((err: any) => console.error('Error syncing Stripe data:', err));

    initialized = true;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    throw error;
  }
}
