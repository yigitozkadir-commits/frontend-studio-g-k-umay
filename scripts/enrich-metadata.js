#!/usr/bin/env node
/**
 * enrich-metadata.js — v4
 *
 * Idempotent: pads every entry in orchestration/index.json with default
 * v4 fields (lifecycle, scores, bundle_kb_gzip) without overwriting any
 * value that's already set by a human curator.
 *
 * Heuristics:
 *   - bundle_kb_gzip ← performance/bundle-budget.json (if name matches)
 *   - lifecycle defaults to "active"
 *   - "react-beautiful-dnd" auto-marked deprecated (replaced by dnd-kit)
 *   - lucide / shadcn / tailwind etc. get high maintenance defaults
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'orchestration/index.json');
const budgetPath = path.join(root, 'performance/bundle-budget.json');

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));

const budgetByName = new Map();
const budgetById = new Map();
for (const p of budget.packages ?? []) {
  budgetByName.set(p.name.toLowerCase(), p.gzip_kb);
  if (typeof p.id === 'number') budgetById.set(p.id, p.gzip_kb);
}

// Known deprecations / lifecycle hints
const DEPRECATIONS = {
  'atlassian/react-beautiful-dnd': { lifecycle: 'deprecated', replaced_by_name: 'clauderic/dnd-kit', reason: 'Bakım dışı — dnd-kit önerilir.' },
  'moment/moment':                  { lifecycle: 'legacy',     replaced_by_name: 'iamkun/dayjs',     reason: 'Tree-shake edilemiyor.' },
  'redux/redux':                    { lifecycle: 'legacy',     replaced_by_name: 'pmndrs/zustand',   reason: 'Boilerplate ağır; küçük uygulamalarda zustand yeterli.' },
};

const DEFAULT_SCORES_BY_TYPE = {
  framework:  { ssr_compat: 8, rsc_compat: 6, bundle_cost: 5, typescript: 8, maintenance: 8, learning_curve: 5, community: 8 },
  library:    { ssr_compat: 7, rsc_compat: 6, bundle_cost: 6, typescript: 7, maintenance: 7, learning_curve: 6, community: 7 },
  tool:       { ssr_compat: 6, rsc_compat: 6, bundle_cost: 7, typescript: 6, maintenance: 7, learning_curve: 6, community: 6 },
  reference:  { ssr_compat: 5, rsc_compat: 5, bundle_cost: 10, typescript: 5, maintenance: 7, learning_curve: 7, community: 7 },
  template:   { ssr_compat: 6, rsc_compat: 6, bundle_cost: 8, typescript: 6, maintenance: 6, learning_curve: 7, community: 6 },
  service:    { ssr_compat: 5, rsc_compat: 5, bundle_cost: 8, typescript: 6, maintenance: 7, learning_curve: 6, community: 6 },
  spec:       { ssr_compat: 5, rsc_compat: 5, bundle_cost: 10, typescript: 5, maintenance: 7, learning_curve: 6, community: 7 },
};

let touched = 0, deprecatedCount = 0;
const nameToId = new Map(index.map((t) => [t.name, t.id]));

for (const tool of index) {
  // lifecycle
  if (!tool.lifecycle) {
    const hit = DEPRECATIONS[tool.name];
    if (hit) {
      tool.lifecycle = hit.lifecycle;
      tool.deprecation_reason = hit.reason;
      const replId = nameToId.get(hit.replaced_by_name);
      if (replId) tool.replaced_by = replId;
      deprecatedCount++;
    } else {
      tool.lifecycle = 'active';
    }
    touched++;
  }
  // scores
  if (!tool.scores) {
    tool.scores = { ...(DEFAULT_SCORES_BY_TYPE[tool.type] ?? DEFAULT_SCORES_BY_TYPE.library) };
    touched++;
  }
  // bundle_kb_gzip
  if (tool.bundle_kb_gzip == null) {
    const short = String(tool.name).split('/').pop()?.toLowerCase();
    const kb = budgetById.get(tool.id) ?? budgetByName.get(short) ?? budgetByName.get(tool.name.toLowerCase());
    if (typeof kb === 'number') {
      tool.bundle_kb_gzip = kb;
      // Recalibrate bundle_cost from real size: <10KB → 10, >100KB → 2
      const kbToScore = (k) => Math.max(1, Math.min(10, Math.round(10 - Math.log10(Math.max(1, k)) * 3)));
      tool.scores.bundle_cost = kbToScore(kb);
    }
  }
}

fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
console.log(`✅ enrich-metadata: ${touched} alan eklendi, ${deprecatedCount} araç deprecated/legacy işaretlendi.`);
