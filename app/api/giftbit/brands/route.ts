import { NextResponse } from 'next/server';
import { listBrands } from '@/lib/giftbitClient';

let brandsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

export async function GET() {
  try {
    if (brandsCache && Date.now() - brandsCache.timestamp < CACHE_TTL) {
      return NextResponse.json({ brands: brandsCache.data });
    }

    const brands = await listBrands('us');

    const normalized = brands.map((b) => ({
      brand_code: b.brand_code,
      name: b.name,
      image_url: b.image_url,
      disclaimer: b.disclaimer || null,
    }));

    brandsCache = { data: normalized, timestamp: Date.now() };

    return NextResponse.json({ brands: normalized });
  } catch (error: any) {
    console.error('Giftbit brands error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
