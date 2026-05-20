import type { Tool, ToolScores } from './schemas.js';

/**
 * v4 — Tool Scoring & Recommendation Engine
 *
 * Pure functions. Given a tool and a set of project constraints, returns a
 * weighted 0..100 score and a human-readable rationale. Used by:
 *   - mcp-server `recommend_tools` tool
 *   - ai-workflow-generator (selection rationale)
 *   - cli `aifs doctor`
 */

export interface ProjectConstraints {
  /** 'next', 'remix', 'vite', etc. — influences SSR / RSC weighting. */
  framework?: string;
  /** If user explicitly cares about bundle size. */
  prioritize_bundle?: boolean;
  /** If user explicitly cares about easy onboarding. */
  prioritize_learning_curve?: boolean;
  /** Filter out lifecycles below this severity. Default: deprecates legacy + deprecated. */
  min_lifecycle?: 'active' | 'maintenance';
  /** Required TypeScript-first ecosystem. */
  typescript_strict?: boolean;
}

const DEFAULT_WEIGHTS: Required<Omit<ProjectConstraints, 'framework' | 'min_lifecycle'>> & {
  ssr: number; rsc: number; bundle: number; ts: number; maint: number; learn: number; comm: number;
} = {
  prioritize_bundle: false,
  prioritize_learning_curve: false,
  typescript_strict: false,
  ssr: 0.15, rsc: 0.10, bundle: 0.15, ts: 0.10, maint: 0.20, learn: 0.10, comm: 0.20,
};

const PRIORITY_BONUS: Record<Tool['priority'], number> = {
  critical: 8, high: 5, medium: 2, low: 0,
};

export interface ScoreBreakdown {
  total: number;          // 0..100
  components: Record<keyof ToolScores | 'priority', number>;
  reasons: string[];      // human-readable bullets, used as "selection rationale"
}

export function scoreTool(tool: Tool, constraints: ProjectConstraints = {}): ScoreBreakdown {
  const w = { ...DEFAULT_WEIGHTS };

  // Rebalance weights based on constraints
  if (constraints.prioritize_bundle) { w.bundle = 0.30; w.comm = 0.10; }
  if (constraints.prioritize_learning_curve) { w.learn = 0.25; w.comm = 0.10; }
  if (constraints.typescript_strict) { w.ts = 0.20; w.comm = 0.10; }
  if (constraints.framework?.toLowerCase().includes('next')) { w.rsc = 0.18; w.ssr = 0.18; }

  const s = tool.scores ?? {};
  const get = (k: keyof ToolScores, fallback = 5) => s[k] ?? fallback;

  const components: ScoreBreakdown['components'] = {
    ssr_compat:     get('ssr_compat')     * w.ssr,
    rsc_compat:     get('rsc_compat')     * w.rsc,
    bundle_cost:    get('bundle_cost')    * w.bundle,
    typescript:     get('typescript')     * w.ts,
    maintenance:    get('maintenance')    * w.maint,
    learning_curve: get('learning_curve') * w.learn,
    community:      get('community')      * w.comm,
    priority:       PRIORITY_BONUS[tool.priority],
  };

  // Each component is on a 0..10 axis * weight summing to 1.0 → ~0..10, then *10 → 0..100
  const base = (Object.values(components).slice(0, 7) as number[]).reduce((a, b) => a + b, 0) * 10;
  const total = Math.min(100, Math.max(0, Math.round(base + components.priority)));

  const reasons: string[] = [];
  if ((tool.lifecycle ?? 'active') === 'deprecated') reasons.push(`⚠ Deprecated — bakım dışı, kullanmayın.`);
  if (tool.lifecycle === 'legacy') reasons.push(`⚠ Legacy — modern alternatif tercih edilebilir.`);
  if (get('maintenance', 5) >= 8) reasons.push(`Aktif bakım skoru yüksek (${get('maintenance')}/10).`);
  if (get('bundle_cost', 5) >= 8) reasons.push(`Bundle maliyeti düşük (~${tool.bundle_kb_gzip ?? '?'}KB gzip).`);
  if (constraints.framework?.toLowerCase().includes('next') && get('rsc_compat', 5) >= 8)
    reasons.push(`Next.js RSC ile uyumlu (${get('rsc_compat')}/10).`);
  if (constraints.prioritize_bundle && get('bundle_cost', 5) < 5)
    reasons.push(`Uyarı: kullanıcı bundle hassasiyetini seçti, bu araç ağır (${get('bundle_cost')}/10).`);
  if (constraints.typescript_strict && get('typescript', 5) >= 8)
    reasons.push(`Birinci sınıf TypeScript desteği.`);
  if (tool.priority === 'critical') reasons.push(`Kritik öncelikli araç (öncelik bonusu +${PRIORITY_BONUS.critical}).`);

  return { total, components, reasons };
}

/** Filter out tools the constraints say we shouldn't recommend. */
export function eligible(tool: Tool, constraints: ProjectConstraints = {}): boolean {
  const lc = tool.lifecycle ?? 'active';
  const min = constraints.min_lifecycle ?? 'maintenance';
  if (lc === 'deprecated') return false;
  if (min === 'active' && lc !== 'active') return false;
  return true;
}

export interface Recommendation extends ScoreBreakdown {
  tool: Tool;
}

export function recommendTools(
  index: Tool[],
  opts: { category?: string; tag?: string; limit?: number; constraints?: ProjectConstraints } = {}
): Recommendation[] {
  const { category, tag, limit = 5, constraints = {} } = opts;
  return index
    .filter((t) => (!category || t.category === category))
    .filter((t) => (!tag || (t.tags ?? []).includes(tag)))
    .filter((t) => eligible(t, constraints))
    .map((t) => ({ tool: t, ...scoreTool(t, constraints) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}
