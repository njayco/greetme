# GreetMe - Digital Greeting Cards

**Not Just a Card - An Experience!**

GreetMe is a digital greeting card application where users can browse, customize, and share beautiful greeting cards for every occasion. With 92 cards across 30+ categories, a vintage bookshelf design, and built-in payment processing, GreetMe makes sending heartfelt messages easy and memorable.

Created by **Najee Jeremiah**

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Card Categories](#card-categories)
- [Payment System](#payment-system)
- [Sharing System](#sharing-system)
- [Email Confirmations](#email-confirmations)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Features

- **92 greeting cards** across 30+ categories organized into 8 thematic groups
- **Vintage bookshelf aesthetic** with warm tan/gold colors and wooden textures
- **Card customization** with sender name, recipient name, and personal notes
- **Stripe payment integration** for premium Valentine's Day cards ($0.99 - $2.99)
- **Shareable short links** that work on social media with OG metadata previews
- **Email confirmations** sent automatically after purchase via Resend
- **Responsive design** that works on desktop and mobile
- **Loading screen** with animated progress bar and GreetMe branding

---

## How It Works

### User Flow

1. **Loading Screen** - The app opens with a branded loading screen featuring the GreetMe logo, an animated progress bar, and an "Enter Here" button that appears once loading completes.

2. **Category Browser** - Users see all 30+ card categories organized into 8 groups (Popular Holidays, National Holidays, Religious & Cultural, etc.). Each group has a header and categories are displayed as colored buttons.

3. **Card Library** - After selecting a category, users see the available cards displayed on a virtual wooden bookshelf. Cards are paginated with 6 cards per page and can be browsed with navigation arrows.

4. **Card Customization** - When a card is selected, users enter a customization screen with 4 tabs:
   - **Cover** - Shows the card's front image
   - **Customize** - Form fields for From, To, and Personal Note, plus the card's price and a Send button
   - **Centerfold** - Preview of the inside message with the personal note
   - **Back** - Preview of the card back with sender/recipient info

5. **Sending** - When the user clicks Send:
   - **Free cards**: A shareable link is generated immediately and displayed
   - **Paid cards**: The user is redirected to Stripe Checkout. After payment, they return to the app where the shareable link is shown and a confirmation email is sent

6. **Share Link Page** - Recipients open their card via a short URL (e.g., `/c/YC632Ax`). The page shows the card with tabs to view the cover, inside message, and back. Social media previews display OG metadata with the sender's name and card image.

### Screen Navigation

The app is a single-page application managed by a `currentScreen` state variable:

```
loading → categories → library → customize → shareLink
                                            ↘ (Stripe Checkout) → shareLink
```

Users can navigate back at any point using back buttons. The `viewCard` screen is used when viewing a shared card via URL parameters.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS styling |
| **shadcn/ui** | Pre-built accessible UI components |
| **PostgreSQL** | Database for shared card links (Neon-backed) |
| **Stripe** | Payment processing for premium cards |
| **stripe-replit-sync** | Stripe data synchronization and webhook management |
| **Resend** | Transactional email delivery |
| **React 19** | Latest React with concurrent features |

---

## Project Structure

```
greetme/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Main application (all screens & logic)
│   ├── globals.css                   # Global styles
│   ├── api/
│   │   ├── checkout/route.ts         # Stripe checkout session creation
│   │   ├── products/route.ts         # Fetch Stripe products & prices
│   │   ├── share/route.ts            # Create shareable short links
│   │   ├── send-confirmation/route.ts # Send purchase confirmation emails
│   │   └── stripe/webhook/route.ts   # Stripe webhook handler
│   └── c/[id]/                       # Dynamic share page
│       ├── page.tsx                  # Server component with OG metadata
│       └── ShareCardClient.tsx       # Client component for card display
├── components/                       # shadcn/ui components
│   └── ui/                           # Button, Card, Input, etc.
├── lib/
│   ├── cardData.ts                   # All card & category definitions
│   ├── stripeClient.ts              # Stripe API client setup
│   ├── initStripe.ts                # Stripe schema migration & webhooks
│   ├── resendClient.ts              # Resend email client setup
│   ├── webhookHandlers.ts           # Stripe webhook processing
│   └── utils.ts                     # Utility functions (cn)
├── public/images/                    # 97 card images and assets
├── scripts/
│   └── seed-valentines-products.ts   # Stripe product seeding script
├── styles/                           # Additional CSS
├── next.config.mjs                  # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

---

## Card Categories

### Data Model

Each card has the following structure:

```typescript
CardType = {
  id: number        // Unique card identifier
  title: string     // Card name (e.g., "Cupid's Arrow")
  cover: string     // Path to cover image
  centerfold: string // Inside message text
  back: string      // Back of card text
  price?: number    // Price in USD (undefined = free)
  tags?: string[]   // Searchable tags
}
```

Categories group cards together:

```typescript
CategoryType = {
  name: string      // Display name (e.g., "Valentine's Day")
  color: string     // Theme color for the category button
  group?: string    // Parent group (e.g., "Popular Holidays")
  cards: CardType[] // Array of cards in this category
}
```

### Groups and Categories (92 cards total)

| Group | Categories | Card Count |
|---|---|---|
| **Popular Holidays** | Valentine's Day, Mother's Day, Father's Day, Halloween, St. Patrick's Day, Black History Month, Women's History Month, Pride Month | 50 |
| **National Holidays** | Fourth of July, New Year's Day, MLK Day, Memorial Day, Labor Day, Veterans Day, Thanksgiving, Juneteenth | 10 |
| **Religious & Cultural** | Christmas, Hanukkah, Kwanzaa, Easter, Diwali | 5 |
| **Celebrations** | Birthday, Graduation, Congratulations | 8 |
| **Life Events** | Wedding, Anniversary, New Baby, Retirement, New Job, New Home | 6 |
| **Support & Sympathy** | Get Well Soon, Sympathy, Thinking of You, Encouragement | 6 |
| **Appreciation** | Thank You | 1 |
| **Feelings** | Love & Romance, Miss You, Friendship, I'm Sorry | 4 |

### Card ID Ranges

- **1-12**: Father's Day cards
- **13-16**: Birthday cards
- **17-19**: Get Well Soon cards
- **20-22**: Graduation cards
- **23-24**: Juneteenth cards
- **25-27**: Fourth of July cards
- **28-60**: Valentine's Day cards (paid via Stripe)
- **61-92**: Expanded category cards (1 per new category)

---

## Payment System

### How Payments Work

The app uses **Stripe Checkout** for processing card purchases. Only Valentine's Day cards (IDs 28-60) have prices; all other cards are free.

**Payment Flow:**

1. User fills in card details (From, To, Personal Note) and clicks **Send**
2. The app creates a share link in the database via `/api/share`
3. The app creates a Stripe Checkout session via `/api/checkout`, passing the `shareId` in session metadata
4. User is redirected to Stripe's hosted checkout page
5. After successful payment, Stripe redirects to `/?payment=success&shareId=XXX&session_id=YYY`
6. The app displays the shareable link and sends a confirmation email

**Price Tiers:**

| Price | Card IDs |
|---|---|
| Free | 30, 34 |
| $0.99 | 28, 29, 31, 32, 33, 35, 39, 43, 46, 53 |
| $1.49 | 36, 41, 45, 48, 56, 59 |
| $1.99 | 37, 40, 49, 51, 57 |
| $2.14 | 60 |
| $2.49 | 38, 44, 52, 54 |
| $2.99 | 42, 47, 50, 55, 58 |

### Stripe Integration

- **Client**: `lib/stripeClient.ts` manages Stripe API credentials via Replit connectors (auto-rotating tokens)
- **Initialization**: `lib/initStripe.ts` runs database migrations for the `stripe` schema, sets up managed webhooks, and performs initial data sync
- **Webhook**: `/api/stripe/webhook` receives Stripe events and processes them via `stripe-replit-sync`
- **Products**: Seeded via `scripts/seed-valentines-products.ts` which creates Stripe Products and Prices with `cardId` metadata
- **Product Lookup**: `/api/products` fetches all active Stripe products and maps them by `cardId` for the frontend

---

## Sharing System

### How Sharing Works

1. When a card is sent (free or after payment), the app calls `/api/share` with the card details
2. The API generates a unique 7-character alphanumeric ID (avoiding ambiguous characters like `0`, `O`, `I`, `l`)
3. The card data (card ID, sender name, recipient name, personal note) is stored in the `shared_cards` database table
4. A short URL is returned: `https://domain.com/c/{7-char-id}`

**Fallback**: If short link creation fails, the app falls back to a query parameter URL with the card details encoded directly.

### Share Page

The share page (`/c/[id]`) is a server-rendered page that:

- Fetches the shared card from the database
- Generates **Open Graph metadata** for rich social media previews:
  - Title: "You've received a GreetMe Card from [sender]"
  - Description: "[sender] sent [recipient] a special [category] greeting card. Open to view!"
  - Image: The card's cover image as an absolute URL
- Renders a client component (`ShareCardClient`) with tabs to view the cover, centerfold (inside message with personal note), and back of the card

### Web Share API

On the share link screen, users can:
- **Copy to clipboard** - Copies the short URL
- **Share** - Uses the native Web Share API on supported devices (mobile), falls back to clipboard copy

---

## Email Confirmations

After a successful Stripe payment, the app sends a confirmation email via **Resend**:

1. The frontend calls `/api/send-confirmation` with the Stripe `sessionId` and `shareId`
2. The API retrieves the checkout session from Stripe to get the customer's email
3. A styled HTML email is sent containing:
   - The card title and sender name
   - A clickable link to the shared card
   - GreetMe branding

The Resend client (`lib/resendClient.ts`) authenticates via Replit connectors, which handle API key rotation automatically.

---

## Database

### PostgreSQL (Neon-backed)

The app uses a PostgreSQL database provided by Replit (Neon-backed) for storing shared card data and Stripe sync information.

### Tables

**`shared_cards`** - Stores shared greeting card links

| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR(8) | Primary key - 7-character short ID |
| `card_id` | INTEGER | References the card in `cardData.ts` |
| `sender_name` | VARCHAR(100) | Name of the sender |
| `recipient_name` | VARCHAR(100) | Name of the recipient |
| `personal_note` | TEXT | Optional personal message (max 500 chars) |
| `created_at` | TIMESTAMP | When the link was created |

**`stripe.*`** - Managed by `stripe-replit-sync` for Stripe data synchronization (products, prices, customers, checkout sessions, etc.)

---

## API Endpoints

### `POST /api/share`

Creates a shareable short link for a greeting card.

**Request Body:**
```json
{
  "cardId": 28,
  "from": "Alice",
  "to": "Bob",
  "note": "Happy Valentine's Day!"
}
```

**Response:**
```json
{
  "id": "YC632Ax",
  "url": "https://domain.com/c/YC632Ax"
}
```

### `POST /api/checkout`

Creates a Stripe Checkout session for purchasing a paid card.

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "cardTitle": "Cupid's Arrow",
  "shareId": "YC632Ax",
  "senderName": "Alice",
  "successUrl": "https://domain.com/?payment=success&shareId=YC632Ax",
  "cancelUrl": "https://domain.com/"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### `GET /api/products`

Returns all active Stripe products mapped by card ID.

**Response:**
```json
{
  "28": {
    "productId": "prod_xxx",
    "priceId": "price_xxx",
    "unitAmount": 99,
    "currency": "usd"
  }
}
```

### `POST /api/send-confirmation`

Sends a purchase confirmation email with the card's shareable link.

**Request Body:**
```json
{
  "sessionId": "cs_xxx",
  "shareId": "YC632Ax"
}
```

### `POST /api/stripe/webhook`

Receives and processes Stripe webhook events (managed by `stripe-replit-sync`).

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Stripe account (with products seeded)
- Resend account (for emails)

### Installation

```bash
npm install
```

### Development

```bash
npx next dev -H 0.0.0.0 -p 5000
```

### Production Build

```bash
npx next build
npx next start -H 0.0.0.0 -p 5000
```

### Seed Stripe Products

```bash
npx tsx scripts/seed-valentines-products.ts
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REPLIT_DOMAINS` | Application domain(s) for absolute URLs |
| `REPLIT_CONNECTORS_HOSTNAME` | Replit connectors API hostname |
| `REPL_IDENTITY` | Replit identity token (auto-provided) |

Stripe and Resend credentials are managed automatically via Replit connectors - no manual API keys required.

---

## Design Theme

- **Color Palette**: Warm tan (#c49a6c), dark gold (#b8860b), teal buttons (#4EAAA2), coral/pink send buttons
- **Aesthetic**: Vintage bookshelf with wooden textures and warm lighting
- **Typography**: Elegant serif fonts for branding, clean sans-serif for UI
- **Loading Screen**: Retro progress bar with GreetMe logo and golden glow effect
- **Card Display**: Cards displayed on wooden shelves in the library view, organized by category groups with section headers

---

## License

This project is proprietary. All rights reserved.
