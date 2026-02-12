import { Metadata } from 'next';
import pg from 'pg';
import { findCardById } from '@/lib/cardData';
import ShareCardClient from './ShareCardClient';

type Props = {
  params: Promise<{ id: string }>;
};

function resolveImageUrl(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('/objects/')) {
    return `/api/uploads/serve?path=${encodeURIComponent(url)}`;
  }
  return url;
}

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

    const youtubeClip = row.youtube_clip_enabled && row.youtube_video_id ? {
      videoId: row.youtube_video_id,
      url: row.youtube_url,
      title: row.youtube_title || 'YouTube Video',
      startSeconds: row.youtube_start_seconds || 0,
      endSeconds: row.youtube_end_seconds || 30,
    } : null;

    const giftCard = row.gift_card_status === 'sent' && row.gift_card_link ? {
      amountCents: row.gift_card_amount_cents,
      link: row.gift_card_link,
      brand: row.gift_card_brand || 'Gift Card',
    } : null;

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
      };
    }

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
    };
  } catch (error) {
    console.error('Error fetching shared card:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getSharedCard(id);

  if (!data) {
    return {
      title: 'GreetMe Card',
      description: 'Open this link to view your greeting card!',
    };
  }

  const title = `You've received a GreetMe Card from ${data.senderName}`;
  const description = `${data.senderName} sent ${data.recipientName} a special ${data.categoryName} greeting card. Open to view!`;

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

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const data = await getSharedCard(id);

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

  return (
    <ShareCardClient
      cardData={data.card}
      senderName={data.senderName}
      recipientName={data.recipientName}
      personalNote={data.personalNote}
      categoryName={data.categoryName}
      youtubeClip={data.youtubeClip}
      giftCard={data.giftCard}
    />
  );
}
