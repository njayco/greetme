# GreetMe - Greeting Cards App

## Overview
GreetMe is a Next.js application for creating, customizing, and sharing digital greeting cards. It offers a wide range of categories, AI-generated card covers with unique art styles, and clever centerfold messages. The project aims to provide a platform for personal expression through digital greetings, allowing users to add personal touches like YouTube clips, voice notes, and even cash gifts. Its aesthetic is inspired by a vintage bookshelf, utilizing warm colors and wooden textures to create an inviting user experience. GreetMe also features an "Artists" studio where users can design and submit their own cards, either for personal use or to be added to the public catalog.

## User Preferences
I prefer clear and concise communication.
I like iterative development with regular updates.
Please ask for confirmation before implementing major changes or complex features.
I value detailed explanations for technical decisions.
Do not make changes to files in the `scripts/generated/` folder.
Do not make changes to the `lib/cardData.ts` file directly; instead, use the provided generation and merge scripts.

## System Architecture
GreetMe is built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS** with **shadcn/ui** components for a modern, responsive UI. The application features a vintage bookshelf aesthetic with warm tan/gold colors, teal action buttons, and a retro progress bar for loading.

**Technical Implementations:**
- **Card Customization & Sharing**: Users can personalize cards with sender/recipient names, personal notes, YouTube clips, and voice notes. Short, unique share links (`/c/{id}`) are generated for each card, including rich OG metadata for social sharing.
- **AI Card Generation**: Utilizes OpenAI's `gpt-image-1` for unique 1024x1024 card covers and `gpt-4o-mini` for crafting titles and centerfold messages, ensuring diverse art styles and tones across various categories.
- **Artist Studio**: A dedicated studio (`/artists`) allows users to upload custom cover images, write messages, and categorize their cards. They can create personal cards for a fee or submit cards to the public catalog for free.
- **Payment & Monetization**: Stripe is integrated for processing payments for premium cards, custom artist cards, and add-ons like YouTube clips. A post-payment flow handles email confirmations and share link generation.
- **Rich Media Add-ons**:
    - **YouTube Clips**: Users can embed a 30-second YouTube audio clip, played on the card's centerfold. It integrates with Stripe for payment.
    - **Voice Notes**: A personal audio message recorder (up to 30 seconds) using the WebM format. When both a voice note and YouTube clip are present, the voice note takes precedence with the YouTube clip playing softly in the background, with synchronized playback.
- **Cash Gifting via Cash App**: Allows senders to attach a cash gift to any card via Cash App deep links. Recipients see a "Request in Cash App" button with the amount pre-filled, plus an expandable "I need help" guide with step-by-step instructions for downloading and using Cash App. GreetMe facilitates the peer-to-peer connection but does not handle monetary transactions directly.
- **Database Schema**: Key data is stored in PostgreSQL (via Neon), using `shared_cards` for tracking shared instances of cards and `custom_cards` for artist-created content.

## External Dependencies
- **Database**: PostgreSQL (via Neon)
- **Payment Processing**: Stripe (integrated via `stripe-replit-sync`)
- **AI Services**: OpenAI (for `gpt-image-1` and `gpt-4o-mini` APIs)
- **Email Service**: Resend (via Replit connector)
- **Object Storage**: Replit Object Storage (for artist uploaded images and voice notes)
- **YouTube**: YouTube IFrame Player API (for embedding and controlling YouTube clips)
- **Cash App**: Integration through deep linking for cash gifts

