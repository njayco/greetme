# GreetMe - Greeting Cards App

## Overview
A Next.js greeting card application that lets users browse, customize, and share digital greeting cards across various categories (Father's Day, Birthday, Get Well, Graduation, Juneteenth, Fourth of July).

## Project Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Package Manager**: npm (migrated from pnpm)
- **Port**: 5000 (dev server)

## Project Structure
```
app/            - Next.js app router pages
components/     - UI components (shadcn/ui)
lib/            - Utility functions
public/images/  - Card images and assets
styles/         - Global CSS
```

## Key Files
- `app/page.tsx` - Main application page with all card logic
- `app/layout.tsx` - Root layout
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration

## Running
- Dev: `npx next dev -H 0.0.0.0 -p 5000`
- Build: `npx next build`
- Start: `npx next start -H 0.0.0.0 -p 5000`
