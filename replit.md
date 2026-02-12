# GreetMe - Greeting Cards App

## Overview
A Next.js greeting card application that lets users browse, customize, and share digital greeting cards across 39+ categories organized into 10 groups. Features AI-generated card covers with unique art styles and clever centerfold messages. Vintage bookshelf aesthetic with wooden textures and warm colors.

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Package Manager**: npm (migrated from pnpm)
- **Port**: 5000 (dev server)
- **Database**: PostgreSQL (Neon-backed via Replit)
- **Payments**: Stripe integration via stripe-replit-sync
- **AI Generation**: OpenAI (gpt-image-1 for covers, gpt-4o-mini for text)

## Project Structure
```
app/                         - Next.js app router pages
app/api/checkout/            - Stripe checkout session API
app/api/products/            - Stripe products listing API
app/api/share/               - Short link creation API
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
lib/giftbitClient.ts         - Giftbit API client (brands, campaigns, links)
app/api/giftbit/brands/      - Gift card brand listing API (cached)
app/api/giftbit/fulfill/     - Gift card manual fulfillment API
public/images/               - Card images and assets (incl. gen-* AI images)
scripts/                     - Generation and seed scripts
scripts/generate-cards.ts    - AI card generation script (covers + text)
scripts/merge-generated-cards.ts - Merges generated cards into cardData.ts
scripts/generated/           - JSON output from card generation
styles/                      - Global CSS
```

## Key Files
- `app/page.tsx` - Main application page with all card logic, screens, and payment flow
- `app/layout.tsx` - Root layout with GreetMe metadata
- `lib/cardData.ts` - Card categories and data (shared between client and server)
- `lib/resendClient.ts` - Resend email client using Replit connector credentials
- `app/api/share/route.ts` - Creates short share links stored in DB
- `app/c/[id]/page.tsx` - Server-side share page with OG metadata
- `app/c/[id]/ShareCardClient.tsx` - Client component for share page card display
- `app/api/checkout/route.ts` - Creates Stripe checkout sessions for paid cards
- `app/api/products/route.ts` - Returns Stripe products mapped by card ID
- `app/api/send-confirmation/route.ts` - Sends purchase confirmation email with card link
- `scripts/generate-cards.ts` - AI card generation (OpenAI gpt-image-1 + gpt-4o-mini)
- `scripts/merge-generated-cards.ts` - Merges generated JSON into cardData.ts
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## AI Card Generation System
- **Script**: `npx tsx scripts/generate-cards.ts --group=GROUP_ID --category=CATEGORY --limit=N`
- **Merge**: `npx tsx scripts/merge-generated-cards.ts`
- **Models**: gpt-image-1 (1024x1024 covers), gpt-4o-mini (titles + centerfold text)
- **Art Styles**: 10 style sets mapped by group (e.g., neo-expressionist, superflat pop art, infinity dot style)
- **Tones**: Each subcategory gets 3 cards: funny, heartfelt, uplifting
- **Speed**: ~40 sec/image, ~2 min/subcategory
- **Resume**: Skips existing images automatically
- **Output**: JSON files in scripts/generated/, images in public/images/gen-*
- **Status**: 61 AI images generated, 20 subcategories completed, 136 remaining

## Card Categories & Groups

### Category Data Model
```typescript
CardType: { id, title, cover, centerfold, back, price?, tags? }
CategoryType: { name, color, group?, cards[] }
```

### 10 Category Groups (152 total cards, 39+ categories)
- **Popular Holidays**: Valentine's Day (33), Mother's Day (1), Father's Day (12), Halloween (1), St. Patrick's Day (1), Black History Month (1), Women's History Month (1), Pride Month (1)
- **National Holidays**: Fourth of July (3), New Year's Day (1), MLK Day (1), Memorial Day (1), Labor Day (1), Veterans Day (1), Thanksgiving (1), Juneteenth (2), Presidents' Day (3)
- **Religious & Cultural**: Christmas (1), Hanukkah (1), Kwanzaa (1), Easter (1), Diwali (1), Rosh Hashanah (3), Yom Kippur (3)
- **Celebrations & Milestones**: Birthday (7+), Graduation (6+), Congratulations (7+)
- **Life Events**: Wedding (1), Anniversary (1), New Baby (1), Retirement (1), New Job (1), New Home (1), Career Change (3), First Job (3)
- **Support & Sympathy**: Get Well Soon (6+), Sympathy (1), Thinking of You (1), Encouragement (1), Mental Health (3), Surgery Recovery (3)
- **Appreciation**: Thank You (1)
- **Feelings**: Love & Romance (1), Miss You (1), Friendship (1), I'm Sorry (1)
- **Pride & LGBTQ+**: Coming Out (3), LGBTQ+ Love (3)
- **Seasonal**: Fall Vibes (3), Winter Cheer (3)

### Card ID Ranges
- IDs 1-12: Father's Day
- IDs 13-16: Birthday
- IDs 17-19: Get Well Soon
- IDs 20-22: Graduation
- IDs 23-24: Juneteenth
- IDs 25-27: Fourth of July
- IDs 28-60: Valentine's Day (paid via Stripe)
- IDs 61-92: Original expanded categories (1 card each)
- IDs 93+: AI-generated cards (3 per subcategory)

