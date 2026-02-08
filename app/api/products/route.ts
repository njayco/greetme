import { NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';

export async function GET() {
  try {
    const stripe = await getUncachableStripeClient();

    const products = await stripe.products.list({ limit: 100, active: true });
    const prices = await stripe.prices.list({ limit: 100, active: true });

    const productMap: Record<string, any> = {};
    for (const product of products.data) {
      if (product.metadata?.cardId) {
        const price = prices.data.find(p => p.product === product.id);
        productMap[product.metadata.cardId] = {
          productId: product.id,
          priceId: price?.id || null,
          unitAmount: price?.unit_amount || 0,
          currency: price?.currency || 'usd',
        };
      }
    }

    return NextResponse.json({ products: productMap });
  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    return NextResponse.json({ products: {} });
  }
}
