// ============================================================
// CLI — create komutu
// aifs create my-app --workflow ai-chat
// ============================================================

import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");

function loadJSON(path: string) {
  const full = join(REPO_ROOT, path);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

const WORKFLOWS = [
  { name: "AI Sohbet Arayüzü", value: "ai-chat" },
  { name: "Landing Page (Awwwards kalite)", value: "landing-page" },
  { name: "3D Ürün Sahnesi", value: "3d-scene" },
  { name: "Admin Dashboard", value: "dashboard" },
  { name: "Yaratıcı Animasyonlu Sayfa", value: "animation" },
  { name: "Figma → Kod", value: "figma-to-code" },
];

export async function createCommand(
  projectName: string,
  options: { workflow?: string; packageManager: string; skipInstall?: boolean; skipGit?: boolean; strict?: boolean; persona?: string }
) {
  // v4 — strict mode zorlaması
  if (options.strict) {
    if (options.packageManager !== 'pnpm') {
      console.error(chalk.red("❌ --strict modu sadece pnpm kabul eder."));
      process.exit(1);
    }
    const major = Number(process.versions.node.split('.')[0]);
    if (major !== 20) {
      console.error(chalk.red(`❌ --strict modu Node 20 gerektirir (şu an ${process.versions.node}).`));
      process.exit(1);
    }
  }
  console.log();
  console.log(chalk.cyan("🧠 AI Frontend Studio") + chalk.gray(" — Proje Oluşturucu"));
  console.log();

  // Workflow seçimi
  let workflow = options.workflow;
  if (!workflow) {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "workflow",
        message: "Hangi workflow'u kullanmak istiyorsun?",
        choices: WORKFLOWS,
      },
    ]);
    workflow = answer.workflow;
  }

  const wfData = loadJSON(`orchestration/workflows/${workflow}.json`);
  if (!wfData) {
    console.error(chalk.red(`❌ "${workflow}" workflow'u bulunamadı.`));
    process.exit(1);
  }

  // Proje klasörü
  const projectDir = join(process.cwd(), projectName);
  if (existsSync(projectDir)) {
    console.error(chalk.red(`❌ "${projectName}" klasörü zaten mevcut.`));
    process.exit(1);
  }

  console.log(chalk.gray(`Workflow: ${chalk.white(wfData.workflow)}`));
  console.log(chalk.gray(`Açıklama: ${wfData.description}`));
  console.log(chalk.gray(`Tahmini süre: ${wfData.estimated_time ?? "?"}`));
  console.log();

  // ---- 1. Next.js projesi oluştur ----
  const spinner = ora("Next.js projesi oluşturuluyor...").start();
  try {
    await execa("npx", [
      "create-next-app@latest",
      projectName,
      "--typescript",
      "--tailwind",
      "--eslint",
      "--app",
      "--src-dir",
      "--import-alias", "@/*",
      "--use-pnpm",
    ], { stdio: "ignore" });
    spinner.succeed(chalk.green("Next.js projesi oluşturuldu"));
  } catch (e) {
    spinner.fail("Next.js projesi oluşturulamadı");
    console.error(e);
    process.exit(1);
  }

  // ---- 2. Bağımlılıkları hesapla ----
  const index: any[] = loadJSON("orchestration/index.json") ?? [];
  const toolIds = [
    ...wfData.steps.map((s: any) => s.tool_id),
    ...wfData.steps.map((s: any) => s.related_tool_id).filter(Boolean),
  ];

  const npmPackages: string[] = [];
  for (const id of [...new Set(toolIds)] as number[]) {
    const tool = index.find((t) => t.id === id);
    if (!tool?.install_command) continue;
    if (tool.install_command.startsWith("npm install")) {
      const pkgs = tool.install_command.replace("npm install ", "").split(" ");
      npmPackages.push(...pkgs);
    }
  }

  // shadcn/ui kurulumu
  const usesShadcn = toolIds.includes(15);

  // ---- 3. Paketleri kur ----
  if (!options.skipInstall && npmPackages.length > 0) {
    const pm = options.packageManager;
    const addCmd = pm === "yarn" ? "add" : "add";
    const installSpinner = ora(`Paketler kuruluyor (${pm})...`).start();
    try {
      await execa(pm, [addCmd, ...npmPackages], {
        cwd: projectDir,
        stdio: "ignore",
      });
      installSpinner.succeed(chalk.green(`${npmPackages.length} paket kuruldu`));
    } catch {
      installSpinner.warn(chalk.yellow("Bazı paketler kurulamadı, manuel kurmanız gerekebilir"));
    }
  }

  // ---- 4. shadcn/ui init ----
  if (usesShadcn && !options.skipInstall) {
    const shadcnSpinner = ora("shadcn/ui başlatılıyor...").start();
    try {
      await execa("npx", ["shadcn-ui@latest", "init", "--yes"], {
        cwd: projectDir,
        stdio: "ignore",
      });
      shadcnSpinner.succeed(chalk.green("shadcn/ui başlatıldı"));
    } catch {
      shadcnSpinner.warn("shadcn/ui manuel kurulumu gerekiyor");
    }
  }

  // ---- 5. Workflow README'si oluştur ----
  const workflowReadme = generateWorkflowReadme(wfData, index);
  writeFileSync(join(projectDir, "WORKFLOW.md"), workflowReadme);

  // ---- 6. .env standartları (v4 — tüm giriş noktaları aynı dosya adlarını üretir) ----
  const envContent = generateEnvTemplate(workflow!);
  writeFileSync(join(projectDir, ".env.example"), envContent);
  writeFileSync(join(projectDir, ".env.local.example"), envContent); // geriye dönük uyumluluk
  writeFileSync(join(projectDir, ".nvmrc"), "20\n");

  // ---- 7. Git ----
  if (!options.skipGit) {
    try {
      await execa("git", ["init"], { cwd: projectDir, stdio: "ignore" });
      await execa("git", ["add", "."], { cwd: projectDir, stdio: "ignore" });
      await execa("git", ["commit", "-m", `feat: init ${workflow} with AI Frontend Studio`], {
        cwd: projectDir, stdio: "ignore"
      });
    } catch { /* git opsiyonel */ }
  }

  // ---- Sonuç ----
  console.log();
  console.log(chalk.green("✅ Proje hazır!"));
  console.log();
  console.log(chalk.white("Sonraki adımlar:"));
  console.log(chalk.gray(`  cd ${projectName}`));
  console.log(chalk.gray(`  cp .env.local.example .env.local`));
  console.log(chalk.gray(`  ${options.packageManager} dev`));
  console.log();
  console.log(chalk.cyan(`📋 WORKFLOW.md dosyasındaki adımları takip et`));
  console.log();

  // Workflow adımlarını göster
  console.log(chalk.white("Workflow Adımları:"));
  wfData.steps.forEach((step: any) => {
    const tool = index.find((t: any) => t.id === step.tool_id);
    console.log(chalk.gray(`  ${step.order}. ${step.name}`) + chalk.cyan(` [${tool?.name ?? step.tool_id}]`));
  });
  console.log();
}

