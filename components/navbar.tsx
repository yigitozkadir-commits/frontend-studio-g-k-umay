/**
 * Navbar — responsive, sticky, dark mode toggle.
 */
'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

export interface NavItem {
  href: string;
  label: string;
}

export function Navbar({
  brand = 'My App',
  items = [],
  cta
}: {
  brand?: string;
  items?: NavItem[];
  cta?: { href: string; label: string };
}) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">{brand}</Link>
        <nav className="hidden md:flex gap-6">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className="text-sm hover:underline">
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            aria-label="Tema değiştir"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {cta && (
            <Link
              href={cta.href}
              className="hidden md:inline-block bg-black text-white px-3 py-1.5 rounded-md text-sm dark:bg-white dark:text-black"
            >
              {cta.label}
            </Link>
          )}
          <button
            aria-label="Menüyü aç"
            className="md:hidden p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t">
          <ul className="px-4 py-2 space-y-1">
            {items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="block py-2 text-sm" onClick={() => setOpen(false)}>
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
