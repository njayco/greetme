const TESTBED_BASE = 'https://api-testbed.giftbit.com/papi/v1';
const PRODUCTION_BASE = 'https://api.giftbit.com/papi/v1';

function getBaseUrl(): string {
  const env = process.env.GIFTBIT_ENV || 'sandbox';
  return env === 'production' ? PRODUCTION_BASE : TESTBED_BASE;
}

function getToken(): string {
  const token = process.env.GIFTBIT_API_KEY;
  if (!token) throw new Error('GIFTBIT_API_KEY not configured');
  return token;
}

async function giftbitFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${getBaseUrl()}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.info?.message || data?.message || `Giftbit API error: ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export interface GiftbitBrand {
  brand_code: string;
  name: string;
  image_url: string;
  disclaimer?: string;
  min_price_in_cents?: number;
  max_price_in_cents?: number;
}

export interface GiftbitCampaignResult {
  info: { code: string; name: string; message: string };
  campaign?: any;
}

export async function listBrands(region: string = 'us'): Promise<GiftbitBrand[]> {
  const data = await giftbitFetch(`/brands?region=${encodeURIComponent(region)}`);
  return data.brands || [];
}

export async function getBrandDetails(brandCode: string): Promise<GiftbitBrand | null> {
  try {
    const data = await giftbitFetch(`/brands/${encodeURIComponent(brandCode)}`);
    return data.brand || null;
  } catch {
    return null;
  }
}

export async function createCampaign(params: {
  id: string;
  message: string;
  subject: string;
  contacts: Array<{ email: string; firstname?: string }>;
  brand_codes: string[];
  price_in_cents: number;
  delivery_type?: 'SHORTLINK' | 'EMAIL';
  expiry?: string;
}): Promise<GiftbitCampaignResult> {
  const body: any = {
    id: params.id,
    message: params.message,
    subject: params.subject,
    contacts: params.contacts,
    brand_codes: params.brand_codes,
    price_in_cents: params.price_in_cents,
    delivery_type: params.delivery_type || 'SHORTLINK',
  };

  if (params.expiry) {
    body.expiry = params.expiry;
  }

  return giftbitFetch('/campaign', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getGiftStatus(campaignId: string): Promise<any> {
  return giftbitFetch(`/campaign/${encodeURIComponent(campaignId)}`);
}

export async function getLinks(campaignId: string): Promise<any> {
  return giftbitFetch(`/links/${encodeURIComponent(campaignId)}`);
}

export async function getGifts(params?: { campaign_uuid?: string; limit?: number }): Promise<any> {
  const query = new URLSearchParams();
  if (params?.campaign_uuid) query.set('campaign_uuid', params.campaign_uuid);
  if (params?.limit) query.set('limit', params.limit.toString());
  const qs = query.toString();
  return giftbitFetch(`/gifts${qs ? '?' + qs : ''}`);
}

export async function getFunds(): Promise<any> {
  return giftbitFetch('/funds');
}

export async function ping(): Promise<any> {
  return giftbitFetch('/ping');
}
