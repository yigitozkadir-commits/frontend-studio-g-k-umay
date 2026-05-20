#!/usr/bin/env node
// ============================================================
// AI Frontend Studio — Versiyon Güncelleme Takipçisi
// Kullanım: node scripts/check-versions.js
// ============================================================

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadJSON(path) {
  const full = join(ROOT, path);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, "utf8"));
}

const matrix = loadJSON("compatibility/version-matrix.json");
if (!matrix) {
  console.error("version-matrix.json bulunamadı");
  process.exit(1);
}

// npm registry'den son versiyonu çek
async function getLatestVersion(packageName) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.version;
  } catch {
    return null;
  }
}

// Versiyon tipi belirle (major/minor/patch)
function getChangeType(current, latest) {
  const c = current.replace(/[^0-9.]/g, "").split(".").map(Number);
  const l = latest.split(".").map(Number);
  if (l[0] > c[0]) return "🔴 MAJOR";
  if (l[1] > c[1]) return "🟡 minor";
  if (l[2] > (c[2] ?? 0)) return "🟢 patch";
  return "✅ güncel";
}

async function main() {
  console.log("\n🔍 AI Frontend Studio — Versiyon Kontrolü");
  console.log("═".repeat(50));
  console.log();

  const updates = [];
  const stacks = matrix.stacks ?? [];

  // Tüm stack'lerdeki paketleri topla (benzersiz)
  const allPackages = new Map();
  for (const stack of stacks) {
    for (const [pkg, version] of Object.entries(stack.packages)) {
      if (!allPackages.has(pkg)) {
        allPackages.set(pkg, { version, stacks: [] });
      }
      allPackages.get(pkg).stacks.push(stack.name);
    }
  }

  console.log(`${allPackages.size} paket kontrol ediliyor...\n`);

  let checked = 0;
  for (const [pkg, info] of allPackages) {
    const latest = await getLatestVersion(pkg);
    if (!latest) continue;

    const current = info.version.replace(/[^0-9.x]/g, "").replace(/x/g, "0");
    const changeType = getChangeType(current, latest);

    process.stdout.write(`  ${pkg.padEnd(35)} ${current.padEnd(12)} → ${latest.padEnd(12)} ${changeType}\n`);

    if (!changeType.includes("güncel")) {
      updates.push({
        package: pkg,
        current: info.version,
        latest,
        type: changeType,
        stacks: info.stacks,
      });
    }

    checked++;

    // Rate limit önlemi
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log("\n" + "═".repeat(50));

  if (updates.length === 0) {
    console.log("✅ Tüm paketler güncel!\n");
  } else {
    console.log(`\n⚠️  ${updates.length} güncelleme mevcut:\n`);

    const major = updates.filter((u) => u.type.includes("MAJOR"));
    const minor = updates.filter((u) => u.type.includes("minor"));
    const patch = updates.filter((u) => u.type.includes("patch"));

    if (major.length) {
      console.log("🔴 MAJOR güncellemeler (breaking change olabilir):");
      major.forEach((u) => {
        console.log(`  ${u.package}: ${u.current} → ${u.latest}`);
        console.log(`  Etkilenen stack'ler: ${u.stacks.join(", ")}`);
      });
      console.log();
    }

    if (minor.length) {
      console.log("🟡 Minor güncellemeler:");
      minor.forEach((u) => console.log(`  ${u.package}: ${u.current} → ${u.latest}`));
      console.log();
    }

    if (patch.length) {
      console.log("🟢 Patch güncellemeler:");
      patch.forEach((u) => console.log(`  ${u.package}: ${u.current} → ${u.latest}`));
      console.log();
    }

    // Raporu kaydet (GitHub Actions için)
    const report = {
      date: new Date().toISOString(),
      checked,
      updates,
      summary: { major: major.length, minor: minor.length, patch: patch.length },
    };
    writeFileSync(join(ROOT, "version-report.json"), JSON.stringify(report, null, 2));
    console.log("📄 Rapor: version-report.json\n");
  }
}

main().catch(console.error);
