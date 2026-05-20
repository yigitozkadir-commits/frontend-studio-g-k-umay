import fs from 'node:fs';
import path from 'node:path';

/** Walk up from cwd to find the meta repo root (has orchestration/index.json). */
export function findMetaRoot(start: string = process.cwd()): string | null {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, 'orchestration/index.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return null;
}
