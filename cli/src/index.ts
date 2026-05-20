#!/usr/bin/env node
// ============================================================
// AI Frontend Studio CLI — v4
// Kullanım: npx aifs create <proje-adi> --workflow ai-chat
// ============================================================

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create.js';
import { listCommand, budgetCommand, depsCommand } from './commands/list.js';
import { doctor } from './commands/doctor.js';
import { audit } from './commands/audit.js';

const program = new Command();

program
  .name('aifs')
  .description(chalk.cyan('🧠 AI Frontend Studio CLI — v4'))
  .version('2.0.0'); // paket sürümü (Changesets ile yönetilir)

program
  .command('create <proje-adi>')
  .description('Yeni bir proje oluşturur')
  .option('-w, --workflow <workflow>', 'Kullanılacak workflow')
  .option('-p, --package-manager <pm>', 'Paket yöneticisi (pnpm, npm, yarn, bun)', 'pnpm')
  .option('--strict', 'Strict mode: sadece pnpm + önerilen stack', false)
  .option('--persona <persona>', 'Persona seç (solo, agency, claude-code, prototyper, enterprise)')
  .option('--skip-install', 'Paket kurulumunu atla')
  .option('--skip-git', 'Git başlatmayı atla')
  .action(createCommand);

program
  .command('list')
  .description("Mevcut workflow'ları ve araçları listeler")
  .option('-w, --workflows', "Workflow'ları listele")
  .option('-c, --categories', 'Kategorileri listele')
  .option('-t, --tools <kategori>', 'Belirli kategorideki araçları listele')
  .action(listCommand);

program
  .command('budget <workflow>')
  .description('Bir workflow için bundle bütçesini hesaplar')
  .action(budgetCommand);

program
  .command('deps <workflow>')
  .description('Bir workflow için bağımlılıkları gösterir')
  .option('-p, --pm <pm>', 'Paket yöneticisi (pnpm, npm, yarn, bun)')
  .action(depsCommand);

// v4 — yeni komutlar
program
  .command('doctor')
  .description('Proje sağlık taraması — Node, paket yöneticisi, env, lock çakışmaları, scripts')
  .option('--cwd <path>', 'Taranacak dizin', process.cwd())
  .action(async (opts) => {
    const code = await doctor(opts.cwd);
    process.exit(code);
  });

program
  .command('audit')
  .description('Workflow ve metadata bütünlüğünü denetler (deprecated, çakışan paket, eksik tool_id)')
  .option('--workflow <name>', 'Sadece bir workflow için')
  .action(async (opts) => {
    const code = await audit(opts.workflow);
    process.exit(code);
  });

program.parse();
