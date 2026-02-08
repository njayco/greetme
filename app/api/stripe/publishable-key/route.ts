import { NextResponse } from 'next/server';
import { getStripePublishableKey } from '@/lib/stripeClient';

export async function GET() {
  try {
    const publishableKey = await getStripePublishableKey();
    return NextResponse.json({ publishableKey });
  } catch (error: any) {
    console.error('Error getting publishable key:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
