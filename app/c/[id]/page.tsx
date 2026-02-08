import { Metadata } from 'next';
import pg from 'pg';
import { findCardById } from '@/lib/cardData';
import ShareCardClient from './ShareCardClient';

type Props = {
  params: Promise<{ id: string }>;
};

async function getSharedCard(id: string) {
  try {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const result = await client.query(
      'SELECT * FROM shared_cards WHERE id = $1',
      [id]
    );
    await client.end();

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    const cardInfo = findCardById(row.card_id);

    return {
      id: row.id,
      cardId: row.card_id,
      senderName: row.sender_name,
      recipientName: row.recipient_name,
      personalNote: row.personal_note || '',
      card: cardInfo?.card || null,
      categoryName: cardInfo?.categoryName || '',
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
    />
  );
}
