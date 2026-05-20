import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Landing Page Starter', description: 'AI Frontend Studio — landing-page workflow örneği' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="tr"><body>{children}</body></html>;
}