## Project Structure
```
app/                         - Next.js app router pages
app/api/checkout/            - Stripe checkout session API
app/api/products/            - Stripe products listing API
app/api/share/               - Short link creation API (includes cash gift data)
app/api/send-confirmation/   - Purchase confirmation email API
app/api/stripe/webhook/      - Stripe webhook handler
app/artists/                 - Greet Me for Artists card creation studio
app/api/artists/upload/      - Artist image upload API (uses Replit Object Storage)
app/api/uploads/serve/       - Serves uploaded images from object storage
app/api/artists/create/      - Artist card creation API (with Stripe for personal cards)
app/api/artists/cards/       - Fetch approved public custom cards
app/api/artists/confirm-payment/ - Confirm Stripe payment for personal cards
app/api/youtube/resolve/     - YouTube URL resolver (oEmbed title lookup)
app/api/voice-note/upload/   - Voice note audio upload API (stores in Object Storage)
app/api/cashgift/confirm/    - Cash gift confirmation API (recipient marks received)
app/c/[id]/                  - Dynamic share page with OG metadata
components/                  - UI components (shadcn/ui)
components/YouTubeClipPlayer.tsx - YouTube clip player with red bar UI
components/VoiceNoteRecorder.tsx - Voice note recorder/uploader with MediaRecorder API
lib/                         - Utility functions
lib/cardData.ts              - Shared card data definitions (categories, groups, tags)
lib/resendClient.ts          - Resend email client (via Replit connector)
lib/stripeClient.ts          - Stripe client and StripeSync initialization
lib/initStripe.ts            - Stripe schema migration and webhook setup
lib/youtubeAddon.ts          - Dynamic YouTube addon Stripe product/price provisioning
lib/webhookHandlers.ts       - Stripe webhook processing (YouTube clip + gift card fulfillment)
lib/cashAppLinks.ts          - Cash App deep link URL generation utilities
lib/giftbitClient.ts         - Giftbit API client (brands, campaigns, links) [DISABLED]
app/api/giftbit/brands/      - Gift card brand listing API (cached) [DISABLED]
app/api/giftbit/fulfill/     - Gift card manual fulfillment API [DISABLED]
public/images/               - Card images and assets (incl. gen-* AI images)
scripts/                     - Generation and seed scripts
scripts/generate-cards.ts    - AI card generation script (covers + text)
scripts/merge-generated-cards.ts - Merges generated cards into cardData.ts
scripts/generated/           - JSON output from card generation (DO NOT EDIT)
styles/                      - Global CSS
next.config.mjs              - Next.js configuration
tailwind.config.ts           - Tailwind CSS configuration
```

## Key Files
- `app/page.tsx` - Main application page with all card logic, screens, and payment flow
- `app/layout.tsx` - Root layout with GreetMe metadata
- `lib/cardData.ts` - Card categories and data (shared between client and server)
- `lib/resendClient.ts` - Resend email client using Replit connector credentials
- `app/api/share/route.ts` - Creates short share links stored in DB (handles YouTube, voice note, and cash gift data)
- `app/c/[id]/page.tsx` - Server-side share page with OG metadata
- `app/c/[id]/ShareCardClient.tsx` - Client component for share page card display (includes CashGiftSection with help guide)
- `app/api/checkout/route.ts` - Creates Stripe checkout sessions for paid cards
- `app/api/products/route.ts` - Returns Stripe products mapped by card ID
- `app/api/send-confirmation/route.ts` - Sends purchase confirmation email with card link

## AI Card Generation System
- **Script**: `npx tsx scripts/generate-cards.ts --group=GROUP_ID --category=CATEGORY --limit=N`
- **Merge**: `npx tsx scripts/merge-generated-cards.ts`
- **Models**: gpt-image-1 (1024x1024 covers), gpt-4o-mini (titles + centerfold text)
- **Art Styles**: 10 style sets mapped by group (e.g., neo-expressionist, superflat pop art, infinity dot style)
- **Tones**: Each subcategory gets 3 cards: funny, heartfelt, uplifting
- **Speed**: ~40 sec/image, ~2 min/subcategory
- **Resume**: Skips existing images automatically
- **Output**: JSON files in scripts/generated/, images in public/images/gen-*

## Greet Me for Artists
- **Studio page**: `/artists` — upload custom cover, write centerfold/back messages, select categories
- **Card types**: Personal (paid, $4.99) or Public catalog submission (free)
- **API routes**: `/api/artists/upload`, `/api/artists/create`, `/api/artists/cards`, `/api/artists/confirm-payment`
- **Payment**: Stripe checkout with session_id tracking, payment confirmed on return
- **YouTube Clips**: Artists can add a 30-second YouTube clip (+$0.99) during personalization

## Greet Me Clips (YouTube Audio Add-on)
- **Feature**: Users can add a 30-second YouTube audio clip to any greeting card for $0.99, including custom artist cards
- **How it works**: Sender pastes a YouTube URL, selects a 30-second start time, clip plays on the Centerfold tab via YouTube IFrame Player API
- **Stripe**: $0.99 add-on line item (YOUTUBE_ADDON_PRICE_ID env var), works for regular cards, artist personal cards, and artist catalog cards
- **UI**: Red rounded "Now Playing Clip" bar with play/pause button, progress timer, clickable title opens YouTube
- **Payment flow**: Free cards with clip go through Stripe checkout; paid cards get clip as extra line item
- **Webhook**: checkout.session.completed event sets youtube_clip_enabled=true on shared_cards
- **API**: POST /api/youtube/resolve (oEmbed title lookup, no API key needed)
- **Component**: components/YouTubeClipPlayer.tsx (supports loop prop, volumeOverride prop, and onEnded callback for synced playback)
- **Seed script**: scripts/seed-youtube-addon.ts

