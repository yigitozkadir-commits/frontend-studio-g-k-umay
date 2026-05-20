#!/usr/bin/env node
/**
 * category-coverage.js — v4
 *
 * Kategori kapsama raporu üretir. CI içinde periyodik çalışıp markdown
 * çıktısı (docs/COVERAGE.md) üretir; uncovered kategorileri roadmap girdisi
 * olarak listeler.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const index = JSON.parse(fs.readFileSync(path.join(root, 'orchestration/index.json'), 'utf8'));
const cats = JSON.parse(fs.readFileSync(path.join(root, 'orchestration/categories.json'), 'utf8'));
const wfDir = path.join(root, 'orchestration/workflows');
const workflows = fs.readdirSync(wfDir).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(wfDir, f), 'utf8')));

const byId = new Map(index.map((t) => [t.id, t]));
const used = new Set();
for (const wf of workflows) {
  for (const s of wf.steps) {
    const t = byId.get(s.tool_id);
    if (t) used.add(t.category);
  }
  for (const c of (wf.category_slugs ?? [])) used.add(c);
}

const covered = cats.filter((c) => used.has(c.slug));
const uncovered = cats.filter((c) => !used.has(c.slug));

const md = [
  '# 📊 Kategori Kapsama Raporu (v4)',
  '',
  `_Otomatik üretildi: ${new Date().toISOString().slice(0, 10)}_`,
  '',
  `- **Toplam kategori:** ${cats.length}`,
  `- **Workflow'larda kullanılan:** ${covered.length}`,
  `- **Kapsam dışı:** ${uncovered.length}`,
  `- **Kapsam oranı:** ${Math.round((covered.length / cats.length) * 100)}%`,
  '',
  '## ✅ Kapsanan kategoriler',
  '',
  ...covered.map((c) => `- \`${c.slug}\` — ${c.name} (${c.tool_count} araç)`),
  '',
  '## ⚠ Kapsam dışı kategoriler',
  '',
  '> Bunlar roadmap girdisi olarak değerlendirilmeli — yeni workflow adayları.',
  '',
  ...uncovered.map((c) => `- \`${c.slug}\` — ${c.name} (${c.tool_count} araç)`),
  '',
].join('\n');

const outPath = path.join(root, 'docs/COVERAGE.md');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);
console.log(`✅ docs/COVERAGE.md güncellendi (${covered.length}/${cats.length} kapsanan, %${Math.round((covered.length / cats.length) * 100)}).`);
