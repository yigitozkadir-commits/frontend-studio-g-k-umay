import { findMetaRoot } from '../lib/repo.js';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

describe('findMetaRoot', () => {
  it('returns null when no meta repo above', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aifs-'));
    expect(findMetaRoot(tmp)).toBeNull();
    fs.rmSync(tmp, { recursive: true });
  });
  it('finds the repo when orchestration/index.json exists', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aifs-'));
    fs.mkdirSync(path.join(tmp, 'orchestration'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'orchestration/index.json'), '[]');
    const nested = path.join(tmp, 'a/b/c');
    fs.mkdirSync(nested, { recursive: true });
    expect(findMetaRoot(nested)).toBe(tmp);
    fs.rmSync(tmp, { recursive: true });
  });
});

// --- Ek edge case testler ---
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('findMetaRoot — edge case\'ler', () => {
  it('orchestration/index.json\'ın tam olarak bulunduğu dizini döner', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aifs-root-'));
    fs.mkdirSync(path.join(tmp, 'orchestration'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'orchestration/index.json'), '[]');
    expect(findMetaRoot(tmp)).toBe(tmp);
    fs.rmSync(tmp, { recursive: true });
  });

  it('8 seviye derinlikte bile kökü bulabilmeli', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aifs-deep-'));
    fs.mkdirSync(path.join(tmp, 'orchestration'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'orchestration/index.json'), '[]');
    const deep = path.join(tmp, 'a/b/c/d/e/f/g');
    fs.mkdirSync(deep, { recursive: true });
    expect(findMetaRoot(deep)).toBe(tmp);
    fs.rmSync(tmp, { recursive: true });
  });

  it('9 seviye derinlikte null döner (arama sınırı aşılır)', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aifs-tooDeep-'));
    fs.mkdirSync(path.join(tmp, 'orchestration'), { recursive: true });
    fs.writeFileSync(path.join(tmp, 'orchestration/index.json'), '[]');
    const tooDeep = path.join(tmp, 'a/b/c/d/e/f/g/h/i');
    fs.mkdirSync(tooDeep, { recursive: true });
    expect(findMetaRoot(tooDeep)).toBeNull();
    fs.rmSync(tmp, { recursive: true });
  });
});