function generateWorkflowReadme(wf: any, index: any[]): string {
  const steps = wf.steps.map((s: any) => {
    const tool = index.find((t) => t.id === s.tool_id);
    return [
      `## Adım ${s.order}: ${s.name}`,
      `**Araç:** [${tool?.name}](${tool?.url}) (id: ${s.tool_id})`,
      `**Amaç:** ${s.purpose}`,
      `**Talimat:** ${s.instruction}`,
      tool?.install_command ? `**Kurulum:** \`${tool.install_command}\`` : "",
      `**Beklenen Çıktı:** ${s.expected_output}`,
      `- [ ] Tamamlandı`,
    ].filter(Boolean).join("\n");
  }).join("\n\n---\n\n");

  const checklist = wf.test_checklist?.map((c: string) => `- [ ] ${c}`).join("\n") ?? "";

  return `# ${wf.workflow} — Workflow Rehberi\n\n${wf.description}\n\n**Tahmini Süre:** ${wf.estimated_time ?? "?"}\n\n---\n\n${steps}\n\n---\n\n## Test Listesi\n\n${checklist}\n\n---\n\n**Nihai Çıktı:** ${wf.final_output}\n`;
}

function generateEnvTemplate(workflow: string): string {
  const envs: Record<string, string[]> = {
    "ai-chat": [
      "# AI Provider",
      "OPENAI_API_KEY=sk-...",
      "# veya",
      "ANTHROPIC_API_KEY=sk-ant-...",
    ],
    "dashboard": [
      "# Database",
      "DATABASE_URL=postgresql://...",
      "# Auth",
      "NEXTAUTH_SECRET=your-secret-here",
      "NEXTAUTH_URL=http://localhost:3000",
    ],
    "landing-page": [
      "# Analytics (opsiyonel)",
      "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX",
    ],
    "figma-to-code": [
      "# Figma API (token export için)",
      "FIGMA_ACCESS_TOKEN=figd_...",
      "FIGMA_FILE_ID=your-file-id",
    ],
  };

  const lines = envs[workflow] ?? ["# Ortam değişkeni gerekmiyor"];
  return `# ${workflow} — Ortam Değişkenleri\n# Bu dosyayı .env.local olarak kopyala\n\n${lines.join("\n")}\n`;
}
