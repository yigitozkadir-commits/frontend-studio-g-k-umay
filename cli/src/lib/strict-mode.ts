/**
 * Strict mode — kurumsal modda yalnızca pnpm + önerilen stack.
 */
import { execSync } from 'node:child_process';

export interface StrictCheckResult {
  ok: boolean;
  reasons: string[];
}

export function checkStrict(): StrictCheckResult {
  const reasons: string[] = [];
  // Node sürümü
  const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
  if (nodeMajor < 18) reasons.push(`Node ${process.versions.node} desteklenmiyor; >=18 gerekli.`);

  // pnpm var mı?
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
  } catch {
    reasons.push('Strict mod pnpm gerektiriyor. https://pnpm.io/installation');
  }

  // npm/yarn lock file projeyle birlikte olmamalı (yeni projede)
  return { ok: reasons.length === 0, reasons };
}

export const STRICT_PACKAGE_MANAGER = 'pnpm';
