# GreetMe - Greeting Cards App

## Overview
GreetMe is a Next.js application designed for creating, customizing, and sharing digital greeting cards. It offers a diverse range of categories, AI-generated card covers with unique art styles, and clever centerfold messages. The platform emphasizes personal expression, allowing users to embed YouTube clips, voice notes, and even attach cash gifts. Its aesthetic is inspired by a vintage bookshelf, using warm colors and wooden textures for an inviting user experience. GreetMe also includes an "Artists" studio where users can design and submit their own cards for personal use or public catalog inclusion.

## User Preferences
I prefer clear and concise communication.
I like iterative development with regular updates.
Please ask for confirmation before implementing major changes or complex features.
I value detailed explanations for technical decisions.
Do not make changes to files in the `scripts/generated/` folder.
Do not make changes to the `lib/cardData.ts` file directly; instead, use the provided generation and merge scripts.

## System Architecture
GreetMe is built with Next.js 15 (App Router), TypeScript, and Tailwind CSS, utilizing shadcn/ui components for a modern, responsive user interface. The application features a vintage bookshelf aesthetic characterized by warm tan/gold colors, teal action buttons, and a retro progress bar for loading states.

**Key Features and Technical Implementations:**
- **Card Customization & Sharing**: Users can personalize cards with names, notes, YouTube clips, and voice notes. Unique short share links (`/c/{id}`) are generated, featuring rich OG metadata for social media.
- **AI Card Generation**: Leverages OpenAI's `gpt-image-1` for unique 1024x1024 card covers and `gpt-4o-mini` for crafting titles and centerfold messages across various categories and art styles.
- **Artist Studio**: A dedicated section (`/artists`) allows users to upload custom cover images, write messages, categorize cards, and choose between creating personal cards (paid) or submitting to the public catalog (free).
- **Payment & Monetization**: Stripe is integrated for processing payments related to premium cards, custom artist cards, and add-ons like YouTube clips.
- **Rich Media Add-ons**:
    - **YouTube Clips**: Users can embed 30-second YouTube audio clips, played on the card's centerfold.
    - **Voice Notes**: A personal audio message recorder (up to 30 seconds, WebM format). When both are present, the voice note takes precedence with the YouTube clip playing softly in the background, with synchronized playback.
- **Cash Gifting via Cash App**: Senders can attach a cash gift, facilitating peer-to-peer transactions through Cash App deep links. GreetMe provides a "Request in Cash App" button and a help guide for recipients but does not handle monetary transfers directly.
- **Database**: PostgreSQL (via Neon) is used to store key data, including shared card instances and custom artist content.

## External Dependencies
- **Database**: PostgreSQL (via Neon)
- **Payment Processing**: Stripe (integrated via `stripe-replit-sync`)
- **AI Services**: OpenAI (for `gpt-image-1` and `gpt-4o-mini` APIs)
- **Email Service**: Resend (via Replit connector)
- **Object Storage**: Replit Object Storage (for artist uploaded images and voice notes)
- **YouTube**: YouTube IFrame Player API (for embedding and controlling clips)
- **Cash App**: Integration through deep linking for cash gifts