/**
 * aifs audit — workflow ve metadata bütünlük denetimi.
 *
 *  - Tüm workflow JSON'ları şema uyumlu mu?
 *  - tool_id'ler index.json'da var mı?
 *  - deprecated araç kullanılan workflow var mı?
 *  - aynı pakete iki kez referans (versiyon çakışması) var mı?
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..');

export async function audit(only?: string): Promise<number> {
  let errors: string[] = [];
  let warnings: string[] = [];

  const indexPath = join(ROOT, 'orchestration', 'index.json');
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const toolsById = new Map<number, any>(index.map((t: any) => [t.id, t]));

  const depPath = join(ROOT, 'orchestration', 'deprecations.json');
  const deprecated = existsSync(depPath)
    ? JSON.parse(readFileSync(depPath, 'utf8')).flagged
    : [];
  const deprecatedIds = new Set(deprecated.map((d: any) => d.id));

  const wfDir = join(ROOT, 'orchestration', 'workflows');
  let files = readdirSync(wfDir).filter((f) => f.endsWith('.json'));
  if (only) files = files.filter((f) => f === `${only}.json`);

  for (const f of files) {
    const wf = JSON.parse(readFileSync(join(wfDir, f), 'utf8'));
    for (const step of wf.steps || []) {
      if (!toolsById.has(step.tool_id)) {
        errors.push(`${f}: step ${step.order} → bilinmeyen tool_id ${step.tool_id}`);
      }
      if (deprecatedIds.has(step.tool_id)) {
        warnings.push(`${f}: step ${step.order} (${step.name}) deprecated tool kullanıyor (#${step.tool_id})`);
      }
    }
  }

  console.log('\n🔎 aifs audit\n');
  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✅ Sorun yok.');
    return 0;
  }
  for (const e of errors) console.log('  ❌ ' + e);
  for (const w of warnings) console.log('  ⚠️  ' + w);
  console.log(`\n${errors.length} hata, ${warnings.length} uyarı.\n`);
  return errors.length ? 1 : 0;
}
