import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..', '..');

function load(rel: string) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) throw new Error(`Dosya yok: ${rel}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

function loadText(rel: string): string | null {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

let index: any[], workflows: Record<string, any>, budget: any, matrix: any, deprecations: any;

beforeAll(() => {
  index        = load('orchestration/index.json');
  budget       = load('performance/bundle-budget.json');
  matrix       = load('compatibility/version-matrix.json');
  deprecations = load('orchestration/deprecations.json');

  const wfDir = join(ROOT, 'orchestration/workflows');
  workflows = {};
  for (const f of readdirSync(wfDir).filter(f => f.endsWith('.json'))) {
    workflows[f.replace('.json', '')] = load(`orchestration/workflows/${f}`);
  }
});

describe('Scoring: priority bonus sıralaması', () => {
  const PRIORITY_BONUS: Record<string, number> = { critical: 8, high: 5, medium: 2, low: 0 };
  it('critical > high > medium > low', () => {
    expect(PRIORITY_BONUS.critical).toBeGreaterThan(PRIORITY_BONUS.high);
    expect(PRIORITY_BONUS.high).toBeGreaterThan(PRIORITY_BONUS.medium);
    expect(PRIORITY_BONUS.medium).toBeGreaterThan(PRIORITY_BONUS.low);
  });
  it('low priority bonus sıfır olmalı', () => { expect(PRIORITY_BONUS.low).toBe(0); });
});

describe('Workflow varlık ve bütünlük', () => {
  it('en az 12 workflow JSON mevcut olmalı', () => {
    expect(Object.keys(workflows).length).toBeGreaterThanOrEqual(12);
  });
  it('her workflow zorunlu alanları içermeli', () => {
    for (const [, wf] of Object.entries(workflows)) {
      expect((wf as any).workflow).toBeTruthy();
      expect((wf as any).version).toMatch(/^\d+\.\d+\.\d+/);
      expect(Array.isArray((wf as any).steps)).toBe(true);
      expect((wf as any).steps.length).toBeGreaterThan(0);
      expect((wf as any).description).toBeTruthy();
    }
  });
  it('workflow.workflow alanı dosya adıyla eşleşmeli', () => {
    for (const [name, wf] of Object.entries(workflows)) {
      expect((wf as any).workflow).toBe(name);
    }
  });
  it('workflow adları slug formatında olmalı', () => {
    for (const name of Object.keys(workflows)) {
      expect(name).toMatch(/^[a-z0-9-]+$/);
    }
  });
});

describe('Index: araç format kontrolleri', () => {
  it('index 200+ araç içermeli', () => { expect(index.length).toBeGreaterThanOrEqual(200); });
  it('her aracın zorunlu alanları olmalı', () => {
    for (const tool of index) {
      expect(typeof tool.id).toBe('number');
      expect(tool.name).toBeTruthy();
      expect(tool.url).toMatch(/^https?:\/\//);
      expect(['library','framework','tool','reference','template','service','spec']).toContain(tool.type);
      expect(['critical','high','medium','low']).toContain(tool.priority);
    }
  });
  it('id değerleri benzersiz olmalı', () => {
    const ids = index.map((t: any) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('lifecycle değerleri geçerli enum olmalı', () => {
    const valid = new Set(['active','maintenance','legacy','deprecated']);
    for (const tool of index) {
      if (tool.lifecycle) expect(valid.has(tool.lifecycle)).toBe(true);
    }
  });
  it('alternatives referansları index\'te var olmalı', () => {
    const idSet = new Set(index.map((t: any) => t.id));
    for (const tool of index) {
      for (const altId of tool.alternatives ?? []) {
        expect(idSet.has(altId)).toBe(true);
      }
    }
  });
});

describe('validate_workflow mantığı', () => {
  let idSet: Set<number>, deprecatedIds: Set<number>;
  beforeAll(() => {
    idSet = new Set(index.map((t: any) => t.id));
    deprecatedIds = new Set(index.filter((t: any) => t.lifecycle === 'deprecated').map((t: any) => t.id));
  });
  it('tüm step tool_id\'leri index\'te var olmalı', () => {
    const errors: string[] = [];
    for (const [name, wf] of Object.entries(workflows)) {
      for (const step of (wf as any).steps ?? []) {
        if (!idSet.has(step.tool_id)) errors.push(`${name} step ${step.order}: tool_id=${step.tool_id} yok`);
      }
    }
    expect(errors).toHaveLength(0);
  });
  it('hiçbir workflow deprecated araç kullanmamalı', () => {
    const warnings: string[] = [];
    for (const [name, wf] of Object.entries(workflows)) {
      for (const step of (wf as any).steps ?? []) {
        if (deprecatedIds.has(step.tool_id)) warnings.push(`${name} step ${step.order}: deprecated tool_id=${step.tool_id}`);
      }
    }
    expect(warnings).toHaveLength(0);
  });
});

describe('check_budget mantığı', () => {
  it('her workflow için bundle hedefi tanımlı olmalı', () => {
    const missing = Object.keys(workflows).filter(n => !budget.budgets?.[n]);
    expect(missing).toHaveLength(0);
  });
  it('budget package id\'leri index\'te olmalı', () => {
    const idSet = new Set(index.map((t: any) => t.id));
    const missing = (budget.packages ?? []).filter((p: any) => !idSet.has(p.id)).map((p: any) => p.id);
    expect(missing).toHaveLength(0);
  });
  it('hedef KB değerleri pozitif olmalı', () => {
    for (const [, b] of Object.entries(budget.budgets ?? {}) as any) {
      expect(b.target_total_kb).toBeGreaterThan(0);
    }
  });
});

describe('get_compatibility', () => {
  it('matrix en az 5 stack içermeli', () => { expect((matrix.stacks ?? []).length).toBeGreaterThanOrEqual(5); });
  it('her stack name, status, packages alanlarına sahip olmalı', () => {
    for (const stack of matrix.stacks ?? []) {
      expect(stack.name).toBeTruthy();
      expect(stack.status).toBeTruthy();
      expect(typeof stack.packages).toBe('object');
    }
  });
  it('incompatible_pairs recommended alanına sahip olmalı', () => {
    for (const pair of matrix.incompatible_pairs ?? []) {
      expect(pair.recommended).toBeTruthy();
    }
  });
});

describe('deprecations.json bütünlüğü', () => {
  it('replacement_id geçerli index id\'si olmalı', () => {
    const idSet = new Set(index.map((t: any) => t.id));
    for (const item of deprecations.flagged ?? []) {
      if (item.replacement_id !== null) expect(idSet.has(item.replacement_id)).toBe(true);
    }
  });
  it('severity değerleri low/medium/high olmalı', () => {
    const valid = new Set(['low','medium','high']);
    for (const item of deprecations.flagged ?? []) expect(valid.has(item.severity)).toBe(true);
  });
});

describe('snippet dosyaları varlık kontrolü', () => {
  const snippetMap: Record<string, string> = {
    'gsap': 'snippets/gsap.ts',
    'framer-motion': 'snippets/framer-motion.tsx',
    'lenis': 'snippets/lenis.tsx',
    'react-three-fiber': 'snippets/react-three-fiber.tsx',
    'state-management': 'snippets/state-management.tsx',
  };
  for (const [name, path] of Object.entries(snippetMap)) {
    it(`${name} snippet okunabilir ve boş değil`, () => {
      const content = loadText(path);
      expect(content).not.toBeNull();
      expect(content!.length).toBeGreaterThan(50);
    });
  }
});

describe('component dosyaları varlık kontrolü', () => {
  const componentMap: Record<string, string> = {
    'hero-section': 'components/hero-section.tsx',
    'pricing-table': 'components/pricing-table.tsx',
    'testimonial-grid': 'components/testimonial-grid.tsx',
    'dashboard-sidebar': 'components/dashboard-sidebar.tsx',
    'navbar': 'components/navbar.tsx',
    'footer': 'components/footer.tsx',
    'modal': 'components/modal.tsx',
    'stats-grid': 'components/stats-grid.tsx',
    'file-uploader': 'components/file-uploader.tsx',
  };
  for (const [name, path] of Object.entries(componentMap)) {
    it(`${name} component mevcut ve boş değil`, () => {
      const content = loadText(path);
      expect(content).not.toBeNull();
      expect(content!.length).toBeGreaterThan(50);
    });
  }
});
