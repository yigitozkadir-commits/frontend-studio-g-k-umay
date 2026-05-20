/**
 * Standart scaffold üretici — CLI, wizard ve generator buradan tüketir.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STANDARD = join(__dirname, '..', '..', '..', 'scaffold-standard');

export interface ScaffoldOptions {
  projectName: string;
  workflow: any; // Workflow JSON
  targetDir: string;
  strict?: boolean;
}

export async function scaffold(opts: ScaffoldOptions): Promise<void> {
  const { projectName, workflow, targetDir, strict } = opts;
  await mkdir(targetDir, { recursive: true });

  const pm = strict ? 'pnpm' : workflow.prerequisites.package_manager;

  // package.json
  const pkg = {
    name: projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      test: 'jest',
      lint: 'next lint'
    },
    dependencies: {},
    devDependencies: {},
    engines: { node: '>=18.0.0' }
  };
  if (strict) {
    (pkg as any).packageManager = 'pnpm@9.0.0';
  }
  await writeFile(join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

  // .env.example
  try {
    const envTpl = await readFile(join(STANDARD, 'template.env.example'), 'utf8');
    await writeFile(join(targetDir, '.env.example'), envTpl);
  } catch {
    await writeFile(join(targetDir, '.env.example'), '# env\n');
  }

  // .gitignore
  await writeFile(
    join(targetDir, '.gitignore'),
    'node_modules\n.next\ndist\n.env\ncoverage\n.DS_Store\n'
  );

  // WORKFLOW.md
  let md = `# 🎯 ${workflow.workflow}\n\n${workflow.description}\n\n`;
  md += `## Stack\n\n`;
  for (const [k, v] of Object.entries(workflow.prerequisites)) {
    md += `- **${k}**: ${v}\n`;
  }
  md += `\n## Adımlar\n\n`;
  for (const step of workflow.steps) {
    md += `### ${step.order}. ${step.name}\n\n`;
    md += `**Amaç**: ${step.purpose}\n\n`;
    md += `**Talimat**: ${step.instruction}\n\n`;
    md += `**Beklenen Çıktı**: ${step.expected_output}\n\n`;
    if (step.selection_rationale) {
      md += `**Neden bu araç?** ${step.selection_rationale}\n\n`;
    }
    md += `---\n\n`;
  }
  md += `## Son Çıktı\n\n${workflow.final_output}\n`;
  await writeFile(join(targetDir, 'WORKFLOW.md'), md);

  // README.md
  const readme =
    `# ${projectName}\n\n` +
    `${workflow.description}\n\n` +
    `## Quickstart\n\n` +
    '```bash\n' +
    `${pm} install\n${pm} dev\n` +
    '```\n\n' +
    `## Stack\n\n- ${Object.entries(workflow.prerequisites).map(([k, v]) => `${k}: ${v}`).join('\n- ')}\n\n` +
    `## Workflow Steps\n\nSee [WORKFLOW.md](./WORKFLOW.md).\n\n` +
    `## Troubleshooting\n\nRun \`npx @ai-frontend-studio/cli doctor\` if anything looks off.\n`;
  await writeFile(join(targetDir, 'README.md'), readme);

  // Basit app/ iskeleti
  await mkdir(join(targetDir, 'app'), { recursive: true });
  await writeFile(
    join(targetDir, 'app', 'layout.tsx'),
    `export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html><body>{children}</body></html>;\n}\n`
  );
  await writeFile(
    join(targetDir, 'app', 'page.tsx'),
    `export default function Page() {\n  return <main>{${JSON.stringify(`Hello, ${projectName}`)}}</main>;\n}\n`
  );
}
