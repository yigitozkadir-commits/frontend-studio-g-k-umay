import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Dashboard Starter', description: 'AI Frontend Studio — dashboard workflow örneği' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="tr"><body className="bg-gray-50 text-gray-900">{children}</body></html>;
}
