#!/usr/bin/env node
// ============================================================
// AI Frontend Studio — İnteraktif Proje Sihirbazı
// Kullanım: node wizard/index.js
// ============================================================

import inquirer from "inquirer";
import chalk from "chalk";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadJSON(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

const index = loadJSON("orchestration/index.json") ?? [];
const categories = loadJSON("orchestration/categories.json") ?? [];
const budget = loadJSON("performance/bundle-budget.json") ?? {};
const matrix = loadJSON("compatibility/version-matrix.json") ?? {};

// ---- Workflow Puanlama Motoru ----
function scoreWorkflows(answers) {
  const scores = {};

  const wfDir = join(ROOT, "orchestration/workflows");
  const files = readdirSync(wfDir).filter((f) => f.endsWith(".json"));

  for (const f of files) {
    const wf = loadJSON(`orchestration/workflows/${f}`);
    if (!wf) continue;
    let score = 0;

    // Amaç eşleştirme
    if (answers.goal === "sohbet" && wf.workflow === "ai-chat") score += 100;
    if (answers.goal === "tanitim" && wf.workflow === "landing-page") score += 100;
    if (answers.goal === "3d" && wf.workflow === "3d-scene") score += 100;
    if (answers.goal === "veri" && wf.workflow === "dashboard") score += 100;
    if (answers.goal === "animasyon" && wf.workflow === "animation") score += 100;
    if (answers.goal === "figma" && wf.workflow === "figma-to-code") score += 100;

    // Özellik eşleştirme
    if (answers.needs3D && ["3d-scene", "landing-page"].includes(wf.workflow)) score += 30;
    if (answers.needsAuth && wf.workflow === "dashboard") score += 20;
    if (answers.needsAnimation) score += 10;
    if (answers.needsAI && wf.workflow === "ai-chat") score += 50;
    if (answers.fromFigma && wf.workflow === "figma-to-code") score += 50;

    // Karmaşıklık tercihi
    if (answers.complexity === "basit" && wf.steps.length <= 7) score += 20;
    if (answers.complexity === "orta" && wf.steps.length <= 9) score += 10;
    if (answers.complexity === "kapsamli") score += 5;

    scores[wf.workflow] = { score, wf };
  }

  return Object.entries(scores)
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([key, { wf, score }]) => ({ key, wf, score }));
}

// ---- Bütçe Özeti ----
function calcBudget(workflow) {
  const wfData = loadJSON(`orchestration/workflows/${workflow}.json`);
  if (!wfData) return null;

  const toolIds = [
    ...wfData.steps.map((s) => s.tool_id),
    ...wfData.steps.map((s) => s.related_tool_id).filter(Boolean),
  ];

  const packages = budget.packages ?? [];
  let total = 0;
  for (const id of [...new Set(toolIds)]) {
    const pkg = packages.find((p) => p.id === id);
    if (pkg) total += pkg.gzip_kb;
  }

  const limit = budget.budgets?.[workflow]?.target_total_kb ?? 500;
  return { total, limit, ok: total <= limit };
}

