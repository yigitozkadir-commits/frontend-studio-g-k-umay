/**
 * CommandPalette — Cmd+K stili komut paleti.
 * Stack: cmdk + shadcn/ui benzeri primitives.
 */
'use client';
import { useEffect, useState } from 'react';

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}

export function CommandPalette({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          placeholder="Komut ara…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 border-b outline-none"
        />
        <ul className="max-h-80 overflow-y-auto">
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => {
                  c.onSelect();
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex justify-between"
              >
                <span>{c.label}</span>
                {c.shortcut && <kbd className="text-xs text-gray-500">{c.shortcut}</kbd>}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-gray-500">Sonuç yok</li>
          )}
        </ul>
      </div>
    </div>
  );
}
