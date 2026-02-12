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
- **Cash Gifting**: Allows senders to suggest a cash gift via Cash App deep links. GreetMe facilitates the peer-to-peer connection but does not handle monetary transactions directly.
- **Database Schema**: Key data is stored in PostgreSQL (via Neon), using `shared_cards` for tracking shared instances of cards and `custom_cards` for artist-created content.

## External Dependencies
- **Database**: PostgreSQL (via Neon)
- **Payment Processing**: Stripe (integrated via `stripe-replit-sync`)
- **AI Services**: OpenAI (for `gpt-image-1` and `gpt-4o-mini` APIs)
- **Email Service**: Resend (via Replit connector)
- **Object Storage**: Replit Object Storage (for artist uploaded images and voice notes)
- **YouTube**: YouTube IFrame Player API (for embedding and controlling YouTube clips)
- **Cash App**: Integration through deep linking for cash gifts.