// ---- Ana Sihirbaz ----
async function runWizard() {
  console.clear();
  console.log(chalk.cyan("╔══════════════════════════════════════╗"));
  console.log(chalk.cyan("║  🧠 AI Frontend Studio Sihirbazı     ║"));
  console.log(chalk.cyan("╚══════════════════════════════════════╝"));
  console.log();

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "goal",
      message: "Ne yapmak istiyorsun?",
      choices: [
        { name: "💬 AI sohbet / chatbot arayüzü", value: "sohbet" },
        { name: "🚀 Landing page / tanıtım sitesi", value: "tanitim" },
        { name: "📊 Admin dashboard / veri paneli", value: "veri" },
        { name: "🎬 Animasyonlu / yaratıcı sayfa", value: "animasyon" },
        { name: "🧊 3D ürün görselleştirme", value: "3d" },
        { name: "🎨 Figma tasarımını koda dönüştür", value: "figma" },
      ],
    },
    {
      type: "checkbox",
      name: "features",
      message: "Hangi özellikler gerekiyor? (birden fazla seçebilirsin)",
      choices: [
        { name: "🤖 AI / LLM entegrasyonu", value: "ai" },
        { name: "🧊 3D elementler", value: "3d" },
        { name: "🔐 Kimlik doğrulama (auth)", value: "auth" },
        { name: "✨ Animasyonlar", value: "animation" },
        { name: "📱 Mobil öncelikli", value: "mobile" },
        { name: "🌙 Dark mode", value: "darkmode" },
        { name: "🗺️ Harita", value: "map" },
        { name: "📈 Grafikler / veri görselleştirme", value: "charts" },
      ],
    },
    {
      type: "list",
      name: "complexity",
      message: "Proje kapsamı?",
      choices: [
        { name: "⚡ Basit — Hızlı prototip, minimum araç", value: "basit" },
        { name: "🎯 Orta — Dengeli özellik seti", value: "orta" },
        { name: "🏗️ Kapsamlı — Tam özellikli, production-ready", value: "kapsamli" },
      ],
    },
    {
      type: "list",
      name: "timeline",
      message: "Ne kadar zamanın var?",
      choices: [
        { name: "⚡ Bugün bitirmem lazım (~2 saat)", value: "kisa" },
        { name: "📅 Birkaç gün", value: "orta" },
        { name: "🗓️ Haftalar sürebilir", value: "uzun" },
      ],
    },
  ]);

  // Features'ı düzleştir
  answers.needsAI = answers.features.includes("ai");
  answers.needs3D = answers.features.includes("3d");
  answers.needsAuth = answers.features.includes("auth");
  answers.needsAnimation = answers.features.includes("animation");
  answers.fromFigma = answers.goal === "figma";

  // ---- Workflow Öner ----
  const ranked = scoreWorkflows(answers);
  const top = ranked[0];
  const second = ranked[1];

  console.log();
  console.log(chalk.cyan("══════════════════════════════════════"));
  console.log(chalk.white(" 🎯 Öneri:"));
  console.log(chalk.cyan("══════════════════════════════════════"));
  console.log();
  console.log(chalk.green(`  ✅ ${top.wf.workflow.toUpperCase()}`));
  console.log(chalk.gray(`     ${top.wf.description}`));
  console.log(chalk.gray(`     ${top.wf.steps.length} adım | ${top.wf.estimated_time ?? "?"}`));

  const b = calcBudget(top.key);
  if (b) {
    const bStatus = b.ok ? chalk.green(`~${b.total}KB ✅`) : chalk.yellow(`~${b.total}KB ⚠️`);
    console.log(chalk.gray(`     Bundle: ${bStatus}`));
  }

  if (second && second.score > 0) {
    console.log();
    console.log(chalk.gray(`  💡 Alternatif: ${second.wf.workflow} (${second.wf.steps.length} adım)`));
  }

  console.log();

  // Versiyon stack'i
  const stackMatch = matrix.stacks?.find((s) =>
    s.workflow === top.key || s.name.toLowerCase().includes(top.key.replace("-", " "))
  );
  if (stackMatch) {
    console.log(chalk.cyan(" 📦 Test Edilmiş Versiyon Stack:"));
    const pkgs = Object.entries(stackMatch.packages).slice(0, 5);
    pkgs.forEach(([k, v]) => console.log(chalk.gray(`   ${k}: ${v}`)));
    if (Object.keys(stackMatch.packages).length > 5) {
      console.log(chalk.gray(`   ... ve ${Object.keys(stackMatch.packages).length - 5} paket daha`));
    }
    console.log();
  }

  // ---- Sonraki Adım ----
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Ne yapmak istiyorsun?",
      choices: [
        { name: `🚀 "${top.key}" ile proje oluştur`, value: "create" },
        { name: "📋 Adımları göster ve çık", value: "show" },
        { name: "🔄 Farklı workflow seç", value: "other" },
        { name: "❌ Çık", value: "exit" },
      ],
    },
  ]);

  if (action === "create") {
    const { projectName } = await inquirer.prompt([
      { type: "input", name: "projectName", message: "Proje adı:", default: `my-${top.key}-app` },
    ]);
    console.log();
    await execa("node", [join(ROOT, "cli/dist/index.js"), "create", projectName, "--workflow", top.key], {
      stdio: "inherit",
    }).catch(() => {
      // CLI build yoksa komutu göster
      console.log(chalk.yellow("CLI henüz build edilmemiş. Şu komutu çalıştır:"));
      console.log(chalk.cyan(`  npx aifs create ${projectName} --workflow ${top.key}`));
    });
  } else if (action === "show") {
    console.log();
    console.log(chalk.cyan(`📋 ${top.wf.workflow} — Adımlar:`));
    top.wf.steps.forEach((s) => {
      const tool = index.find((t) => t.id === s.tool_id);
      console.log(chalk.gray(`  ${s.order}. ${s.name}`) + chalk.cyan(` [${tool?.name ?? s.tool_id}]`));
      console.log(chalk.gray(`     ${s.purpose}`));
    });
    console.log();
    console.log(chalk.white("CLI ile başlatmak için:"));
    console.log(chalk.cyan(`  npx aifs create my-app --workflow ${top.key}`));
    console.log();
  } else if (action === "other") {
    const { chosen } = await inquirer.prompt([
      {
        type: "list",
        name: "chosen",
        message: "Hangi workflow?",
        choices: ranked.map((r) => ({
          name: `${r.wf.workflow} (${r.wf.steps.length} adım)`,
          value: r.key,
        })),
      },
    ]);
    console.log();
    console.log(chalk.cyan(`CLI komutu:`));
    console.log(chalk.white(`  npx aifs create my-app --workflow ${chosen}`));
    console.log();
  }
}

runWizard().catch(console.error);
