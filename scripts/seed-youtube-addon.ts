import { getUncachableStripeClient } from '../lib/stripeClient';
import { initStripe } from '../lib/initStripe';

async function seedYouTubeAddon() {
  console.log('Initializing Stripe...');
  await initStripe();

  const stripe = await getUncachableStripeClient();

  const existingProducts = await stripe.products.list({ limit: 100, active: true });
  const existing = existingProducts.data.find(p => p.metadata?.type === 'youtube_clip_addon');

  if (existing) {
    const prices = await stripe.prices.list({ product: existing.id, active: true });
    const price99 = prices.data.find(p => p.unit_amount === 99);
    if (price99) {
      console.log(`YouTube Clip Add-on already exists!`);
      console.log(`Product ID: ${existing.id}`);
      console.log(`Price ID: ${price99.id}`);
      console.log(`\nSet this environment variable:`);
      console.log(`YOUTUBE_ADDON_PRICE_ID=${price99.id}`);
      return;
    }
  }

  console.log('Creating YouTube Clip Add-on product...');
  const product = await stripe.products.create({
    name: 'YouTube Clip Add-on (30s)',
    description: 'Add a 30-second YouTube audio clip to your greeting card',
    metadata: { type: 'youtube_clip_addon' },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 99,
    currency: 'usd',
  });

  console.log(`Product created: ${product.id}`);
  console.log(`Price created: ${price.id}`);
  console.log(`\nSet this environment variable:`);
  console.log(`YOUTUBE_ADDON_PRICE_ID=${price.id}`);
}

seedYouTubeAddon().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
