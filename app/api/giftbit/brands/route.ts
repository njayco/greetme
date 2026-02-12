import { NextResponse } from 'next/server';
import { listBrands, getBrandDetails } from '@/lib/giftbitClient';

let brandsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000;

export async function GET() {
  try {
    if (brandsCache && Date.now() - brandsCache.timestamp < CACHE_TTL) {
      return NextResponse.json({ brands: brandsCache.data });
    }

    const brands = await listBrands('us');

    const detailedBrands = await Promise.all(
      brands.map(async (b) => {
        const details = await getBrandDetails(b.brand_code);
        return {
          brand_code: b.brand_code,
          name: b.name,
          image_url: details?.image_url || b.image_url,
          disclaimer: details?.disclaimer || b.disclaimer || null,
          min_price_in_cents: details?.min_price_in_cents || 0,
          max_price_in_cents: details?.max_price_in_cents || 100000,
        };
      })
    );

    brandsCache = { data: detailedBrands, timestamp: Date.now() };

    return NextResponse.json({ brands: detailedBrands });
  } catch (error: any) {
    console.error('Giftbit brands error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
