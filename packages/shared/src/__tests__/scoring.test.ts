import { scoreTool, recommendTools, eligible } from '../scoring.js';
import type { Tool } from '../schemas.js';

const baseTool: Tool = {
  id: 1, name: 'tool', url: 'https://example.com', category: 'x',
  type: 'library', priority: 'medium', lifecycle: 'active',
  scores: { ssr_compat: 8, rsc_compat: 8, bundle_cost: 8, typescript: 8, maintenance: 8, learning_curve: 8, community: 8 },
};

describe('scoreTool', () => {
  it('returns a 0..100 number', () => {
    const r = scoreTool(baseTool);
    expect(r.total).toBeGreaterThanOrEqual(0);
    expect(r.total).toBeLessThanOrEqual(100);
  });
  it('gives priority bonus to critical tools', () => {
    const high = scoreTool({ ...baseTool, priority: 'critical' });
    const low = scoreTool({ ...baseTool, priority: 'low' });
    expect(high.total).toBeGreaterThan(low.total);
  });
  it('flags deprecated tools in reasons', () => {
    const r = scoreTool({ ...baseTool, lifecycle: 'deprecated' });
    expect(r.reasons.join(' ')).toMatch(/Deprecated/i);
  });
  it('rebalances when prioritize_bundle is set', () => {
    const heavy = { ...baseTool, scores: { ...baseTool.scores, bundle_cost: 2 } };
    const light = { ...baseTool, scores: { ...baseTool.scores, bundle_cost: 10 } };
    const constraints = { prioritize_bundle: true };
    expect(scoreTool(light, constraints).total).toBeGreaterThan(scoreTool(heavy, constraints).total);
  });
});

describe('eligible', () => {
  it('excludes deprecated tools', () => {
    expect(eligible({ ...baseTool, lifecycle: 'deprecated' })).toBe(false);
  });
  it('respects min_lifecycle=active', () => {
    expect(eligible({ ...baseTool, lifecycle: 'legacy' }, { min_lifecycle: 'active' })).toBe(false);
    expect(eligible({ ...baseTool, lifecycle: 'active' }, { min_lifecycle: 'active' })).toBe(true);
  });
});

describe('recommendTools', () => {
  const idx: Tool[] = [
    { ...baseTool, id: 1, category: 'a', priority: 'critical' },
    { ...baseTool, id: 2, category: 'a', priority: 'low' },
    { ...baseTool, id: 3, category: 'b', priority: 'high' },
    { ...baseTool, id: 4, category: 'a', lifecycle: 'deprecated' },
  ];
  it('filters by category and excludes deprecated', () => {
    const r = recommendTools(idx, { category: 'a' });
    expect(r.map((x) => x.tool.id)).toEqual(expect.arrayContaining([1, 2]));
    expect(r.find((x) => x.tool.id === 4)).toBeUndefined();
  });
  it('sorts highest score first', () => {
    const r = recommendTools(idx, { category: 'a' });
    expect(r[0].total).toBeGreaterThanOrEqual(r[r.length - 1].total);
  });
  it('respects limit', () => {
    expect(recommendTools(idx, { limit: 1 })).toHaveLength(1);
  });
});
