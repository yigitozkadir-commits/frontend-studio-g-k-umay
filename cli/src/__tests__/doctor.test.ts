import { doctor } from '../commands/doctor.js';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

function tmpDir() { return mkdtempSync(join(tmpdir(), 'aifs-doctor-')); }

describe('doctor()', () => {
  it('package.json olmayan dizinde hata döner (exit 1)', async () => {
    const dir = tmpDir();
    const code = await doctor(dir);
    expect(code).toBe(1);
    rmSync(dir, { recursive: true });
  });

  it('geçerli package.json olan dizinde başarı döner (exit 0)', async () => {
    const dir = tmpDir();
    writeFileSync(join(dir, 'package.json'), JSON.stringify({
      name: 'test-app',
      scripts: { dev: 'next dev', build: 'next build', test: 'jest' },
    }));
    const code = await doctor(dir);
    expect(code).toBe(0);
    rmSync(dir, { recursive: true });
  });

  it('.env.example varlığı uyarı durumunu ortadan kaldırır', async () => {
    const dir = tmpDir();
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'test', scripts: { dev: 'x', build: 'x', test: 'x' } }));
    writeFileSync(join(dir, '.env.example'), 'KEY=value\n');
    const code = await doctor(dir);
    expect(code).toBe(0);
    rmSync(dir, { recursive: true });
  });

  it('çakışan lock-file (npm + pnpm) olduğunda hata döner', async () => {
    const dir = tmpDir();
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'test', scripts: { dev: 'x', build: 'x', test: 'x' } }));
    writeFileSync(join(dir, 'package-lock.json'), '{}');
    writeFileSync(join(dir, 'pnpm-lock.yaml'), '');
    const code = await doctor(dir);
    expect(code).toBe(1);
    rmSync(dir, { recursive: true });
  });

  it('eksik dev/build/test scriptleri uyarı verir ama hata değil', async () => {
    const dir = tmpDir();
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'test', scripts: {} }));
    const code = await doctor(dir);
    expect(code).toBe(0);
    rmSync(dir, { recursive: true });
  });
});
