/**
 * `aifs budget <workflow>` — bundle bütçe tahmini.
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import { findMetaRoot } from '../lib/repo.js';

export async function budgetCommand(workflow: string) {
  const root = findMetaRoot();
  if (!root) {
    console.error(chalk.red('Meta repo bulunamadı. orchestration/index.json içeren dizine inin.'));
    process.exit(1);
  }
  const wfPath = path.join(root, 'orchestration/workflows', `${workflow}.json`);
  if (!fs.existsSync(wfPath)) {
    console.error(chalk.red(`Workflow yok: ${workflow}`));
    process.exit(1);
  }
  const wf = await fs.readJson(wfPath);
  const budget = await fs.readJson(path.join(root, 'performance/bundle-budget.json'));
  const index = await fs.readJson(path.join(root, 'orchestration/index.json'));
  const byId = new Map(index.map((t: any) => [t.id, t]));
  const pkgByName = new Map(budget.packages.map((p: any) => [p.name, p]));

  let total = 0;
  const rows: Array<{ name: string; kb: number }> = [];
  for (const step of wf.steps) {
    const tool: any = byId.get(step.tool_id);
    if (!tool) continue;
    const short = String(tool.name).split('/').pop();
    const pkg: any = pkgByName.get(short) ?? pkgByName.get(tool.name);
    const kb = pkg?.gzip_kb ?? tool.bundle_kb_gzip ?? 0;
    rows.push({ name: short ?? tool.name, kb });
    total += kb;
  }

  const target = budget.budgets?.[workflow]?.target_total_kb;
  console.log(chalk.bold(`\n📦 ${workflow} bundle tahmini\n`));
  for (const r of rows) console.log(`  ${r.name.padEnd(28)} ${String(r.kb).padStart(5)} KB`);
  console.log(chalk.bold(`\n  TOPLAM (gzip)              ${String(total).padStart(5)} KB`));
  if (target) {
    const ok = total <= target;
    console.log(`  HEDEF                      ${String(target).padStart(5)} KB`);
    console.log(ok ? chalk.green(`  ✅ Bütçe içinde (-${target - total} KB)`) : chalk.red(`  ❌ Bütçe aşımı (+${total - target} KB)`));
    if (!ok) process.exitCode = 1;
  }
}
