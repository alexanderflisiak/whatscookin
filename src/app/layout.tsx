import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'WhatsCookin',
  description: 'Shared Cookbook',
  appleWebApp: {
    title: 'WhatsCookin',
    statusBarStyle: 'default',
    capable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-background text-text-hi pb-safe">
        <main className="flex-1 pb-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
