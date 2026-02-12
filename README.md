# GreetMe - Digital Greeting Cards

**Not Just a Card - An Experience!**

GreetMe is a digital greeting card application where users can browse, customize, and share beautiful greeting cards for every occasion. With 152+ cards across 39+ categories organized into 10 groups, AI-generated card covers, a vintage bookshelf design, and built-in payment processing, GreetMe makes sending heartfelt messages easy and memorable.

Created by **Najee Jeremiah**

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Greet Me Clips](#greet-me-clips)
- [Voice Notes](#voice-notes)
- [Greet Me for Artists](#greet-me-for-artists)
- [Gift Cards](#gift-cards)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Card Categories](#card-categories)
- [AI Card Generation](#ai-card-generation)
- [Payment System](#payment-system)
- [Sharing System](#sharing-system)
- [Email Confirmations](#email-confirmations)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Features

- **152+ greeting cards** across 39+ categories organized into 10 thematic groups
- **AI-generated card covers** using OpenAI gpt-image-1 with unique art styles per group
- **Vintage bookshelf aesthetic** with warm tan/gold colors and wooden textures
- **Card customization** with sender name, recipient name, and personal notes
- **Greet Me for Artists** — create custom cards by uploading artwork, writing messages, and sharing or selling
- **Greet Me Clips** — attach a 30-second YouTube audio clip to any card for $0.99, powered by YouTube
- **Voice Notes** — record or upload a personal voice message (up to 30 seconds) that plays alongside the YouTube clip with synced playback controls
- **Gift Cards** — attach a digital gift card (powered by Giftbit/Tremendous) to any greeting card with just-in-time charging — the sender is only charged when the recipient redeems
- **Stripe payment integration** for premium Valentine's Day cards ($0.99 - $2.99), personal artist cards ($4.99), and audio clip add-ons ($0.99)
- **Shareable short links** that work on social media with OG metadata previews
- **Email confirmations** sent automatically after purchase via Resend
- **Responsive design** that works on desktop and mobile
- **Loading screen** with animated progress bar and GreetMe branding

---

## How It Works

### User Flow

1. **Loading Screen** - The app opens with a branded loading screen featuring the GreetMe logo, an animated progress bar, and an "Enter Here" button that appears once loading completes.

2. **Category Browser** - Users see all 39+ card categories organized into 10 groups (Popular Holidays, National Holidays, Religious & Cultural, etc.). Each group has a header and categories are displayed as colored buttons.

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

## Greet Me Clips

**Greet Me Clips** lets senders attach a 30-second YouTube audio clip to any greeting card for just $0.99 — turning a simple card into a multimedia experience powered by YouTube.

### How Clips Work

1. **Enable the Clip** - On the Customize screen (or the Artists personalization step), toggle "Add YouTube Clip (30s) +$0.99"
2. **Paste a YouTube Link** - Enter any YouTube video URL and click **Load** to resolve the video title via YouTube's oEmbed API
3. **Pick a Start Time** - Choose the 30-second segment you want using a simple `M:SS` time input; the end time is calculated automatically
4. **Send & Pay** - The $0.99 clip add-on is added as a Stripe line item alongside any card price. Free cards with a clip go through Stripe checkout for just the add-on fee
5. **Recipient Plays the Clip** - When the recipient opens the shared card, a red "Now Playing Clip" bar appears on the Centerfold tab with play/pause controls, a progress timer, and the video title (which links to YouTube)

### Clip Playback

The clip plays via the **YouTube IFrame Player API** — no downloads, no storage, just seamless streaming. The player is wrapped in a custom `YouTubeClipPlayer` component with:

- A red rounded bar UI with "Now Playing Clip" label
- Play/pause toggle button
- Real-time progress display (e.g., "12s / 30s")
- Clickable title that opens the full video on YouTube
- Automatic stop at the 30-second mark

### Payment Gating

Clip playback is securely gated behind payment verification:

- YouTube clip data is stored in the `shared_cards` table with `youtube_clip_enabled` set to `false` by default
- The Stripe webhook (`checkout.session.completed`) verifies that the actual Stripe line items include the YouTube add-on price before setting `youtube_clip_enabled` to `true`
- The share page only renders the clip player when `youtube_clip_enabled` is `true`

### Clips in Greet Me for Artists

Artists can also add YouTube clips to their custom cards during the personalization step:

- **Catalog cards** (free) with a clip go through Stripe checkout for just the $0.99 add-on
- **Personal cards** ($4.99) with a clip add the add-on as a second line item, totaling $5.98
- The submit button dynamically updates to reflect the total cost

### Technical Details

| Component | Details |
|---|---|
| **Resolve API** | `POST /api/youtube/resolve` — Uses YouTube oEmbed for title lookup (no API key needed) |
| **Player Component** | `components/YouTubeClipPlayer.tsx` — YouTube IFrame Player API wrapper |
| **Stripe Product** | Dynamically found or created via `lib/youtubeAddon.ts` — auto-provisions in both Stripe test and live modes |
| **Database Columns** | `youtube_video_id`, `youtube_url`, `youtube_title`, `youtube_start_seconds`, `youtube_end_seconds`, `youtube_clip_enabled` on `shared_cards` |
| **Webhook** | `lib/webhookHandlers.ts` — Server-side Stripe line item verification before enabling clip playback |

---

## Voice Notes

**Voice Notes** let card creators record or upload a personal voice message (up to 30 seconds) when adding a YouTube clip to any card. The voice note becomes the primary audio experience, with the YouTube clip playing as background music.

### How Voice Notes Work

1. **Enable a YouTube Clip first** - Voice Notes appear within the YouTube Clip section on the Customize screen (or Artists personalization step)
2. **Record or Upload** - Use the built-in microphone recorder (auto-stops at 30 seconds) or upload a WebM, MP4, MP3, or WAV audio file (max 10MB)
3. **Read the card aloud** - The UI prompts the creator to read the card's centerfold message aloud and shows the text as reference
4. **Preview before sending** - A native audio player lets the creator listen back, re-record, or upload a different file
5. **Recipient gets both** - On the share page Centerfold tab, the voice note plays at full volume (teal "Voice Message" bar) and the YouTube clip plays underneath at 25% volume (red "Background Music" bar)

### Synced Playback

When both a voice note and a YouTube clip are present on a card, playback is synchronized:

- **Play either, play both** - Pressing play on the voice note also starts the YouTube clip (and vice versa)
- **Pause either, pause both** - Pressing pause on one pauses the other
- **Smart ending** - If voice note is shorter, the YouTube clip continues at full volume after the voice note ends. If YouTube clip is shorter, the clip loops until the voice note finishes. Playback always lasts as long as the longer of the two.
- **No loop or flicker** - A ref-based guard system (`externalPlayingRef` + `isExternalUpdateRef`) prevents ping-pong state updates between the two players

### Technical Details

| Component | Details |
|---|---|
| **Recorder Component** | `components/VoiceNoteRecorder.tsx` — MediaRecorder API (audio/webm, fallback audio/mp4), 30s max, upload to Object Storage |
| **Upload API** | `POST /api/voice-note/upload` — Accepts FormData with `audio` field, stores to Object Storage under `voice-notes/` |
| **Voice Player** | `VoiceNotePlayer` in `app/c/[id]/ShareCardClient.tsx` — HTML Audio element with play/pause sync |
| **Sync Mechanism** | `ShareCardClient` manages `syncedPlaying` state, passes `externalPlaying` and `onPlayStateChange` to both players |
| **Storage** | Replit Object Storage under `voice-notes/` directory, served via `/api/uploads/serve` |
| **Database Column** | `voice_note_url` (TEXT, nullable) on `shared_cards` table |

---

## Greet Me for Artists

Greet Me for Artists (`/artists`) lets users create custom greeting cards with their own artwork and messages.

### Artist Card Creation Flow (6 Steps)

1. **Welcome** - Introduction screen with overview of the creation process
2. **Upload Cover Image** - Upload a JPG, PNG, or WebP image (max 5MB) for the card cover
3. **Write Messages** - Enter the centerfold message (max 250 chars), back message (max 100 chars), optional caption, and artist name
4. **Choose Categories** - Select one or more categories for the card, and choose between public catalog or personal use
5. **Preview** - Review the card with Cover, Centerfold, and Back tabs before proceeding
6. **Personalize** - Add "To:", "From:", and an optional personal note before submitting

### Card Types

- **Public Catalog Cards** (Free) - Submitted to the GreetMe catalog for everyone to send. Cards appear in their selected categories once approved. A share link is generated immediately on submission.
- **Personal Cards** ($4.99) - Private cards for personal use. Payment is processed via Stripe Checkout, and a share link is generated after successful payment.

### Image Storage

Artist-uploaded images are stored in Replit Object Storage. Images are served via the `/api/uploads/serve` endpoint, ensuring persistence across deployments.

### Data Backup & Recovery

Custom cards are automatically backed up to Replit Object Storage to protect against database rollbacks:

- **Automatic backup**: Every custom card (personal or public) is saved as a JSON file to Object Storage (`card-backups/{cardId}.json`) immediately after creation
- **Auto-restore**: When the `/api/artists/cards` endpoint is called, it reconciles all backed-up card IDs against the database and restores any missing cards — even if only some cards were lost (partial rollback recovery)
- **Full protection**: Both personal and public cards are backed up and restored, though only public/approved cards are returned in API responses
- **Backup utility**: `lib/cardBackup.ts` provides `backupCardToStorage()` and `getAllBackedUpCards()` functions

---

## Gift Cards

GreetMe lets senders attach a digital gift card to any greeting card. Powered by the **Giftbit API** (Tremendous), the system uses a **just-in-time charging model** — the sender's card is saved at checkout but only charged when the recipient redeems the gift card.

### How Gift Cards Work

1. **Enable Gift Card** - On the Customize screen, toggle "Add Gift Card" and enter the recipient's email, select a brand, and choose an amount ($5, $10, $15, $25, $50)
2. **Brand Selection** - Gift card brands are fetched from the Giftbit API with min/max pricing, and filtered by the selected amount to prevent validation errors
3. **Checkout** - The sender completes Stripe checkout. The gift card amount is NOT charged at this point — only the greeting card price (if any) is charged. A $0 line item for the gift card appears on the Stripe checkout page with a message: "Your $25 gift card will be charged to this card when the recipient redeems it."
4. **Payment Method Saved** - The Stripe webhook saves the sender's customer ID and payment method for later use
5. **Recipient Redeems** - The recipient sees a "Redeem $25 Gift Card Here" button on the share page (`/c/[id]`), linking to the redemption page (`/redeem/[id]`)
6. **Redemption Page** - Shows the gift card amount, sender name, and the email where the gift card will be sent. When the recipient clicks "Redeem":
   - The sender's saved payment method is charged via Stripe (off-session)
   - A Giftbit campaign is created to generate the gift card
   - A confirmation email is sent to the recipient via Resend with the gift card link
   - The page updates to show "Open Gift Card" with a direct link
7. **After Redemption** - The share page button changes from "Redeem" to "Open Gift Card"

### Just-in-Time Charging Model

| Checkout Scenario | What Happens |
|---|---|
| **Gift card only** (free greeting card) | Stripe Setup mode — saves payment method, charges $0 |
| **Gift card + paid greeting card** | Stripe Payment mode with `setup_future_usage` — charges card price, saves payment method for later gift card charge |
| **No gift card** | Standard Stripe Payment mode |

The sender sees "Total Due Now" on the app (excluding gift card) with an amber notice: "Your $25 Gift Card — Your card will be charged $25.00 only when the recipient redeems the gift card."

### Gift Card Statuses

| Status | Meaning |
|---|---|
| `pending` | Gift card created, awaiting redemption |
| `redeemed` | Recipient redeemed, charge succeeded, gift card delivered |
| `charge_failed` | Sender's payment method failed at redemption |
| `charge_succeeded_fulfill_failed` | Charge succeeded but Giftbit campaign creation failed (requires manual resolution) |

### Technical Details

| Component | Details |
|---|---|
| **Giftbit Client** | `lib/giftbitClient.ts` — API client for brands, campaigns, and links |
| **Brands API** | `GET /api/giftbit/brands` — Cached brand listing with min/max pricing |
| **Redemption API** | `POST /api/redeem/[id]` — Charges sender, creates Giftbit campaign, sends email |
| **Redemption Page** | `app/redeem/[id]/` — Server + client components for redemption UI |
| **Webhook Handler** | `lib/webhookHandlers.ts` — Saves customer/payment method from SetupIntent or PaymentIntent |
| **Database** | `shared_cards` table stores gift card fields; `giftbit_orders` tracks fulfillment |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS styling |
| **shadcn/ui** | Pre-built accessible UI components |
| **PostgreSQL** | Database for shared card links and custom cards (Neon-backed) |
| **Stripe** | Payment processing for premium and artist cards |
| **stripe-replit-sync** | Stripe data synchronization and webhook management |
| **Resend** | Transactional email delivery |
| **OpenAI** | AI card generation (gpt-image-1 for covers, gpt-4o-mini for text) |
| **Replit Object Storage** | Persistent image storage for artist uploads |
| **React 19** | Latest React with concurrent features |

---

## Project Structure

```
greetme/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with metadata
│   ├── page.tsx                      # Main application (all screens & logic)
│   ├── globals.css                   # Global styles
│   ├── artists/
│   │   └── page.tsx                  # Greet Me for Artists card creation studio
│   ├── api/
│   │   ├── checkout/route.ts         # Stripe checkout session creation
│   │   ├── products/route.ts         # Fetch Stripe products & prices
│   │   ├── share/route.ts            # Create shareable short links
│   │   ├── send-confirmation/route.ts # Send purchase confirmation emails
│   │   ├── stripe/webhook/route.ts   # Stripe webhook handler
│   │   ├── youtube/
│   │   │   └── resolve/route.ts     # YouTube URL resolver (oEmbed title lookup)
│   │   ├── giftbit/
│   │   │   ├── brands/route.ts      # Gift card brand listing (cached)
│   │   │   └── fulfill/route.ts     # Manual gift card fulfillment
│   │   ├── redeem/
│   │   │   └── [id]/route.ts        # Gift card redemption (charge + fulfill)
│   │   ├── voice-note/
│   │   │   └── upload/route.ts      # Voice note upload (Object Storage)
│   │   ├── artists/
│   │   │   ├── upload/route.ts       # Artist image upload (Object Storage)
│   │   │   ├── create/route.ts       # Artist card creation with Stripe
│   │   │   ├── cards/route.ts        # Fetch approved public custom cards
│   │   │   └── confirm-payment/route.ts # Confirm Stripe payment for personal cards
│   │   └── uploads/
│   │       └── serve/route.ts        # Serve images from Object Storage
│   ├── redeem/[id]/
│   │   ├── page.tsx                 # Gift card redemption page (server)
│   │   └── RedeemClient.tsx         # Gift card redemption UI (client)
│   └── c/[id]/                       # Dynamic share page
│       ├── page.tsx                  # Server component with OG metadata
│       └── ShareCardClient.tsx       # Client component for card display
├── components/                       # shadcn/ui components
│   ├── YouTubeClipPlayer.tsx        # YouTube clip player with red bar UI & sync
│   ├── VoiceNoteRecorder.tsx        # Voice note recorder/uploader component
│   └── ui/                           # Button, Card, Input, etc.
├── lib/
│   ├── cardData.ts                   # All card & category definitions
│   ├── stripeClient.ts              # Stripe API client setup
│   ├── initStripe.ts                # Stripe schema migration & webhooks
│   ├── resendClient.ts              # Resend email client setup
│   ├── cardBackup.ts               # Object Storage backup/restore for custom cards
│   ├── giftbitClient.ts             # Giftbit API client (brands, campaigns, links)
│   ├── webhookHandlers.ts           # Stripe webhook processing
│   ├── youtubeAddon.ts             # Dynamic YouTube addon Stripe product/price provisioning
│   └── utils.ts                     # Utility functions (cn)
├── public/images/                    # Card images and assets (incl. gen-* AI images)
├── scripts/
│   ├── generate-cards.ts            # AI card generation script
│   ├── merge-generated-cards.ts     # Merge generated cards into cardData.ts
│   ├── seed-valentines-products.ts  # Stripe product seeding script
│   └── generated/                   # JSON output from card generation
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

### 10 Category Groups (152+ cards, 39+ categories)

| Group | Categories | Card Count |
|---|---|---|
| **Popular Holidays** | Valentine's Day, Mother's Day, Father's Day, Halloween, St. Patrick's Day, Black History Month, Women's History Month, Pride Month | 50+ |
| **National Holidays** | Fourth of July, New Year's Day, MLK Day, Memorial Day, Labor Day, Veterans Day, Thanksgiving, Juneteenth, Presidents' Day | 13 |
| **Religious & Cultural** | Christmas, Hanukkah, Kwanzaa, Easter, Diwali, Rosh Hashanah, Yom Kippur, Muslim Holidays | 14 |
| **Celebrations & Milestones** | Birthday, Graduation, Congratulations | 20+ |
| **Life Events** | Wedding, Anniversary, New Baby, Retirement, New Job, New Home, Career Change, First Job | 12 |
| **Support & Sympathy** | Get Well Soon, Sympathy, Thinking of You, Encouragement, Mental Health, Surgery Recovery | 15+ |
| **Appreciation** | Thank You | 1 |
| **Feelings** | Love & Romance, Miss You, Friendship, I'm Sorry | 4 |
| **Pride & LGBTQ+** | Coming Out, LGBTQ+ Love | 6 |
| **Seasonal** | Fall Vibes, Winter Cheer | 6 |

### Card ID Ranges

- **1-12**: Father's Day cards
- **13-16**: Birthday cards
- **17-19**: Get Well Soon cards
- **20-22**: Graduation cards
- **23-24**: Juneteenth cards
- **25-27**: Fourth of July cards
- **28-60**: Valentine's Day cards (paid via Stripe)
- **61-92**: Expanded category cards (1 per new category)
- **93+**: AI-generated cards (3 per subcategory)
- **900000+**: Custom artist-created cards (dynamic from database)

---

## AI Card Generation

GreetMe uses OpenAI to generate unique card covers and messages for each subcategory.

### Generation Pipeline

1. **Art Styles**: Each of the 10 category groups has a unique set of art styles (e.g., neo-expressionist, superflat pop art, infinity dot style)
2. **Tones**: Each subcategory gets 3 cards with different tones: funny, heartfelt, and uplifting
3. **Covers**: Generated with `gpt-image-1` at 1024x1024 resolution
4. **Text**: Titles and centerfold messages generated with `gpt-4o-mini`

### Commands

```bash
# Generate cards for a specific group
npx tsx scripts/generate-cards.ts --group=GROUP_ID --limit=N

# Dry run to see what would be generated
npx tsx scripts/generate-cards.ts --dry-run --limit=999

# Merge generated cards into the app
npx tsx scripts/merge-generated-cards.ts
```

### Generation Stats

- ~40 seconds per image
- ~2 minutes per subcategory (3 cards)
- Automatically skips existing images (resume-safe)

---

## Payment System

### How Payments Work

The app uses **Stripe Checkout** for processing card purchases.

**Standard Card Payment Flow:**

1. User fills in card details (From, To, Personal Note) and clicks **Send**
2. The app creates a share link in the database via `/api/share`
3. The app creates a Stripe Checkout session via `/api/checkout`, passing the `shareId` in session metadata
4. User is redirected to Stripe's hosted checkout page
5. After successful payment, Stripe redirects to `/?payment=success&shareId=XXX&session_id=YYY`
6. The app displays the shareable link and sends a confirmation email

**Artist Personal Card Payment Flow:**

1. Artist creates card and fills personalization (To, From, Personal Note)
2. Stripe Checkout session is created with personalization in metadata
3. After payment, `/api/artists/confirm-payment` verifies payment, creates share link with personalization data
4. Share link is displayed on the success screen

**Price Tiers (Valentine's Day):**

| Price | Card IDs |
|---|---|
| Free | 30, 34 |
| $0.99 | 28, 29, 31, 32, 33, 35, 39, 43, 46, 53 |
| $1.49 | 36, 41, 45, 48, 56, 59 |
| $1.99 | 37, 40, 49, 51, 57 |
| $2.14 | 60 |
| $2.49 | 38, 44, 52, 54 |
| $2.99 | 42, 47, 50, 55, 58 |

**Artist Personal Cards:** $4.99 flat fee

**Gift Card Payment Flow (Just-in-Time):**

1. Sender enables gift card, selects brand/amount, enters recipient email
2. At checkout, only the greeting card price is charged; payment method is saved
3. Stripe webhook stores customer ID and payment method in `shared_cards`
4. Recipient clicks "Redeem" on the share page, linking to `/redeem/[id]`
5. Redemption API charges saved payment method, creates Giftbit campaign
6. Confirmation email sent to recipient with gift card link

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

### Dual Card Type Support

The sharing system supports both regular cards and custom artist cards:
- **Regular cards**: Stored with `card_id` (INTEGER) referencing cards in `cardData.ts`
- **Custom artist cards**: Stored with `custom_card_id` (VARCHAR) referencing the `custom_cards` table

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

### Gift Card Redemption Email

When a gift card is redeemed, a styled HTML email is sent to the recipient via Resend containing:
- The gift card amount and sender name
- An "Open Your Gift Card" button with the Giftbit redemption link
- A link to view the greeting card
- GreetMe branding

The email is sent as a best-effort (non-blocking) — if it fails, the redemption still succeeds.

---

## Database

### PostgreSQL (Neon-backed)

The app uses a PostgreSQL database provided by Replit (Neon-backed) for storing shared card data, custom artist cards, and Stripe sync information.

### Tables

**`shared_cards`** - Stores shared greeting card links

| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR(8) | Primary key - 7-character short ID |
| `card_id` | INTEGER (nullable) | References the card in `cardData.ts` |
| `custom_card_id` | VARCHAR(8) (nullable) | References a custom artist card |
| `sender_name` | VARCHAR(100) | Name of the sender |
| `recipient_name` | VARCHAR(100) | Name of the recipient |
| `personal_note` | TEXT | Optional personal message (max 500 chars) |
| `youtube_video_id` | VARCHAR(20) (nullable) | YouTube video ID for audio clip |
| `youtube_url` | TEXT (nullable) | Full YouTube URL |
| `youtube_title` | TEXT (nullable) | YouTube video title |
| `youtube_start_seconds` | INTEGER (nullable) | Clip start time in seconds |
| `youtube_end_seconds` | INTEGER (nullable) | Clip end time in seconds |
| `youtube_clip_enabled` | BOOLEAN | Whether clip playback is enabled (set to true after payment verification) |
| `gift_card_brand` | VARCHAR (nullable) | Giftbit brand code |
| `gift_card_amount_cents` | INTEGER (nullable) | Gift card value in cents |
| `gift_card_recipient_email` | VARCHAR (nullable) | Email to send gift card to |
| `gift_card_status` | VARCHAR (nullable) | Status: pending, redeemed, charge_failed |
| `gift_card_link` | TEXT (nullable) | Giftbit redemption link |
| `stripe_customer_id` | VARCHAR (nullable) | Stripe customer ID for deferred charging |
| `stripe_payment_method_id` | VARCHAR (nullable) | Saved payment method for deferred charging |
| `created_at` | TIMESTAMP | When the link was created |

**`custom_cards`** - Artist-created cards

| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR(8) | Primary key - 7-character short ID |
| `cover_image_url` | TEXT | Path to cover image in Object Storage |
| `centerfold_message` | TEXT | Inside greeting message (max 250 chars) |
| `caption` | TEXT (nullable) | Preview caption |
| `back_message` | TEXT | Back of card message (max 100 chars) |
| `category_ids` | TEXT[] | Array of selected category IDs |
| `creator_name` | VARCHAR(100) | Artist/creator name |
| `is_public` | BOOLEAN | Whether submitted to public catalog |
| `is_approved` | BOOLEAN | Whether approved for public display |
| `is_paid` | BOOLEAN | Whether payment has been completed |
| `stripe_session_id` | TEXT (nullable) | Stripe checkout session ID |
| `created_at` | TIMESTAMP | When the card was created |

**`giftbit_orders`** - Tracks gift card fulfillment

| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR | Primary key - 7-character order ID |
| `stripe_session_id` | TEXT | Stripe session/payment intent ID |
| `share_id` | VARCHAR | References the shared card |
| `brand_code` | VARCHAR | Giftbit brand code |
| `brand_name` | VARCHAR | Human-readable brand name |
| `amount_cents` | INTEGER | Gift card value in cents |
| `currency` | VARCHAR | Currency code (USD) |
| `recipient_email` | VARCHAR | Recipient email address |
| `recipient_name` | VARCHAR | Recipient name |
| `sender_name` | VARCHAR | Sender name |
| `giftbit_campaign_id` | TEXT (nullable) | Giftbit campaign UUID |
| `giftbit_link_url` | TEXT (nullable) | Gift card redemption URL |
| `status` | VARCHAR | Order status: pending, sent, failed |
| `raw_response` | JSONB (nullable) | Raw Giftbit API response |
| `created_at` | TIMESTAMP | Order creation time |
| `updated_at` | TIMESTAMP (nullable) | Last update time |

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

### `POST /api/artists/upload`

Uploads a cover image to Replit Object Storage.

**Request**: `multipart/form-data` with `image` field

**Response:**
```json
{
  "url": "/objects/artist-cards/abc123.jpg"
}
```

### `POST /api/artists/create`

Creates a custom artist card with optional personalization.

**Request Body:**
```json
{
  "coverUrl": "/objects/artist-cards/abc123.jpg",
  "centerfold": "Happy Birthday!",
  "backMessage": "Made with love",
  "caption": "A special card",
  "artistName": "Jane",
  "categories": ["birthday"],
  "addToCatalog": true,
  "toName": "Bob",
  "fromName": "Jane",
  "personalNote": "Have a great day!"
}
```

### `POST /api/artists/confirm-payment`

Confirms Stripe payment for personal artist cards and generates a share link.

**Request Body:**
```json
{
  "sessionId": "cs_xxx",
  "cardId": "abc1234"
}
```

### `GET /api/artists/cards`

Returns all approved public custom cards for display in the main library.

### `GET /api/uploads/serve?path=/objects/...`

Serves uploaded images from Replit Object Storage.

### `POST /api/youtube/resolve`

Resolves a YouTube URL and returns the video ID, title, and canonical URL using YouTube's oEmbed API. No API key required.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "title": "Rick Astley - Never Gonna Give You Up",
  "canonicalUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

### `GET /api/giftbit/brands`

Returns available gift card brands with pricing information. Results are cached for 1 hour.

**Response:**
```json
{
  "brands": [
    {
      "brand_code": "visa-gift-card",
      "brand_name": "Visa Gift Card", 
      "min_price_in_cents": 2500,
      "max_price_in_cents": 50000
    }
  ]
}
```

### `POST /api/redeem/[id]`

Charges the sender's saved payment method and generates a gift card via Giftbit. Sends confirmation email to recipient.

**Response (success):**
```json
{
  "success": true,
  "redeemed": true,
  "giftCardLink": "https://giftbit.com/...",
  "recipientEmail": "happy@gmail.com",
  "amount": 2500,
  "brand": "visa-gift-card"
}
```

### `POST /api/giftbit/fulfill`

Manual gift card fulfillment endpoint for orders that failed automatic fulfillment.

### `POST /api/stripe/webhook`

Receives and processes Stripe webhook events (managed by `stripe-replit-sync`). Also handles YouTube clip activation by verifying Stripe line items contain the YouTube add-on price before enabling clip playback. Also saves gift card payment methods for just-in-time charging.

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
npx tsx scripts/seed-youtube-addon.ts
```

### Generate AI Cards

```bash
npx tsx scripts/generate-cards.ts --group=GROUP_ID --limit=N
npx tsx scripts/merge-generated-cards.ts
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REPLIT_DOMAINS` | Application domain(s) for absolute URLs |
| `REPLIT_CONNECTORS_HOSTNAME` | Replit connectors API hostname |
| `REPL_IDENTITY` | Replit identity token (auto-provided) |
| `GIFTBIT_API_KEY` | Giftbit/Tremendous API key for gift card generation |
Stripe and Resend credentials are managed automatically via Replit connectors - no manual API keys required. The YouTube clip add-on product and price are auto-provisioned in Stripe (both test and live modes) — no manual setup needed.

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
