# GreetMe - Greeting Cards App

## Overview
A Next.js greeting card application that lets users browse, customize, and share digital greeting cards across various categories (Father's Day, Birthday, Get Well, Graduation, Juneteenth, Fourth of July, Valentine's Day). Features a vintage bookshelf aesthetic with wooden textures and warm colors.

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Package Manager**: npm (migrated from pnpm)
- **Port**: 5000 (dev server)
- **Database**: PostgreSQL (Neon-backed via Replit)
- **Payments**: Stripe integration via stripe-replit-sync

## Project Structure
```
app/                         - Next.js app router pages
app/api/checkout/            - Stripe checkout session API
app/api/products/            - Stripe products listing API
app/api/share/               - Short link creation API
app/api/send-confirmation/   - Purchase confirmation email API
app/api/stripe/webhook/      - Stripe webhook handler
app/c/[id]/                  - Dynamic share page with OG metadata
components/                  - UI components (shadcn/ui)
lib/                         - Utility functions
lib/cardData.ts              - Shared card data definitions
lib/resendClient.ts          - Resend email client (via Replit connector)
lib/stripeClient.ts          - Stripe client and StripeSync initialization
lib/initStripe.ts            - Stripe schema migration and webhook setup
public/images/               - Card images and assets
scripts/                     - Seed scripts (seed-valentines-products.ts)
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
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration

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
- OG metadata: "You've received a GreetMe Card from [sender]"
- Card images use absolute URLs for social media crawlers
- Falls back to query param links if short link creation fails

## Customize Screen
- **Cover tab**: Shows the card cover image
- **Customize tab**: Form fields (From, To, Personal Note, Price, Send button)
- **Centerfold tab**: Preview of inside message with personal note
- **Back tab**: Preview of back with From/To info

## Database Tables
- `shared_cards` - Short link storage (id VARCHAR(8) PK, card_id, sender_name, recipient_name, personal_note, created_at)
- `stripe.*` - Stripe sync tables (managed by stripe-replit-sync)

## Design Theme
- Vintage bookshelf aesthetic with warm tan/gold colors (#c49a6c, #b8860b)
- Teal action buttons (#4EAAA2), coral/pink send buttons
- Loading screen with retro progress bar
- Wooden shelf card display in library view

## Running
- Dev: `npx next dev -H 0.0.0.0 -p 5000`
- Build: `npx next build`
- Start: `npx next start -H 0.0.0.0 -p 5000`
