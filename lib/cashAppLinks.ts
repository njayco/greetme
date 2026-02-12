const CASHAPP_BASE_URL = process.env.NEXT_PUBLIC_CASHAPP_BASE_URL || 'https://cash.app';

export function sanitizeCashtag(input: string): string {
  let tag = input.trim();
  if (tag.startsWith('$')) tag = tag.slice(1);
  return tag.replace(/[^a-zA-Z0-9_]/g, '');
}

export function isValidCashtag(tag: string): boolean {
  const clean = sanitizeCashtag(tag);
  return clean.length >= 1 && clean.length <= 30;
}

export function getRequestUrl(creatorCashtag: string, amount: number, note?: string): string {
  const clean = sanitizeCashtag(creatorCashtag);
  const params = new URLSearchParams();
  params.set('amount', amount.toString());
  if (note) params.set('note', note);
  return `${CASHAPP_BASE_URL}/$${clean}?${params.toString()}`;
}

export function getCashAppDownloadUrl(): { ios: string; android: string; web: string } {
  return {
    ios: 'https://apps.apple.com/us/app/cash-app/id711923939',
    android: 'https://play.google.com/store/apps/details?id=com.squareup.cash',
    web: 'https://cash.app/',
  };
}
