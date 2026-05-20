import { WorkflowSchema, ToolSchema, parseOrThrow } from '../schemas.js';

const goodWorkflow = {
  workflow: 'ai-chat',
  version: '1.0.0',
  description: 'AI chat ui workflow that does many cool things.',
  prerequisites: {
    framework: 'Next.js 14+',
    language: 'TypeScript',
    styling: 'Tailwind CSS',
    package_manager: 'pnpm',
  },
  steps: [{ order: 1, tool_id: 15, name: 'UI', purpose: 'base ui', instruction: 'install shadcn-ui', expected_output: 'components installed' }],
  final_output: 'Working chat ui.',
};

describe('WorkflowSchema', () => {
  it('parses a valid workflow', () => {
    expect(() => parseOrThrow(WorkflowSchema, goodWorkflow, 'wf')).not.toThrow();
  });
  it('rejects CamelCase workflow name', () => {
    expect(() => parseOrThrow(WorkflowSchema, { ...goodWorkflow, workflow: 'AiChat' }, 'wf')).toThrow();
  });
  it('rejects when steps array is empty', () => {
    expect(() => parseOrThrow(WorkflowSchema, { ...goodWorkflow, steps: [] }, 'wf')).toThrow();
  });
  it('rejects invalid semver', () => {
    expect(() => parseOrThrow(WorkflowSchema, { ...goodWorkflow, version: 'v1' }, 'wf')).toThrow();
  });
});

describe('ToolSchema', () => {
  it('parses minimal tool', () => {
    const t = ToolSchema.safeParse({
      id: 1, name: 'x', url: 'https://x.dev', category: 'cat', type: 'library', priority: 'high',
    });
    expect(t.success).toBe(true);
  });
  it('rejects invalid score range', () => {
    const t = ToolSchema.safeParse({
      id: 1, name: 'x', url: 'https://x.dev', category: 'cat', type: 'library', priority: 'high',
      scores: { bundle_cost: 99 },
    });
    expect(t.success).toBe(false);
  });
});
