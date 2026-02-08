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
app/api/stripe/webhook/ - Stripe webhook handler
components/             - UI components (shadcn/ui)
lib/                    - Utility functions (stripeClient, initStripe)
public/images/          - Card images and assets
scripts/                - Seed scripts (seed-valentines-products.ts)
styles/                 - Global CSS
```

## Key Files
- `app/page.tsx` - Main application page with all card logic, screens, and payment flow
- `app/layout.tsx` - Root layout
- `lib/stripeClient.ts` - Stripe client and StripeSync initialization
- `lib/initStripe.ts` - Stripe schema migration and webhook setup
- `app/api/checkout/route.ts` - Creates Stripe checkout sessions for paid cards
- `app/api/products/route.ts` - Returns Stripe products mapped by card ID
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration

## Valentine's Day Cards (Paid via Stripe)
- **Paid cards** (IDs 28, 29, 31, 32, 33): $0.99 each, require Stripe checkout
- **Free cards** (IDs 30, 34): No payment required
- Stripe products seeded via `scripts/seed-valentines-products.ts`

## Design Theme
- Vintage bookshelf aesthetic with warm tan/gold colors (#c49a6c, #b8860b)
- Teal action buttons (#4EAAA2), coral/pink send buttons
- Loading screen with retro progress bar
- Wooden shelf card display in library view

## Running
- Dev: `npx next dev -H 0.0.0.0 -p 5000`
- Build: `npx next build`
- Start: `npx next start -H 0.0.0.0 -p 5000`
