/**
 * `aifs deps <workflow>` — workflow için kurulum komutlarını yazdırır.
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'node:path';
import { findMetaRoot } from '../lib/repo.js';

interface Options { pm?: 'pnpm' | 'npm' | 'yarn'; }

export async function depsCommand(workflow: string, options: Options = {}) {
  const root = findMetaRoot();
  if (!root) { console.error(chalk.red('Meta repo bulunamadı.')); process.exit(1); }
  const wfPath = path.join(root, 'orchestration/workflows', `${workflow}.json`);
  if (!fs.existsSync(wfPath)) { console.error(chalk.red(`Workflow yok: ${workflow}`)); process.exit(1); }
  const wf = await fs.readJson(wfPath);
  const index = await fs.readJson(path.join(root, 'orchestration/index.json'));
  const byId = new Map(index.map((t: any) => [t.id, t]));
  const pm = options.pm ?? wf.prerequisites?.package_manager ?? 'pnpm';
  const adds: string[] = [];
  for (const step of wf.steps) {
    const t: any = byId.get(step.tool_id);
    if (!t?.install_command) continue;
    adds.push(t.install_command);
  }
  console.log(chalk.bold(`\n🧩 ${workflow} bağımlılıkları (${pm})\n`));
  for (const cmd of adds) console.log('  ' + cmd.replace(/^pnpm add/, `${pm} add`));
}
