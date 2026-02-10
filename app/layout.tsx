import type { Metadata } from 'next'
import './globals.css'

const baseUrl = process.env.REPLIT_DOMAINS
  ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
  : 'http://localhost:5000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'GreetMe - Digital Greeting Cards',
  description: 'Browse, customize, and share beautiful digital greeting cards for every occasion. Not Just a Card - An Experience!',
  openGraph: {
    title: 'GreetMe - Digital Greeting Cards',
    description: 'Browse, customize, and share beautiful digital greeting cards for every occasion. Not Just a Card - An Experience!',
    images: [
      {
        url: '/images/og-image.png',
        width: 1536,
        height: 1024,
        alt: 'GreetMe - Spread Love, Share Joy',
      },
    ],
    type: 'website',
    siteName: 'GreetMe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreetMe - Digital Greeting Cards',
    description: 'Browse, customize, and share beautiful digital greeting cards for every occasion. Not Just a Card - An Experience!',
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
