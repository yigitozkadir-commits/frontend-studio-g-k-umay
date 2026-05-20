/**
 * useHotkey — Basit, bağımlılıksız klavye kısayolu hook'u.
 *
 * Kullanım:
 *   useHotkey('Meta+k', () => setPaletteOpen(true));
 *   useHotkey('Shift+?', () => setHelpOpen(true));
 */
import { useEffect } from 'react';

function parseCombo(combo: string) {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());
  const key = parts.pop()!;
  return {
    meta: parts.includes('meta') || parts.includes('cmd'),
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    key
  };
}

export function useHotkey(combo: string, handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const target = parseCombo(combo);
    const fn = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== target.key) return;
      if (target.meta && !e.metaKey) return;
      if (target.ctrl && !e.ctrlKey) return;
      if (target.shift && !e.shiftKey) return;
      if (target.alt && !e.altKey) return;
      e.preventDefault();
      handler(e);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [combo, handler]);
}
