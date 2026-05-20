import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chess Starter | Timurlenko Satranç UI',
  description: 'Canlı 2 oyunculu satranç oyunu - Next.js + React + TypeScript',
  keywords: ['satranç', 'chess', 'oyun', 'ai-frontend-studio'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-white dark:bg-slate-900 text-black dark:text-white transition-colors">
        {children}
      </body>
    </html>
  )
}
