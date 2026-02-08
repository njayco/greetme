import { getUncachableStripeClient } from '../lib/stripeClient';

const paidCards = [
  {
    name: "Valentine's - Cupid's Arrow",
    description: "A sweet cupid heart Valentine's Day card",
    metadata: { cardId: "28", category: "valentines-day" },
  },
  {
    name: "Valentine's - Pizza My Heart",
    description: "Funny pizza pun Valentine's Day card",
    metadata: { cardId: "29", category: "valentines-day" },
  },
  {
    name: "Valentine's - Roses & Gold",
    description: "Elegant roses Valentine's Day card",
    metadata: { cardId: "31", category: "valentines-day" },
  },
  {
    name: "Valentine's - Cat Love",
    description: "Cute cat balloon Valentine's Day card",
    metadata: { cardId: "32", category: "valentines-day" },
  },
  {
    name: "Valentine's - Coffee Love",
    description: "Coffee love Valentine's Day card",
    metadata: { cardId: "33", category: "valentines-day" },
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
        unit_amount: 99,
        currency: 'usd',
      });

      console.log(`Created: ${card.name} -> Product: ${product.id}, Price: ${price.id}`);
    } catch (error: any) {
      console.error(`Error creating ${card.name}:`, error.message);
    }
  }

  console.log("Done seeding products!");
}

seedProducts().catch(console.error);
