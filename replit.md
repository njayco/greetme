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
app/                    - Next.js app router pages
app/api/checkout/       - Stripe checkout session API
app/api/products/       - Stripe products listing API
app/api/share/          - Short link creation API
app/api/stripe/webhook/ - Stripe webhook handler
app/c/[id]/             - Dynamic share page with OG metadata
components/             - UI components (shadcn/ui)
lib/                    - Utility functions
lib/cardData.ts         - Shared card data definitions (used by page.tsx and share page)
lib/stripeClient.ts     - Stripe client and StripeSync initialization
lib/initStripe.ts       - Stripe schema migration and webhook setup
public/images/          - Card images and assets
scripts/                - Seed scripts (seed-valentines-products.ts)
styles/                 - Global CSS
```

## Key Files
- `app/page.tsx` - Main application page with all card logic, screens, and payment flow
- `app/layout.tsx` - Root layout with GreetMe metadata
- `lib/cardData.ts` - Card categories and data (shared between client and server)
- `app/api/share/route.ts` - Creates short share links stored in DB
- `app/c/[id]/page.tsx` - Server-side share page with OG metadata
- `app/c/[id]/ShareCardClient.tsx` - Client component for share page card display
- `app/api/checkout/route.ts` - Creates Stripe checkout sessions for paid cards
- `app/api/products/route.ts` - Returns Stripe products mapped by card ID
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## Valentine's Day Cards (Paid via Stripe)
- **Paid cards** (IDs 28, 29, 31, 32, 33): $0.99 each, require Stripe checkout
- **Free cards** (IDs 30, 34): No payment required
- Stripe products seeded via `scripts/seed-valentines-products.ts`

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
