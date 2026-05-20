#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

function load(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) { console.error(`❌ Dosya bulunamadı: ${rel}`); process.exit(1); }
  return JSON.parse(readFileSync(p, 'utf8'));
}

const stack = process.argv[2];
if (!stack) { console.error('Kullanım: node tools/compat-smoke/index.js <stack-adı>'); process.exit(1); }

const wfPath = `orchestration/workflows/${stack}.json`;
if (!existsSync(join(ROOT, wfPath))) {
  console.error(`❌ Workflow bulunamadı: ${wfPath}`); process.exit(1);
}

const workflow = load(wfPath);
const index    = load('orchestration/index.json');
const toolsById = new Map(index.map(t => [t.id, t]));
const deprecated = new Set(index.filter(t => t.lifecycle === 'deprecated').map(t => t.id));

let errors = 0;
for (const step of workflow.steps ?? []) {
  if (!toolsById.has(step.tool_id)) {
    console.error(`  ❌ [${stack}] step ${step.order}: bilinmeyen tool_id=${step.tool_id}`); errors++;
  } else if (deprecated.has(step.tool_id)) {
    console.warn(`  ⚠️  [${stack}] step ${step.order}: deprecated araç (id=${step.tool_id})`);
  }
}

if (errors === 0) {
  console.log(`  ✅ [${stack}] — Node ${process.version} uyumluluk smoke geçti (${workflow.steps?.length ?? 0} adım).`);
  process.exit(0);
} else {
  console.error(`  ❌ [${stack}] — ${errors} hata.`); process.exit(1);
}