## Voice Notes (Personal Audio Message)
- **Feature**: When adding a YouTube clip, creators can also record or upload a personal voice message (up to 30 seconds)
- **Instruction**: Creators are prompted to "Read the card's message aloud — make it personal!" with the centerfold text shown as reference
- **Recording**: Browser-native MediaRecorder API (audio/webm), auto-stops at 30s, includes playback preview
- **Upload**: Supports WebM, MP4, MP3, WAV audio files (max 10MB)
- **Storage**: Voice notes saved to Object Storage under `voice-notes/` directory
- **Playback**: On the recipient's card view, voice note plays as primary audio (teal "Voice Message" bar) with YouTube clip underneath at 25% volume as background music; playback is synced — pressing play/pause on either player controls both simultaneously
- **Smart ending**: If voice note is shorter than YouTube clip, the clip continues at full volume after the voice note ends. If YouTube clip is shorter than the voice note, the clip loops until the voice note finishes. Playback always lasts as long as the longer of the two.
- **API**: POST /api/voice-note/upload (stores audio in Object Storage, returns URL)
- **Component**: components/VoiceNoteRecorder.tsx (recorder/uploader), VoiceNotePlayer (in ShareCardClient.tsx)
- **Database**: voice_note_url column on shared_cards table

## GreetMe GiftCards via CashApp
- **Feature**: Senders can attach a cash gift to any card; recipient sees a "Request in Cash App" button
- **Flow**: Creator enters $cashtag + picks amount ($5-$50 presets) -> recipient sees Cash App deep link on centerfold -> clicks "Request in Cash App" -> confirms receipt via "I received it" button
- **No money through GreetMe**: Purely manual peer-to-peer via Cash App
- **Deep link**: `https://cash.app/$TAG?amount=N&note=Gift+from+SENDER+via+GreetMe`
- **Help guide**: Expandable "I need help" section with step-by-step instructions for downloading Cash App (App Store + Google Play links), setting up an account, requesting the money, and confirming receipt
- **Confirmation API**: POST /api/cashgift/confirm sets cash_gift_status='confirmed'
- **Server-side validation**: Cashtag format sanitized (alphanumeric + underscore only), amount validated ($1-$500 range)
- **Database columns**: cash_gift_amount INTEGER, cash_gift_cashtag VARCHAR, cash_gift_status VARCHAR ('pending' | 'confirmed'), cash_gift_confirmed_at TIMESTAMP
- **UI**: Green Cash App branded toggle section in customize screen; green gradient section on recipient's centerfold tab with CashGiftSection component
- **Giftbit gift cards**: Code kept intact (lib/giftbitClient.ts, api/giftbit/) but UI disabled until production approval

## Database Tables
- `shared_cards` - Short link storage (id VARCHAR(8) PK, card_id INTEGER nullable, sender_name, recipient_name, personal_note, custom_card_id VARCHAR(8) nullable, youtube_video_id, youtube_url, youtube_title, youtube_start_seconds, youtube_end_seconds, youtube_clip_enabled BOOLEAN, voice_note_url TEXT, cash_gift_amount INTEGER, cash_gift_cashtag VARCHAR, cash_gift_status VARCHAR, cash_gift_confirmed_at TIMESTAMP, gift_card_brand, gift_card_amount_cents, gift_card_recipient_email, gift_card_status, created_at)
- `custom_cards` - Artist-created cards (id VARCHAR(8) PK, cover_image_url, centerfold_message, caption, back_message, category_ids TEXT[], creator_name, is_public, is_approved, is_paid, stripe_session_id, created_at)
- `stripe.*` - Stripe sync tables (managed by stripe-replit-sync)

## Design Theme
- Vintage bookshelf aesthetic with warm tan/gold colors (#c49a6c, #b8860b)
- Teal action buttons (#4EAAA2), coral/pink send buttons
- Cash App green (#00D632) for cash gift sections
- Loading screen with retro progress bar
- Wooden shelf card display in library view
- Categories organized by group with section headers

## Running
- Dev: `npx next dev -H 0.0.0.0 -p 5000`
- Build: `npx next build`
- Start: `npx next start -H 0.0.0.0 -p 5000`

## AI Generation Commands
- Generate cards: `npx tsx scripts/generate-cards.ts --group=GROUP_ID --limit=N`
- Merge into app: `npx tsx scripts/merge-generated-cards.ts`
- Dry run: `npx tsx scripts/generate-cards.ts --dry-run --limit=999`
