import { getUncachableStripeClient } from '../lib/stripeClient';

const paidCards = [
  {
    name: "Valentine's - Cupid's Arrow",
    description: "A sweet cupid heart Valentine's Day card",
    metadata: { cardId: "28", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Pizza My Heart",
    description: "Funny pizza pun Valentine's Day card",
    metadata: { cardId: "29", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Roses & Gold",
    description: "Elegant roses Valentine's Day card",
    metadata: { cardId: "31", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Cat Love",
    description: "Cute cat balloon Valentine's Day card",
    metadata: { cardId: "32", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Coffee Love",
    description: "Coffee love Valentine's Day card",
    metadata: { cardId: "33", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Lovebirds",
    description: "Cute lovebirds on a branch Valentine's Day card",
    metadata: { cardId: "35", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Foxy Valentine",
    description: "Fox with roses Valentine's Day card",
    metadata: { cardId: "36", category: "valentines-day" },
    priceInCents: 149,
  },
  {
    name: "Valentine's - Penguin Love",
    description: "Penguins sharing a scarf Valentine's Day card",
    metadata: { cardId: "37", category: "valentines-day" },
    priceInCents: 199,
  },
  {
    name: "Valentine's - Love Potion",
    description: "Magical love potion Valentine's Day card",
    metadata: { cardId: "38", category: "valentines-day" },
    priceInCents: 249,
  },
  {
    name: "Valentine's - Sloth Love",
    description: "Cute sloth hugging heart Valentine's Day card",
    metadata: { cardId: "39", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Owl Always Love You",
    description: "Owls on moonlit branch Valentine's Day card",
    metadata: { cardId: "40", category: "valentines-day" },
    priceInCents: 199,
  },
  {
    name: "Valentine's - Love Letters",
    description: "Mailbox with love letters Valentine's Day card",
    metadata: { cardId: "41", category: "valentines-day" },
    priceInCents: 149,
  },
  {
    name: "Valentine's - Butterfly Kisses",
    description: "Butterflies forming heart Valentine's Day card",
    metadata: { cardId: "42", category: "valentines-day" },
    priceInCents: 299,
  },
  {
    name: "Valentine's - Hedge-Hug",
    description: "Hedgehog with heart balloon Valentine's Day card",
    metadata: { cardId: "43", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Seas The Day",
    description: "Seahorses forming heart Valentine's Day card",
    metadata: { cardId: "44", category: "valentines-day" },
    priceInCents: 249,
  },
  {
    name: "Valentine's - Puppy Love",
    description: "Puppy with heart cookie Valentine's Day card",
    metadata: { cardId: "45", category: "valentines-day" },
    priceInCents: 149,
  },
  {
    name: "Valentine's - Sweetheart",
    description: "Jar of candy hearts Valentine's Day card",
    metadata: { cardId: "46", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Magical Love",
    description: "Unicorn with hearts Valentine's Day card",
    metadata: { cardId: "47", category: "valentines-day" },
    priceInCents: 299,
  },
  {
    name: "Valentine's - Some-Bunny Loves You",
    description: "Cute bunnies Valentine's Day card",
    metadata: { cardId: "48", category: "valentines-day" },
    priceInCents: 149,
  },
  {
    name: "Valentine's - You're My Jam",
    description: "Vintage record player Valentine's Day card",
    metadata: { cardId: "49", category: "valentines-day" },
    priceInCents: 199,
  },
  {
    name: "Valentine's - Love Takes Flight",
    description: "Heart hot air balloon Valentine's Day card",
    metadata: { cardId: "50", category: "valentines-day" },
    priceInCents: 299,
  },
  {
    name: "Valentine's - Otterly In Love",
    description: "Otters holding hands Valentine's Day card",
    metadata: { cardId: "51", category: "valentines-day" },
    priceInCents: 199,
  },
  {
    name: "Valentine's - Key To My Heart",
    description: "Golden locket Valentine's Day card",
    metadata: { cardId: "52", category: "valentines-day" },
    priceInCents: 249,
  },
  {
    name: "Valentine's - Toadally Yours",
    description: "Frog prince Valentine's Day card",
    metadata: { cardId: "53", category: "valentines-day" },
    priceInCents: 99,
  },
  {
    name: "Valentine's - Warmth of Love",
    description: "Cozy fireplace Valentine's Day card",
    metadata: { cardId: "54", category: "valentines-day" },
    priceInCents: 249,
  },
  {
    name: "Valentine's - Rose Garden",
    description: "Rose garden gate Valentine's Day card",
    metadata: { cardId: "55", category: "valentines-day" },
    priceInCents: 299,
  },
  {
    name: "Valentine's - Tons of Love",
    description: "Elephant spraying hearts Valentine's Day card",
    metadata: { cardId: "56", category: "valentines-day" },
    priceInCents: 149,
  },
  {
    name: "Valentine's - Lucky In Love",
    description: "Ladybugs on heart leaf Valentine's Day card",
    metadata: { cardId: "57", category: "valentines-day" },
    priceInCents: 199,
  },
  {
    name: "Valentine's - Stained Glass Heart",
    description: "Stained glass heart design Valentine's Day card",
    metadata: { cardId: "58", category: "valentines-day" },
    priceInCents: 299,
  },
  {
    name: "Valentine's - Koala-ty Love",
    description: "Cute koala Valentine's Day card",
    metadata: { cardId: "59", category: "valentines-day" },
    priceInCents: 149,
  },
  {
    name: "Valentine's - The Raven's Truth",
    description: "Raven painting Valentine's Day card",
    metadata: { cardId: "60", category: "valentines-day" },
    priceInCents: 214,
  },
];

async function seedProducts() {
  console.log("Creating Valentine's Day products in Stripe...");
  const stripe = await getUncachableStripeClient();

  for (const card of paidCards) {
    try {
      const products = await stripe.products.list({ limit: 100 });
      const existing = products.data.find(p => p.metadata?.cardId === card.metadata.cardId);
      if (existing) {
        console.log(`Product for cardId ${card.metadata.cardId} already exists, skipping...`);
        continue;
      }

      const product = await stripe.products.create({
        name: card.name,
        description: card.description,
        metadata: card.metadata,
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: card.priceInCents,
        currency: 'usd',
      });

      console.log(`Created: ${card.name} ($${(card.priceInCents / 100).toFixed(2)}) -> Product: ${product.id}, Price: ${price.id}`);
    } catch (error: any) {
      console.error(`Error creating ${card.name}:`, error.message);
    }
  }

  console.log("Done seeding products!");
}

seedProducts().catch(console.error);
