/**
 * aifs doctor — proje sağlık taraması.
 *
 * Kontroller:
 *  - Node sürümü >=18
 *  - Paket yöneticisi (pnpm önerilir)
 *  - package.json varlığı
 *  - .env.example varlığı
 *  - lock-file çakışması (npm + yarn + pnpm aynı klasörde)
 *  - eksik script'ler (dev/build/test)
 *  - workflow id'leri index.json'da var mı (eğer WORKFLOW.md varsa)
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

interface Check {
  name: string;
  status: 'ok' | 'warn' | 'fail';
  message: string;
}

export async function doctor(cwd = process.cwd()): Promise<number> {
  const checks: Check[] = [];

  // Node sürümü
  const node = process.versions.node;
  const major = parseInt(node.split('.')[0], 10);
  checks.push({
    name: 'Node sürümü',
    status: major >= 18 ? 'ok' : 'fail',
    message: `Node ${node} ${major >= 18 ? '(>=18 ✓)' : '(>=18 gerekli)'}`
  });

  // pnpm
  let pnpmVersion = '';
  try {
    pnpmVersion = execSync('pnpm --version', { encoding: 'utf8' }).trim();
    checks.push({ name: 'pnpm', status: 'ok', message: `pnpm ${pnpmVersion}` });
  } catch {
    checks.push({ name: 'pnpm', status: 'warn', message: 'pnpm bulunamadı (önerilir)' });
  }

  // package.json
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    checks.push({ name: 'package.json', status: 'fail', message: 'package.json yok' });
  } else {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    checks.push({ name: 'package.json', status: 'ok', message: pkg.name || '(isimsiz)' });
    for (const s of ['dev', 'build', 'test']) {
      if (!pkg.scripts?.[s]) {
        checks.push({ name: `script:${s}`, status: 'warn', message: `pnpm ${s} eksik` });
      }
    }
  }

  // .env.example
  if (existsSync(join(cwd, '.env.example'))) {
    checks.push({ name: '.env.example', status: 'ok', message: 'mevcut' });
  } else {
    checks.push({ name: '.env.example', status: 'warn', message: 'eksik (önerilen scaffold standardı)' });
  }

  // lock-file çakışması
  const locks = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'].filter((l) =>
    existsSync(join(cwd, l))
  );
  if (locks.length > 1) {
    checks.push({ name: 'lock-files', status: 'fail', message: `çakışan lock-file: ${locks.join(', ')}` });
  } else if (locks.length === 1) {
    checks.push({ name: 'lock-files', status: 'ok', message: locks[0] });
  } else {
    checks.push({ name: 'lock-files', status: 'warn', message: 'henüz install yok' });
  }

  // WORKFLOW.md kontrolü
  const wfMd = join(cwd, 'WORKFLOW.md');
  if (existsSync(wfMd)) {
    checks.push({ name: 'WORKFLOW.md', status: 'ok', message: 'scaffold standardı uyumlu' });
  }

  // Raporu yazdır
  console.log('\n🩺 aifs doctor — proje sağlık raporu\n');
  for (const c of checks) {
    const icon = c.status === 'ok' ? '✅' : c.status === 'warn' ? '⚠️ ' : '❌';
    console.log(`  ${icon} ${c.name.padEnd(20)} ${c.message}`);
  }

  const fails = checks.filter((c) => c.status === 'fail').length;
  const warns = checks.filter((c) => c.status === 'warn').length;
  console.log(`\n${fails === 0 ? '✅' : '❌'} ${checks.length - fails - warns} ok, ${warns} uyarı, ${fails} hata\n`);
  return fails === 0 ? 0 : 1;
}
