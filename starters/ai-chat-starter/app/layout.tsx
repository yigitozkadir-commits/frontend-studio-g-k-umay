import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat Starter',
  description: 'AI Frontend Studio — ai-chat workflow örneği',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}<Toaster position="top-right" /></body>
    </html>
  );
}
