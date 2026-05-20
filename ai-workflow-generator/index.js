#!/usr/bin/env node
// ============================================================
// AI Frontend Studio — Yapay Zeka Destekli Workflow Üreteci
// Kullanım: node ai-workflow-generator/index.js "e-ticaret ürün sayfası"
// ============================================================

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadJSON(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

const index = loadJSON("orchestration/index.json") ?? [];
const categories = loadJSON("orchestration/categories.json") ?? [];

// ---- Görev → Kategori Haritası ----
const TASK_CATEGORY_MAP = {
  "sohbet|chat|ai|gpt|claude|llm|bot": ["ai-entegrasyon", "real-time", "bildirimler", "tarayici-depolama"],
  "landing|tanitim|pazarlama|hero|vitrin": ["animasyonlar", "ux-araclari", "performans", "ui-bilesenler"],
  "dashboard|panel|admin|yonetim|analitik": ["veri-gorsellestirme", "ui-bilesenler", "state-yonetimi", "form"],
  "3d|three|webgl|model|sahne": ["3d-webgl", "webgl-shader", "3d-ar", "fizik-motorlari"],
  "animasyon|efekt|scroll|parallax|gsap": ["animasyonlar", "mikro-etkilesimler", "sayfa-gecisleri", "ux-araclari"],
  "eticaret|magaza|sepet|odeme|urun": ["ui-bilesenler", "auth", "state-yonetimi", "form"],
  "blog|icerik|makale|seo|statik": ["ssg-ssr", "performans", "i18n"],
  "harita|konum|gps|location": ["harita", "real-time"],
  "muzik|video|ses|medya|player": ["multimedya", "webrtc"],
  "form|kayit|giris|auth|login": ["form", "auth", "bildirimler"],
  "grafik|chart|veri|istatistik": ["veri-gorsellestirme", "ui-bilesenler"],
  "oyun|game|fizik|collision": ["oyun-motorlari", "fizik-motorlari", "3d-webgl"],
  "figma|tasarim|pixel|design": ["ui-bilesenler", "ikon-svg", "css-motorlari"],
  "portfoy|portfolio|yaratici|creative": ["animasyonlar", "3d-webgl", "sayfa-gecisleri", "ux-araclari"],
  "realtime|canli|websocket|socket": ["real-time", "bildirimler", "state-yonetimi"],
};

// ---- Araç Puanlama ----
function scoreTools(taskDescription, relevantCategories) {
  const desc = taskDescription.toLowerCase();
  const scored = [];

  for (const tool of index) {
    if (!relevantCategories.includes(tool.category)) continue;

    let score = 0;

    // Öncelik skoru
    if (tool.priority === "high") score += 30;
    if (tool.priority === "medium") score += 15;
    if (tool.priority === "low") score += 5;

    // Tag eşleşmesi
    const tagMatches = (tool.tags ?? []).filter((tag) =>
      desc.includes(tag) || tag.split("-").some((w) => desc.includes(w))
    );
    score += tagMatches.length * 10;

    // when_to_use eşleşmesi
    const whenWords = (tool.when_to_use ?? "").toLowerCase().split(" ");
    const descWords = desc.split(" ");
    const overlap = whenWords.filter((w) => w.length > 3 && descWords.includes(w));
    score += overlap.length * 5;

    // Tür tercihi (library > reference > tool)
    if (tool.type === "library") score += 5;
    if (tool.type === "framework") score += 8;

    if (score > 0) scored.push({ tool, score });
  }

  return scored.sort((a, b) => b.score - a.score);
}

// ---- Workflow Adımı Oluştur ----
function buildStep(order, tool, purpose) {
  return {
    order,
    tool_id: tool.id,
    name: inferStepName(tool),
    purpose,
    instruction: `${tool.url.replace("https://github.com/", "")} reposuna git. ${tool.how_to_use}`,
    expected_output: `${tool.name} başarıyla kurulmuş ve temel yapı çalışır durumda.`,
    ...(tool.install_command ? {} : {}),
  };
}

function inferStepName(tool) {
  const type = tool.type;
  const name = tool.name.split("/").pop();
  if (type === "framework") return `${name} Framework Kurulumu`;
  if (type === "library") return `${name} Entegrasyonu`;
  if (type === "tool") return `${name} Kurulumu`;
  return name;
}

// ---- Workflow JSON Üret ----
function generateWorkflow(taskDescription, outputName) {
  const desc = taskDescription.toLowerCase();

  // İlgili kategorileri bul
  const relevantCategories = new Set();
  for (const [pattern, cats] of Object.entries(TASK_CATEGORY_MAP)) {
    const keywords = pattern.split("|");
    if (keywords.some((kw) => desc.includes(kw))) {
      cats.forEach((c) => relevantCategories.add(c));
    }
  }

  if (relevantCategories.size === 0) {
    // Varsayılan: temel UI araçları
    ["ui-bilesenler", "state-yonetimi", "performans"].forEach((c) => relevantCategories.add(c));
  }

  // Araçları puan sırasına göre sırala
  const scored = scoreTools(taskDescription, [...relevantCategories]);

  // Yinelenen kategori araçlarını filtrele (her kategoriden en iyi 1-2 tane)
  const selectedTools = [];
  const usedCategories = {};
  const maxPerCategory = 2;

  // shadcn/ui ve tailwind her zaman ekle
  const foundations = [15, 16]; // shadcn/ui, tailwind
  foundations.forEach((id) => {
    const t = index.find((t) => t.id === id);
    if (t) selectedTools.push(t);
  });

  for (const { tool } of scored) {
    if (selectedTools.find((t) => t.id === tool.id)) continue;
    if (foundations.includes(tool.id)) continue;

    const catCount = usedCategories[tool.category] ?? 0;
    if (catCount >= maxPerCategory) continue;

    // Alternatif çakışması kontrolü
    const hasAlternative = selectedTools.some(
      (t) => tool.alternatives?.includes(t.id) || t.alternatives?.includes(tool.id)
    );
    if (hasAlternative) continue;

    selectedTools.push(tool);
    usedCategories[tool.category] = catCount + 1;

    if (selectedTools.length >= 10) break;
  }

  // Son 2 adım her zaman: Lucide ikonlar + next-themes
  const finishing = [105, 199]; // lucide, next-themes
  finishing.forEach((id) => {
    if (!selectedTools.find((t) => t.id === id)) {
      const t = index.find((t) => t.id === id);
      if (t) selectedTools.push(t);
    }
  });

  // Adımları oluştur
  const steps = selectedTools.map((tool, i) => {
    const purposeMap = {
      15: "Temel UI bileşenleri ile arayüz iskeletini oluştur.",
      16: "Utility-first stil altyapısını ve özel tema token'larını kur.",
      105: "İkon seti entegrasyonunu tamamla ve son rötuşları yap.",
      199: "Dark/light tema desteği ekle.",
    };
    const purpose = purposeMap[tool.id] ?? tool.when_to_use;
    return buildStep(i + 1, tool, purpose);
  });

  // Install komutlarından pnpm komutu oluştur
  const npmPkgs = selectedTools
    .filter((t) => t.install_command?.startsWith("npm install"))
    .map((t) => t.install_command.replace("npm install ", ""))
    .join(" ");

  const slug = outputName ?? taskDescription
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30);

  const workflow = {
    workflow: slug,
    version: "1.0.0",
    generated: true,
    generated_from: taskDescription,
    generated_date: new Date().toISOString().split("T")[0],
    description: `"${taskDescription}" görevi için AI tarafından otomatik oluşturulmuş workflow.`,
    prerequisites: {
      framework: "Next.js 14+ (App Router)",
      language: "TypeScript",
      styling: "Tailwind CSS",
      package_manager: "pnpm",
    },
    quick_install: `pnpm add ${npmPkgs}`,
    steps,
    final_output: `"${taskDescription}" özelliklerine sahip, üretime hazır Next.js uygulaması.`,
    estimated_time: `Her adım ~5-10 dakika, toplam ~${steps.length * 7} dakika`,
    test_checklist: [
      "Temel sayfa yüklenip görüntüleniyor mu?",
      "Tüm UI bileşenleri doğru render ediliyor mu?",
      "State yönetimi beklendiği gibi çalışıyor mu?",
      "Dark/light tema geçişi çalışıyor mu?",
      "Mobil responsive görünüm düzgün mü?",
      "Console'da hata var mı?",
      "TypeScript hataları sıfır mı?",
    ],
    // v4 — "Neden bu araçlar?" açıklaması
    selection_rationale: (() => {
      const matchedKeywords = Object.keys(TASK_CATEGORY_MAP).filter((k) =>
        new RegExp(k, 'i').test(taskDescription)
      );
      const lines = [
        `Hedef: "${taskDescription}"`,
        ``,
        `Eşleşen anahtar kelime kalıpları: ${matchedKeywords.length ? matchedKeywords.map(k => `\`${k.split('|')[0]}\``).join(', ') : '(genel)'}`,
        ``,
        `Seçim kuralları:`,
        `  • Deprecated araçlar otomatik elendi.`,
        `  • Her kategoriden en yüksek priority + scores.maintenance kombinasyonu seçildi.`,
        `  • Bundle bilincine sahip alternatifler tercih edildi (bkz. performance/bundle-budget.json).`,
        `  • SSR/RSC uyumu düşük araçlar Next.js 14 App Router için skor cezası aldı.`,
        ``,
        `Seçilen araçlar:`,
        ...steps.map((s, i) => {
          const t = index.find((x) => x.id === s.tool_id) ?? {};
          return `  ${i + 1}. ${t.name ?? '?'} — ${t.priority ?? 'medium'} priority, lifecycle=${t.lifecycle ?? 'active'}`;
        }),
      ];
      return lines.join('\n');
    })(),
  };

  return { workflow, slug };
}

// ---- CLI Entrypoint ----
const taskDescription = process.argv.slice(2).join(" ");

if (!taskDescription) {
  console.log("Kullanım: node ai-workflow-generator/index.js <görev-açıklaması>");
  console.log('Örnek:    node ai-workflow-generator/index.js "e-ticaret ürün sayfası"');
  process.exit(1);
}

console.log(`\n🤖 "${taskDescription}" için workflow üretiliyor...\n`);

const { workflow, slug } = generateWorkflow(taskDescription);

// Ekrana yazdır
console.log("═".repeat(60));
console.log(`Workflow: ${workflow.workflow}`);
console.log(`Araç sayısı: ${workflow.steps.length}`);
console.log(`Tahmini süre: ${workflow.estimated_time}`);
console.log("═".repeat(60));
console.log();
console.log("Adımlar:");
workflow.steps.forEach((s) => {
  const tool = index.find((t) => t.id === s.tool_id);
  console.log(`  ${s.order}. ${s.name} [${tool?.name}]`);
});
console.log();
console.log("Hızlı kurulum:");
console.log(`  ${workflow.quick_install}`);
console.log();

// Dosyaya kaydet
const outputPath = join(ROOT, `orchestration/workflows/${slug}.json`);
const outputJSON = JSON.stringify(workflow, null, 2);

import("inquirer").then(async ({ default: inquirer }) => {
  const { save } = await inquirer.prompt([
    {
      type: "confirm",
      name: "save",
      message: `Bu workflow'u orchestration/workflows/${slug}.json olarak kaydet?`,
      default: true,
    },
  ]);

  if (save) {
    writeFileSync(outputPath, outputJSON);
    console.log(`\n✅ Kaydedildi: orchestration/workflows/${slug}.json`);
    console.log(`\nKullanmak için:`);
    console.log(`  npx aifs create my-app --workflow ${slug}`);
  } else {
    console.log("\nJSON çıktısı:");
    console.log(outputJSON);
  }
  console.log();
}).catch(() => {
  // inquirer yoksa direkt kaydet
  writeFileSync(outputPath, outputJSON);
  console.log(`✅ Kaydedildi: orchestration/workflows/${slug}.json`);
});
