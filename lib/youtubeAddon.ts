import Stripe from 'stripe';

let cachedYoutubeAddonPriceId: string | null = null;

export async function getOrCreateYoutubeAddonPrice(stripe: Stripe): Promise<string> {
  if (cachedYoutubeAddonPriceId) {
    try {
      const price = await stripe.prices.retrieve(cachedYoutubeAddonPriceId);
      if (price.active) return cachedYoutubeAddonPriceId;
    } catch {
      cachedYoutubeAddonPriceId = null;
    }
  }

  const envPriceId = process.env.YOUTUBE_ADDON_PRICE_ID;
  if (envPriceId) {
    try {
      const price = await stripe.prices.retrieve(envPriceId);
      if (price.active) {
        cachedYoutubeAddonPriceId = envPriceId;
        return envPriceId;
      }
    } catch {
      console.log('YOUTUBE_ADDON_PRICE_ID not found in current Stripe mode, will find or create one');
    }
  }

  const products = await stripe.products.list({ limit: 100, active: true });
  const existing = products.data.find((p: any) => p.metadata?.type === 'youtube_clip_addon');

  if (existing) {
    const prices = await stripe.prices.list({ product: existing.id, active: true });
    const price99 = prices.data.find((p: any) => p.unit_amount === 99 && p.currency === 'usd');
    if (price99) {
      cachedYoutubeAddonPriceId = price99.id;
      return price99.id;
    }
    const newPrice = await stripe.prices.create({
      product: existing.id,
      unit_amount: 99,
      currency: 'usd',
    });
    cachedYoutubeAddonPriceId = newPrice.id;
    return newPrice.id;
  }

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
  cachedYoutubeAddonPriceId = price.id;
  console.log('Created YouTube addon product/price:', product.id, price.id);
  return price.id;
}
