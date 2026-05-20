/**
 * Footer — Marketing siteleri için 4 sütun + alt bilgi.
 */
import Link from 'next/link';

export interface FooterLink {
  href: string;
  label: string;
}
export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export function Footer({
  brand = 'My App',
  columns = [],
  copyright = `© ${new Date().getFullYear()} My App. Tüm hakları saklıdır.`
}: {
  brand?: string;
  columns?: FooterColumn[];
  copyright?: string;
}) {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <p className="font-semibold mb-2">{brand}</p>
          <p className="text-sm text-gray-500">Hızlı, modern frontend için araç seti.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-medium mb-2 text-sm">{col.title}</p>
            <ul className="space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <p className="max-w-7xl mx-auto px-4 py-4 text-xs text-gray-500">{copyright}</p>
      </div>
    </footer>
  );
}
