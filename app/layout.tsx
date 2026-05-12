import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Automatica - YouTube Subscription Gatekeeper',
  description: 'Gate your content behind YouTube subscriptions. Create exclusive links that only your subscribers can access.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}