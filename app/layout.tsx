import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GreetMe - Digital Greeting Cards',
  description: 'Browse, customize, and share beautiful digital greeting cards for every occasion. Not Just a Card - An Experience!',
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
