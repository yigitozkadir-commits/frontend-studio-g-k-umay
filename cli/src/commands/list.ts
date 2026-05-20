// ============================================================
// CLI — list, budget, deps komutları
// ============================================================

import chalk from "chalk";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");

function loadJSON(path: string) {
  const full = join(REPO_ROOT, path);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

// ---- LIST ----
export async function listCommand(options: {
  workflows?: boolean;
  categories?: boolean;
  tools?: string;
}) {
  const index: any[] = loadJSON("orchestration/index.json") ?? [];
  const categories: any[] = loadJSON("orchestration/categories.json") ?? [];

  if (options.workflows || (!options.categories && !options.tools)) {
    console.log();
    console.log(chalk.cyan("📋 Mevcut Workflow'lar"));
    console.log();
    const wfDir = join(REPO_ROOT, "orchestration/workflows");
    const files = readdirSync(wfDir).filter((f) => f.endsWith(".json"));
    files.forEach((f) => {
      const wf = loadJSON(`orchestration/workflows/${f}`);
      if (!wf) return;
      console.log(
        chalk.white(`  ${wf.workflow.padEnd(20)}`),
        chalk.gray(`${wf.steps.length} adım`),
        chalk.gray(`~${wf.estimated_time ?? "?"}`)
      );
      console.log(chalk.gray(`    ${wf.description}`));
      console.log();
    });
  }

  if (options.categories) {
    console.log();
    console.log(chalk.cyan("📂 Kategoriler"));
    console.log();
    categories.forEach((cat) => {
      console.log(
        chalk.white(`  ${cat.slug.padEnd(25)}`),
        chalk.gray(`${cat.tool_count} araç`),
        chalk.gray(`— ${cat.name}`)
      );
    });
    console.log();
  }

  if (options.tools) {
    const cat = categories.find(
      (c) => c.slug === options.tools || c.name.toLowerCase().includes(options.tools!.toLowerCase())
    );
    if (!cat) {
      console.error(chalk.red(`❌ "${options.tools}" kategorisi bulunamadı.`));
      return;
    }
    const tools = index.filter((t) => t.category === cat.slug);
    console.log();
    console.log(chalk.cyan(`🔧 ${cat.name}`));
    console.log();
    tools.forEach((t) => {
      const priority =
        t.priority === "high" ? chalk.green("high")
        : t.priority === "medium" ? chalk.yellow("med ")
        : chalk.gray("low ");
      console.log(
        chalk.gray(`  [${String(t.id).padStart(3)}]`),
        priority,
        chalk.white(t.name.padEnd(35)),
        t.install_command ? chalk.gray(t.install_command.replace("npm install ", "")) : ""
      );
    });
    console.log();
  }
}

// ---- BUDGET ----
export async function budgetCommand(workflow: string) {
  const wf = loadJSON(`orchestration/workflows/${workflow}.json`);
  if (!wf) {
    console.error(chalk.red(`❌ "${workflow}" workflow'u bulunamadı.`));
    process.exit(1);
  }

  const index: any[] = loadJSON("orchestration/index.json") ?? [];
  const budget: any = loadJSON("performance/bundle-budget.json") ?? {};
  const packages = budget.packages ?? [];

  const toolIds = [
    ...wf.steps.map((s: any) => s.tool_id),
    ...wf.steps.map((s: any) => s.related_tool_id).filter(Boolean),
  ];

  let total = 0;
  const rows: { name: string; kb: number; ts: boolean; notes: string }[] = [];

  for (const id of [...new Set(toolIds)] as number[]) {
    const pkg = packages.find((p: any) => p.id === id);
    if (!pkg) continue;
    total += pkg.gzip_kb;
    rows.push({ name: pkg.name, kb: pkg.gzip_kb, ts: pkg.treeshakeable, notes: pkg.notes });
  }

  const workflowBudget = budget.budgets?.[workflow];
  const limit = workflowBudget?.target_total_kb ?? 500;

  console.log();
  console.log(chalk.cyan(`📦 Bundle Bütçe Raporu — ${workflow}`));
  console.log();

  rows
    .sort((a, b) => b.kb - a.kb)
    .forEach((r) => {
      const ts = r.ts ? chalk.green("✅") : chalk.yellow("⚠️ ");
      const kb = r.kb === 0 ? chalk.gray("  -  ") : chalk.white(`${String(r.kb).padStart(3)}KB`);
      console.log(`  ${ts} ${kb}  ${chalk.white(r.name.padEnd(30))} ${chalk.gray(r.notes.slice(0, 50))}`);
    });

  console.log();
  console.log("  " + "─".repeat(60));
  const pct = Math.round((total / limit) * 100);
  const totalColor = total <= limit ? chalk.green : chalk.red;
  console.log(`  ${totalColor(`TOPLAM: ${total}KB`)} / ${chalk.gray(`Hedef: ${limit}KB`)} ${chalk.gray(`(${pct}%)`)}`);

  if (total > limit) {
    console.log();
    console.log(chalk.yellow("💡 Optimizasyon önerileri:"));
    (budget.optimization_rules ?? []).forEach((r: any) => {
      console.log(chalk.gray(`  • ${r.rule}`));
      if (r.saving_kb > 0) console.log(chalk.green(`    → ${r.saving_kb}KB tasarruf`));
    });
  } else {
    console.log(chalk.green("  ✅ Bütçe içinde!"));
  }
  console.log();
}

// ---- DEPS ----
export async function depsCommand(workflow: string) {
  const wf = loadJSON(`orchestration/workflows/${workflow}.json`);
  if (!wf) {
    console.error(chalk.red(`❌ "${workflow}" workflow'u bulunamadı.`));
    process.exit(1);
  }

  const index: any[] = loadJSON("orchestration/index.json") ?? [];
  const toolIds = [
    ...wf.steps.map((s: any) => s.tool_id),
    ...wf.steps.map((s: any) => s.related_tool_id).filter(Boolean),
  ];

  const npmPkgs: string[] = [];
  const otherCmds: string[] = [];
  const noCmds: string[] = [];

  for (const id of [...new Set(toolIds)] as number[]) {
    const tool = index.find((t) => t.id === id);
    if (!tool) continue;
    if (!tool.install_command) { noCmds.push(tool.name); continue; }
    if (tool.install_command.startsWith("npm install")) {
      npmPkgs.push(...tool.install_command.replace("npm install ", "").split(" "));
    } else {
      otherCmds.push(tool.install_command);
    }
  }

  console.log();
  console.log(chalk.cyan(`🔗 Bağımlılıklar — ${workflow}`));
  console.log();
  console.log(chalk.white("Tek komutla kur (pnpm):"));
  console.log(chalk.gray(`  pnpm add ${npmPkgs.join(" ")}`));
  console.log();

  if (otherCmds.length) {
    console.log(chalk.white("Diğer kurulum komutları:"));
    otherCmds.forEach((c) => console.log(chalk.gray(`  ${c}`)));
    console.log();
  }

  if (noCmds.length) {
    console.log(chalk.white("Kurulum gerektirmeyen:"));
    noCmds.forEach((n) => console.log(chalk.gray(`  • ${n}`)));
    console.log();
  }

  console.log(chalk.white("Test kontrol listesi:"));
  wf.test_checklist?.forEach((c: string) => console.log(chalk.gray(`  [ ] ${c}`)));
  console.log();
}