## Valentine's Day Cards (Paid via Stripe)
- **33 total cards** (IDs 28-60): 7 original + 26 new
- **Free cards** (IDs 30, 34): No payment required
- **$0.99 cards**: IDs 28, 29, 31, 32, 33, 35, 39, 43, 46, 53
- **$1.49 cards**: IDs 36, 41, 45, 48, 56, 59
- **$1.99 cards**: IDs 37, 40, 49, 51, 57
- **$2.14 cards**: ID 60 (The Raven's Truth)
- **$2.49 cards**: IDs 38, 44, 52, 54
- **$2.99 cards**: IDs 42, 47, 50, 55, 58
- Stripe products seeded via `scripts/seed-valentines-products.ts`

## Post-Payment Flow (Paid Cards)
1. User fills in card details and clicks Send
2. Share link is created in DB before checkout
3. User is redirected to Stripe checkout (shareId stored in session metadata)
4. After successful payment, Stripe redirects to `/?payment=success&shareId=XXX&session_id=YYY`
5. Frontend shows the share link page with copy/share buttons
6. Confirmation email is sent via Resend with the card link (email from Stripe session)

## Sharing System
- Short links generated via `/api/share` endpoint, stored in `shared_cards` table
- Share URLs format: `/c/{7-char-id}` (e.g., `/c/YC632Ax`)
- Supports both regular cards (card_id INTEGER) and custom artist cards (custom_card_id VARCHAR)
- OG metadata: "You've received a GreetMe Card from [sender]"
- Card images use absolute URLs for social media crawlers
- Falls back to query param links if short link creation fails
- Artist cards: Public catalog cards get share link on creation; personal cards get share link after payment confirmation

## Customize Screen
- **Cover tab**: Shows the card cover image
- **Customize tab**: Form fields (From, To, Personal Note, Price, Send button)
- **Centerfold tab**: Preview of inside message with personal note
- **Back tab**: Preview of back with From/To info

## Greet Me for Artists
- **URL**: `/artists`
- **Features**: Upload cover image, write centerfold/back messages, select categories, preview card
- **Personal cards**: $4.99 via Stripe checkout
- **Catalog submissions**: Free (100% discount), cards become part of public library
- **Flow**: Welcome > Upload Image > Write Messages > Choose Categories > Preview > Personalize > Submit
- **Backup**: Custom cards are backed up as JSON to Object Storage (`card-backups/`) to survive database rollbacks; auto-restored on next load if missing from DB
- **API routes**: `/api/artists/upload`, `/api/artists/create`, `/api/artists/cards`, `/api/artists/confirm-payment`
- **Payment**: Stripe checkout with session_id tracking, payment confirmed on return
- **YouTube Clips**: Artists can add a 30-second YouTube clip (+$0.99) during personalization; catalog cards with clips go through Stripe for the addon; personal cards add clip as extra line item ($4.99 + $0.99)

## Greet Me Clips (YouTube Audio Add-on)
- **Feature**: Users can add a 30-second YouTube audio clip to any greeting card for $0.99, including custom artist cards
- **How it works**: Sender pastes a YouTube URL, selects a 30-second start time, clip plays on the Centerfold tab via YouTube IFrame Player API
- **Stripe**: $0.99 add-on line item (YOUTUBE_ADDON_PRICE_ID env var), works for regular cards, artist personal cards, and artist catalog cards
- **UI**: Red rounded "Now Playing Clip" bar with play/pause button, progress timer, clickable title opens YouTube
- **Payment flow**: Free cards with clip go through Stripe checkout; paid cards get clip as extra line item
- **Webhook**: checkout.session.completed event sets youtube_clip_enabled=true on shared_cards
- **API**: POST /api/youtube/resolve (oEmbed title lookup, no API key needed)
- **Component**: components/YouTubeClipPlayer.tsx
- **Seed script**: scripts/seed-youtube-addon.ts

## Voice Notes (Personal Audio Message)
- **Feature**: When adding a YouTube clip, creators can also record or upload a personal voice message (up to 60 seconds)
- **Instruction**: Creators are prompted to "Read the card's message aloud — make it personal!" with the centerfold text shown as reference
- **Recording**: Browser-native MediaRecorder API (audio/webm), auto-stops at 60s, includes playback preview
- **Upload**: Supports WebM, MP4, MP3, WAV audio files (max 10MB)
- **Storage**: Voice notes saved to Object Storage under `voice-notes/` directory
- **Playback**: On the recipient's card view, voice note plays as primary audio (teal "Voice Message" bar) with YouTube clip underneath at 25% volume as background music
- **API**: POST /api/voice-note/upload (stores audio in Object Storage, returns URL)
- **Component**: components/VoiceNoteRecorder.tsx (recorder/uploader), VoiceNotePlayer (in ShareCardClient.tsx)
- **Database**: voice_note_url column on shared_cards table

## Database Tables
- `shared_cards` - Short link storage (id VARCHAR(8) PK, card_id INTEGER nullable, sender_name, recipient_name, personal_note, custom_card_id VARCHAR(8) nullable, youtube_video_id, youtube_url, youtube_title, youtube_start_seconds, youtube_end_seconds, youtube_clip_enabled BOOLEAN, voice_note_url TEXT, created_at)
- `custom_cards` - Artist-created cards (id VARCHAR(8) PK, cover_image_url, centerfold_message, caption, back_message, category_ids TEXT[], creator_name, is_public, is_approved, is_paid, stripe_session_id, created_at)
- `stripe.*` - Stripe sync tables (managed by stripe-replit-sync)

## Design Theme
- Vintage bookshelf aesthetic with warm tan/gold colors (#c49a6c, #b8860b)
- Teal action buttons (#4EAAA2), coral/pink send buttons
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
