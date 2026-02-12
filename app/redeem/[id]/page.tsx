import { Metadata } from 'next';
import pg from 'pg';
import RedeemClient from './RedeemClient';

type Props = {
  params: Promise<{ id: string }>;
};

async function getGiftCardInfo(id: string) {
  try {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const result = await client.query(
      'SELECT id, sender_name, recipient_name, gift_card_brand, gift_card_amount_cents, gift_card_status, gift_card_link FROM shared_cards WHERE id = $1',
      [id]
    );
    await client.end();

    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    if (!row.gift_card_brand || !row.gift_card_amount_cents) return null;

    return {
      shareId: row.id,
      senderName: row.sender_name,
      recipientName: row.recipient_name,
      brand: row.gift_card_brand,
      amountCents: row.gift_card_amount_cents,
      status: row.gift_card_status || 'pending',
      link: row.gift_card_link || null,
    };
  } catch (error) {
    console.error('Error fetching gift card info:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const info = await getGiftCardInfo(id);

  if (!info) {
    return { title: 'GreetMe - Gift Card' };
  }

  return {
    title: `Redeem Your $${(info.amountCents / 100).toFixed(0)} Gift Card - GreetMe`,
    description: `${info.senderName} sent you a gift card! Click to redeem.`,
  };
}

export default async function RedeemPage({ params }: Props) {
  const { id } = await params;
  const info = await getGiftCardInfo(id);

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c49a6c 0%, #b8860b 50%, #c49a6c 100%)' }}>
        <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Gift Card Not Found</h1>
          <p className="text-gray-600 mb-4">This gift card link may be invalid or no gift card was attached to this greeting card.</p>
          <a href="/" className="inline-block px-6 py-3 bg-[#4EAAA2] text-white rounded font-bold hover:opacity-90 transition-opacity">
            Visit GreetMe
          </a>
        </div>
      </div>
    );
  }

  return <RedeemClient giftCard={info} />;
}
