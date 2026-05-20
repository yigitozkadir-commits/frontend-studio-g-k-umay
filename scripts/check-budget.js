#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function load(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) { console.error(`❌ Dosya bulunamadı: ${rel}`); process.exit(1); }
  return JSON.parse(readFileSync(p, 'utf8'));
}

const budget = load('performance/bundle-budget.json');
const index  = load('orchestration/index.json');
const workflowName = process.argv[2];

if (!workflowName) {
  console.log('Kullanım: node scripts/check-budget.js <workflow-adi>'); process.exit(1);
}

const wfFile = `orchestration/workflows/${workflowName}.json`;
if (!existsSync(join(ROOT, wfFile))) {
  console.error(`❌ Workflow bulunamadı: ${workflowName}`); process.exit(1);
}

const workflow       = load(wfFile);
const workflowBudget = budget.budgets[workflowName];
const toolIds        = [...workflow.steps.map(s => s.tool_id), ...workflow.steps.map(s => s.related_tool_id).filter(Boolean)];

console.log(`\n${'='.repeat(60)}\n AI Frontend Studio — Bundle Bütçe Raporu\n Workflow: ${workflowName}\n${'='.repeat(60)}\n`);

let totalKb = 0;
const details = [];

for (const id of [...new Set(toolIds)]) {
  const pkg = budget.packages.find(p => p.id === id);
  const tool = index.find(t => t.id === id);
  if (!pkg || !tool) continue;
  totalKb += pkg.gzip_kb;
  details.push({ name: pkg.name, kb: pkg.gzip_kb, treeshakeable: pkg.treeshakeable, notes: pkg.notes });
}

console.log('Paket'.padEnd(35) + 'KB'.padStart(6) + '  Tree-shake  Notlar');
console.log('-'.repeat(90));
details.sort((a,b) => b.kb - a.kb).forEach(({ name, kb, treeshakeable, notes }) => {
  const ts = treeshakeable ? '✅' : '⚠️ ';
  const kbStr = kb === 0 ? '-' : `${kb}KB`;
  const shortNotes = notes.length > 40 ? notes.slice(0, 37) + '...' : notes;
  console.log(`${name.padEnd(35)}${kbStr.padStart(6)}  ${ts}           ${shortNotes}`);
});
console.log('-'.repeat(90));
console.log(`${'TOPLAM'.padEnd(35)}${`${totalKb}KB`.padStart(6)}`);

if (workflowBudget) {
  const limit  = workflowBudget.target_total_kb;
  const pct    = Math.round((totalKb / limit) * 100);
  const status = totalKb <= limit ? '✅ BÜTÇE İÇİNDE' : '❌ BÜTÇE AŞILDI';
  console.log(`\nToplam: ${totalKb} KB | Hedef: ${limit} KB (${pct}%)\n${status}\n`);
  if (totalKb > limit) {
    console.log('💡 Önerilen Optimizasyonlar:');
    (budget.optimization_rules ?? []).forEach(r => {
      console.log(`  • ${r.rule} → ${r.saving_kb > 0 ? `-${r.saving_kb}KB` : r.reason}`);
    });
  }
} else {
  console.log(`\n⚠️  Bu workflow için bütçe hedefi tanımlı değil. performance/bundle-budget.json'a "${workflowName}" ekle.\n`);
}

process.exit(totalKb > (workflowBudget?.target_total_kb ?? Infinity) ? 1 : 0);
