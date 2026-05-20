import { z } from 'zod';

/**
 * Mirror of schemas/*.schema.json with runtime + compile-time safety.
 * Keep these two in sync — the CI step `validate-schemas` uses the JSON Schema
 * version while CLI / MCP / wizard code uses these Zod versions.
 */

export const LifecycleSchema = z.enum(['active', 'maintenance', 'legacy', 'deprecated']);
export type Lifecycle = z.infer<typeof LifecycleSchema>;

export const PersonaSchema = z.enum([
  'solo-developer',
  'agency-studio',
  'claude-code-user',
  'rapid-prototyper',
  'enterprise',
]);
export type Persona = z.infer<typeof PersonaSchema>;

export const PackageManagerSchema = z.enum(['pnpm', 'npm', 'yarn', 'bun']);

export const ToolScoresSchema = z.object({
  ssr_compat: z.number().int().min(0).max(10).optional(),
  rsc_compat: z.number().int().min(0).max(10).optional(),
  bundle_cost: z.number().int().min(0).max(10).optional(),
  typescript: z.number().int().min(0).max(10).optional(),
  maintenance: z.number().int().min(0).max(10).optional(),
  learning_curve: z.number().int().min(0).max(10).optional(),
  community: z.number().int().min(0).max(10).optional(),
});
export type ToolScores = z.infer<typeof ToolScoresSchema>;

export const ToolSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  url: z.string().url(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  type: z.enum(['library', 'framework', 'tool', 'reference', 'template', 'service', 'spec']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  when_to_use: z.string().optional(),
  how_to_use: z.string().optional(),
  related: z.array(z.number().int()).optional(),
  alternatives: z.array(z.number().int()).optional(),
  install_command: z.string().nullable().optional(),
  peer_dependencies: z.array(z.string()).optional(),
  lifecycle: LifecycleSchema.default('active'),
  replaced_by: z.number().int().nullable().optional(),
  scores: ToolScoresSchema.optional(),
  bundle_kb_gzip: z.number().nonnegative().optional(),
}).passthrough();
export type Tool = z.infer<typeof ToolSchema>;

export const WorkflowStepSchema = z.object({
  order: z.number().int().positive(),
  tool_id: z.number().int().positive(),
  name: z.string().min(2),
  purpose: z.string().min(5),
  instruction: z.string().min(10),
  expected_output: z.string().min(5),
  optional: z.boolean().optional(),
});
export type WorkflowStep = z.infer<typeof WorkflowStepSchema>;

export const WorkflowSchema = z.object({
  workflow: z.string().regex(/^[a-z0-9-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/),
  description: z.string().min(10),
  category_slugs: z.array(z.string()).optional(),
  personas: z.array(PersonaSchema).optional(),
  prerequisites: z.object({
    framework: z.string(),
    language: z.string(),
    styling: z.string(),
    package_manager: PackageManagerSchema,
    node_versions: z.array(z.string()).optional(),
  }),
  steps: z.array(WorkflowStepSchema).min(1),
  final_output: z.string().min(10),
  estimated_time: z.string().optional(),
  test_checklist: z.array(z.string()).optional(),
  selection_rationale: z.string().optional(),
});
export type Workflow = z.infer<typeof WorkflowSchema>;

export const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string(),
  tool_count: z.number().int().nonnegative().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const ToolIndexSchema = z.array(ToolSchema);
export const CategoryIndexSchema = z.array(CategorySchema);

/** Convenience: parse + throw with a friendlier error trail. */
export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const r = schema.safeParse(data);
  if (!r.success) {
    const issues = r.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid ${label}:\n${issues}`);
  }
  return r.data;
}
