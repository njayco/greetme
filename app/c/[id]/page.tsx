/**
 * page.tsx — Server component for the shared greeting-card page (/c/[id]).
 *
 * Responsibilities:
 *  1. Fetch the shared card record from PostgreSQL (including optional
 *     YouTube clip, voice note, and gift card data).
 *  2. Generate dynamic Open Graph / Twitter Card metadata so link previews
 *     show the card image, sender name, and category.
 *  3. Render the ShareCardClient component with all resolved data, or
 *     show a "Card Not Found" fallback if the ID is invalid.
 */
import { Metadata } from 'next';
import pg from 'pg';
import { findCardById } from '@/lib/cardData';
import ShareCardClient from './ShareCardClient';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Converts object-storage paths (e.g. /objects/...) into API-served URLs.
 * Regular URLs (e.g. /images/...) are returned unchanged.
 */
function resolveImageUrl(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('/objects/')) {
    return `/api/uploads/serve?path=${encodeURIComponent(url)}`;
  }
  return url;
}

/**
 * Fetch a shared card and all related data from the database.
 *
 * Handles two card types:
 *  - Custom cards (artist-uploaded) — looked up via `custom_card_id` in the
 *    `custom_cards` table.
 *  - Catalog cards — resolved from the in-memory card catalog via `findCardById`.
 *
 * Also extracts optional attachments:
 *  - YouTube clip (video ID, start/end times)
 *  - Voice note URL
 *  - Gift card (amount, brand, redemption status)
 */
async function getSharedCard(id: string) {
  try {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const result = await client.query(
      'SELECT * FROM shared_cards WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      await client.end();
      return null;
    }

    const row = result.rows[0];

    // Build YouTube clip object only when clip data is present and enabled
    const youtubeClip = row.youtube_clip_enabled && row.youtube_video_id ? {
      videoId: row.youtube_video_id,
      url: row.youtube_url,
      title: row.youtube_title || 'YouTube Video',
      startSeconds: row.youtube_start_seconds || 0,
      endSeconds: row.youtube_end_seconds || 30,
    } : null;

    const voiceNoteUrl = row.voice_note_url || null;

    // Build gift card object only when brand and amount are set
    const giftCard = row.gift_card_brand && row.gift_card_amount_cents ? {
      amountCents: row.gift_card_amount_cents,
      link: row.gift_card_link || null,
      brand: row.gift_card_brand || 'Gift Card',
      status: row.gift_card_status || 'pending',
      shareId: row.id,
    } : null;

    // Custom (artist) card path — query the custom_cards table
    if (row.custom_card_id) {
      const customResult = await client.query(
        'SELECT * FROM custom_cards WHERE id = $1',
        [row.custom_card_id]
      );
      await client.end();

      if (customResult.rows.length === 0) return null;

      const customCard = customResult.rows[0];
      return {
        id: row.id,
        cardId: null,
        senderName: row.sender_name,
        recipientName: row.recipient_name,
        personalNote: row.personal_note || '',
        card: {
          id: 0,
          title: customCard.caption || 'Custom Card',
          cover: resolveImageUrl(customCard.cover_image_url),
          centerfold: customCard.centerfold_message,
          back: customCard.back_message,
        },
        categoryName: 'Custom',
        youtubeClip,
        giftCard,
        voiceNoteUrl,
      };
    }

    // Catalog card path — resolve from in-memory card data
    await client.end();
    const cardInfo = findCardById(row.card_id);

    return {
      id: row.id,
      cardId: row.card_id,
      senderName: row.sender_name,
      recipientName: row.recipient_name,
      personalNote: row.personal_note || '',
      card: cardInfo?.card || null,
      categoryName: cardInfo?.categoryName || '',
      youtubeClip,
      giftCard,
      voiceNoteUrl,
    };
  } catch (error) {
    console.error('Error fetching shared card:', error);
    return null;
  }
}

/**
 * generateMetadata — Produces dynamic OG and Twitter Card metadata.
 *
 * This runs at request time on the server so that social-media link previews
 * display the card's cover image, the sender's name, and the card category.
 * Falls back to generic metadata when the card ID is not found.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getSharedCard(id);

  // Fallback metadata when card is missing or expired
  if (!data) {
    return {
      title: 'GreetMe Card',
      description: 'Open this link to view your greeting card!',
    };
  }

  const title = `You've received a GreetMe Card from ${data.senderName}`;
  const description = `${data.senderName} sent ${data.recipientName} a special ${data.categoryName} greeting card. Open to view!`;

  // Build absolute URL for OG image from the first configured domain
  const domain = process.env.REPLIT_DOMAINS?.split(',')[0] || '';
  const baseUrl = domain ? `https://${domain}` : '';

  const hasImage = data.card?.cover && !data.card.cover.includes('placeholder');
  const absoluteImageUrl = hasImage ? `${baseUrl}${data.card!.cover}` : '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'GreetMe',
      ...(hasImage && {
        images: [{ url: absoluteImageUrl, width: 600, height: 800, alt: data.card!.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(hasImage && {
        images: [absoluteImageUrl],
      }),
    },
  };
}

/**
 * SharePage — Next.js server component (default export) for /c/[id].
 *
 * Fetches the shared card data and either renders the interactive client
 * component or shows a "Card Not Found" error page.
 */
export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const data = await getSharedCard(id);

  // Card not found — show a friendly error with a CTA to create a new card
  if (!data || !data.card) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c49a6c 0%, #b8860b 50%, #c49a6c 100%)' }}>
        <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Card Not Found</h1>
          <p className="text-gray-600 mb-4">This greeting card link may have expired or is invalid.</p>
          <a href="/" className="inline-block px-6 py-3 bg-[#4EAAA2] text-white rounded font-bold hover:opacity-90 transition-opacity">
            Create Your Own Card
          </a>
        </div>
      </div>
    );
  }

  // Pass all resolved data to the interactive client component
  return (
    <ShareCardClient
      cardData={data.card}
      senderName={data.senderName}
      recipientName={data.recipientName}
      personalNote={data.personalNote}
      categoryName={data.categoryName}
      youtubeClip={data.youtubeClip}
      giftCard={data.giftCard}
      voiceNoteUrl={data.voiceNoteUrl}
    />
  );
}
