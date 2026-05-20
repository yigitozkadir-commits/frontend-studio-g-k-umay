import { z } from 'zod';

/**
 * Runtime şema doğrulayıcılar.
 * CI'da `tools/validate-workflows` ve MCP server'da `validate_workflow` tool'u
 * tarafından kullanılır.
 */

export const WorkflowStepSchema = z.object({
  order: z.number().int().positive(),
  tool_id: z.number().int().positive(),
  name: z.string().min(2),
  purpose: z.string().min(5),
  instruction: z.string().min(10),
  expected_output: z.string().min(5),
  selection_rationale: z.string().optional()
});

export const PrerequisitesSchema = z.object({
  framework: z.string(),
  language: z.string(),
  styling: z.string(),
  package_manager: z.enum(['pnpm', 'npm', 'yarn', 'bun'])
}).passthrough();

export const WorkflowSchema = z.object({
  workflow: z.string().regex(/^[0-9a-z][a-z0-9-]*$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().min(20),
  prerequisites: PrerequisitesSchema,
  steps: z.array(WorkflowStepSchema).min(1),
  final_output: z.string().min(5),
  estimated_time: z.string().optional(),
  test_checklist: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
}).passthrough();

export const ToolSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  url: z.string().url(),
  category: z.string(),
  tags: z.array(z.string()),
  type: z.enum(['library', 'framework', 'tool', 'reference', 'template', 'boilerplate', 'snippet', 'starter']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  when_to_use: z.string(),
  how_to_use: z.string(),
  related: z.array(z.number().int()).optional(),
  alternatives: z.array(z.number().int()).optional(),
  install_command: z.string().nullable().optional(),
  peer_dependencies: z.array(z.string()).optional(),
  deprecated: z.boolean().optional(),
  replacement_id: z.number().int().nullable().optional(),
  bundle_kb: z.number().optional(),
  ssr_safe: z.boolean().optional(),
  rsc_safe: z.boolean().optional(),
  maintenance: z.enum(['active', 'maintenance', 'stale', 'deprecated', 'unknown']).optional(),
  learning_curve: z.enum(['low', 'medium', 'high']).optional(),
  typescript: z.boolean().optional(),
  score: z.number().min(0).max(100).optional()
}).passthrough();

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string().regex(/^[a-z][a-z0-9-]*$/),
  description: z.string(),
  tool_count: z.number().int().min(0)
});

export type Workflow = z.infer<typeof WorkflowSchema>;
export type Tool = z.infer<typeof ToolSchema>;
export type Category = z.infer<typeof CategorySchema>;
