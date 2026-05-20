#!/usr/bin/env node
// ============================================================
// AI Frontend Studio — MCP Server
// Claude Code'a native entegrasyon sağlar.
// Kullanım: claude mcp add aifs node /path/to/mcp-server/dist/index.js
// ============================================================

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

// ---- Veri Yükleme ----
function loadJSON(relativePath: string) {
  const fullPath = join(ROOT, relativePath);
  if (!existsSync(fullPath)) return null;
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

function loadText(relativePath: string): string | null {
  const fullPath = join(ROOT, relativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, "utf8");
}

const index: any[] = loadJSON("orchestration/index.json") ?? [];
const categories: any[] = loadJSON("orchestration/categories.json") ?? [];
const budget: any = loadJSON("performance/bundle-budget.json") ?? {};
const matrix: any = loadJSON("compatibility/version-matrix.json") ?? {};

// ---- Tool Tanımları ----
const TOOLS: Tool[] = [
  {
    name: "get_workflow",
    description: "Belirtilen workflow'un tüm adımlarını, araçlarını ve test listesini döner.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Workflow adı: ai-chat | landing-page | 3d-scene | dashboard | animation | figma-to-code | testing | i18n | pwa | micro-frontend | headless-cms | wasm",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "list_workflows",
    description: "Mevcut tüm workflow'ları ve kısa açıklamalarını listeler.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_tool",
    description: "Bir aracı ID veya ismiyle arar. when_to_use, how_to_use, install komutu ve ilişkili araçları döner.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Araç ID (1-200)" },
        name: { type: "string", description: "Araç adı veya kısmi eşleşme (örn: gsap, framer, zustand)" },
      },
    },
  },
  {
    name: "search_tools",
    description: "Tag, kategori veya amaç ile araç arar. Birden fazla sonuç döner.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Arama terimi (örn: animation, 3d, form, auth)" },
        category: { type: "string", description: "Kategori slug (örn: animasyonlar, ui-bilesenler)" },
        priority: { type: "string", enum: ["high", "medium", "low"] },
        limit: { type: "number", description: "Maksimum sonuç sayısı (varsayılan: 10)" },
      },
      required: ["query"],
    },
  },
  {
    name: "get_snippet",
    description: "Bir araç için hazır kod snippet'ini döner.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Snippet adı: gsap | framer-motion | lenis | react-three-fiber | state-management",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "get_component",
    description: "Hazır bir UI bileşeninin kaynak kodunu döner.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Bileşen adı: hero-section | pricing-table | testimonial-grid | dashboard-sidebar",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "check_budget",
    description: "Bir workflow için tahmini bundle boyutunu ve bütçe durumunu hesaplar.",
    inputSchema: {
      type: "object",
      properties: {
        workflow: { type: "string", description: "Workflow adı" },
      },
      required: ["workflow"],
    },
  },
  {
    name: "get_compatibility",
    description: "Bir stack için test edilmiş versiyon setini ve bilinen sorunları döner.",
    inputSchema: {
      type: "object",
      properties: {
        stack: { type: "string", description: "Stack adı (örn: AI Chat Stack, Dashboard Stack)" },
      },
      required: ["stack"],
    },
  },
  {
    name: "get_troubleshooting",
    description: "Bir araç veya hata mesajı için çözüm önerilerini döner.",
    inputSchema: {
      type: "object",
      properties: {
        tool: { type: "string", description: "Araç adı (örn: gsap, framer-motion, nextjs)" },
      },
      required: ["tool"],
    },
  },
  {
    name: "get_alternatives",
    description: "Bir araç için alternatifleri ve hangisini seçmen gerektiğini döner.",
    inputSchema: {
      type: "object",
      properties: {
        tool_id: { type: "number", description: "Araç ID" },
      },
      required: ["tool_id"],
    },
  },
  {
    name: "resolve_deps",
    description: "Bir workflow için tam bağımlılık listesini ve kurulum komutlarını döner.",
    inputSchema: {
      type: "object",
      properties: {
        workflow: { type: "string", description: "Workflow adı" },
      },
      required: ["workflow"],
    },
  },
  // ---- v4 yeni tool'lar ----
  {
    name: "recommend_tools",
    description: "Proje kısıtlarına göre puanlanmış tool önerileri döner. Deprecated tool'lar otomatik elenir, her öneri için 'selection rationale' üretilir.",
    inputSchema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Kategori slug'ı (opsiyonel)" },
        tag: { type: "string", description: "Etiket filtresi (opsiyonel)" },
        limit: { type: "number", description: "Maksimum sonuç sayısı (varsayılan 5)" },
        framework: { type: "string", description: "Ör: 'next', 'remix', 'vite' — SSR/RSC ağırlık ayarı" },
        prioritize_bundle: { type: "boolean" },
        prioritize_learning_curve: { type: "boolean" },
        typescript_strict: { type: "boolean" },
      },
    },
  },
  {
    name: "validate_workflow",
    description: "Bir workflow JSON'unu şemaya, tool referanslarına ve deprecated kontrolleri ne karşı doğrular. PR aksiyonlarında da aynı mantık çalışır.",
    inputSchema: {
      type: "object",
      properties: {
        workflow: { type: "string", description: "Workflow adı (örn. ai-chat)" },
      },
      required: ["workflow"],
    },
  },
];

// ---- Tool Handler'ları ----
async function handleTool(name: string, args: any): Promise<string> {
  switch (name) {
    case "list_workflows": {
      const wfDir = join(ROOT, "orchestration/workflows");
      const { readdirSync } = await import("fs");
      const files = readdirSync(wfDir).filter((f) => f.endsWith(".json"));
      const result = files.map((f) => {
        const wf = loadJSON(`orchestration/workflows/${f}`);
        return `• **${wf.workflow}** — ${wf.description}\n  Adım: ${wf.steps.length} | Süre: ${wf.estimated_time ?? "?"}`;
      });
      return `# Mevcut Workflow'lar\n\n${result.join("\n\n")}`;
    }

    case "get_workflow": {
      const wf = loadJSON(`orchestration/workflows/${args.name}.json`);
      if (!wf) return `❌ "${args.name}" workflow'u bulunamadı.`;

      const steps = wf.steps.map((s: any) => {
        const tool = index.find((t) => t.id === s.tool_id);
        return [
          `### Adım ${s.order}: ${s.name}`,
          `**Araç:** ${tool?.name ?? s.tool_id} (${tool?.url ?? ""})`,
          `**Amaç:** ${s.purpose}`,
          `**Talimat:** ${s.instruction}`,
          `**Beklenen Çıktı:** ${s.expected_output}`,
          tool?.install_command ? `**Kurulum:** \`${tool.install_command}\`` : "",
        ].filter(Boolean).join("\n");
      });

      const checklist = wf.test_checklist?.map((c: string) => `- [ ] ${c}`).join("\n") ?? "";

      return [
        `# ${wf.workflow} Workflow`,
        wf.description,
        `**Süre:** ${wf.estimated_time ?? "?"}`,
        "",
        steps.join("\n\n"),
        "",
        `## Test Listesi\n${checklist}`,
        `\n**Nihai Çıktı:** ${wf.final_output}`,
      ].join("\n");
    }

    case "get_tool": {
      let tool: any;
      if (args.id) {
        tool = index.find((t) => t.id === args.id);
      } else if (args.name) {
        const q = args.name.toLowerCase();
        tool = index.find(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.tags?.some((tag: string) => tag.includes(q))
        );
      }
      if (!tool) return `❌ Araç bulunamadı.`;

      const related = tool.related?.map((id: number) => {
        const r = index.find((t) => t.id === id);
        return r ? `${r.name} (id:${id})` : id;
      }).join(", ");

      const alts = tool.alternatives?.map((id: number) => {
        const r = index.find((t) => t.id === id);
        return r ? `${r.name} (id:${id})` : id;
      }).join(", ");

      return [
        `# ${tool.name} (id: ${tool.id})`,
        `**URL:** ${tool.url}`,
        `**Kategori:** ${tool.category} | **Tip:** ${tool.type} | **Öncelik:** ${tool.priority}`,
        `**Ne zaman kullan:** ${tool.when_to_use}`,
        `**Nasıl kullan:** ${tool.how_to_use}`,
        tool.install_command ? `**Kurulum:** \`${tool.install_command}\`` : "",
        tool.peer_dependencies?.length ? `**Peer Deps:** ${tool.peer_dependencies.join(", ")}` : "",
        related ? `**İlişkili:** ${related}` : "",
        alts ? `**Alternatifler:** ${alts}` : "",
      ].filter(Boolean).join("\n");
    }

    case "search_tools": {
      const q = args.query.toLowerCase();
      const limit = args.limit ?? 10;
      let results = index.filter((t) => {
        const matchQuery =
          t.name.toLowerCase().includes(q) ||
          t.tags?.some((tag: string) => tag.includes(q)) ||
          t.when_to_use?.toLowerCase().includes(q) ||
          t.category?.includes(q);
        const matchCategory = args.category ? t.category === args.category : true;
        const matchPriority = args.priority ? t.priority === args.priority : true;
        return matchQuery && matchCategory && matchPriority;
      }).slice(0, limit);

      if (!results.length) return `❌ "${args.query}" için sonuç bulunamadı.`;

      return results.map((t) =>
        `**[${t.id}] ${t.name}** (${t.priority})\n${t.when_to_use}\n\`${t.install_command ?? "kurulum yok"}\``
      ).join("\n\n");
    }

    case "get_snippet": {
      const snippetMap: Record<string, string> = {
        "gsap": "snippets/gsap.ts",
        "framer-motion": "snippets/framer-motion.tsx",
        "lenis": "snippets/lenis.tsx",
        "react-three-fiber": "snippets/react-three-fiber.tsx",
        "state-management": "snippets/state-management.tsx",
      };
      const path = snippetMap[args.name];
      if (!path) return `❌ "${args.name}" snippet'i bulunamadı. Mevcut: ${Object.keys(snippetMap).join(", ")}`;
      const content = loadText(path);
      return content ? `\`\`\`typescript\n${content}\n\`\`\`` : "❌ Dosya okunamadı.";
    }

    case "get_component": {
      const compMap: Record<string, string> = {
        "hero-section": "components/hero-section.tsx",
        "pricing-table": "components/pricing-table.tsx",
        "testimonial-grid": "components/testimonial-grid.tsx",
        "dashboard-sidebar": "components/dashboard-sidebar.tsx",
      };
      const path = compMap[args.name];
      if (!path) return `❌ "${args.name}" bileşeni bulunamadı. Mevcut: ${Object.keys(compMap).join(", ")}`;
      const content = loadText(path);
      return content ? `\`\`\`tsx\n${content}\n\`\`\`` : "❌ Dosya okunamadı.";
    }

    case "check_budget": {
      const wf = loadJSON(`orchestration/workflows/${args.workflow}.json`);
      if (!wf) return `❌ Workflow bulunamadı.`;

      const toolIds = [
        ...wf.steps.map((s: any) => s.tool_id),
        ...wf.steps.map((s: any) => s.related_tool_id).filter(Boolean),
      ];

      const packages = budget.packages ?? [];
      let total = 0;
      const lines: string[] = [];

      for (const id of [...new Set(toolIds)] as number[]) {
        const pkg = packages.find((p: any) => p.id === id);
        if (!pkg) continue;
        total += pkg.gzip_kb;
        const ts = pkg.treeshakeable ? "✅" : "⚠️";
        lines.push(`${ts} **${pkg.name}** — ${pkg.gzip_kb}KB\n   _${pkg.notes}_`);
      }

      const workflowBudget = budget.budgets?.[args.workflow];
      const limit = workflowBudget?.target_total_kb ?? 500;
      const status = total <= limit ? "✅ BÜTÇE İÇİNDE" : "❌ BÜTÇE AŞILDI";

      return [
        `# Bundle Bütçe Raporu — ${args.workflow}`,
        lines.join("\n"),
        `\n**Tahmini Toplam:** ${total}KB`,
        `**Bütçe Hedefi:** ${limit}KB`,
        `**Durum:** ${status}`,
      ].join("\n");
    }

    case "get_compatibility": {
      const stacks = matrix.stacks ?? [];
      const stack = stacks.find((s: any) =>
        s.name.toLowerCase().includes(args.stack.toLowerCase()) ||
        s.workflow?.includes(args.stack.toLowerCase())
      );
      if (!stack) return `❌ Stack bulunamadı. Mevcut: ${stacks.map((s: any) => s.name).join(", ")}`;

      const pkgs = Object.entries(stack.packages)
        .map(([k, v]) => `- \`${k}\`: **${v}**`)
        .join("\n");

      const issues = stack.known_issues?.map((i: string) => `⚠️ ${i}`).join("\n") ?? "Bilinen sorun yok.";

      return [
        `# ${stack.name}`,
        `**Durum:** ${stack.status} | **Test tarihi:** ${stack.tested_date}`,
        `\n## Paketler\n${pkgs}`,
        `\n## Bilinen Sorunlar\n${issues}`,
      ].join("\n");
    }

    case "get_troubleshooting": {
      const content = loadText("troubleshooting/common-errors.md");
      if (!content) return "❌ Hata rehberi bulunamadı.";

      const q = args.tool.toLowerCase();
      const sections = content.split("\n## ");
      const relevant = sections.filter((s) => s.toLowerCase().includes(q));

      if (!relevant.length) return `❌ "${args.tool}" için hata çözümü bulunamadı.`;
      return relevant.map((s) => `## ${s}`).join("\n\n");
    }

    case "get_alternatives": {
      const tool = index.find((t) => t.id === args.tool_id);
      if (!tool) return `❌ ID ${args.tool_id} bulunamadı.`;
      if (!tool.alternatives?.length) return `✅ ${tool.name} için tanımlı alternatif yok.`;

      const alts = tool.alternatives.map((id: number) => {
        const alt = index.find((t) => t.id === id);
        if (!alt) return null;
        return [
          `### ${alt.name} (id:${alt.id})`,
          `**Ne zaman seç:** ${alt.when_to_use}`,
          `**Kurulum:** \`${alt.install_command ?? "yok"}\``,
        ].join("\n");
      }).filter(Boolean);

      const incompatible = matrix.incompatible_pairs?.find(
        (p: any) =>
          tool.name.includes(p.package_a) || tool.name.includes(p.package_b)
      );

      return [
        `# ${tool.name} Alternatifleri`,
        alts.join("\n\n"),
        incompatible
          ? `\n⚠️ **Uyarı:** ${incompatible.package_a} ve ${incompatible.package_b} birlikte kullanılamaz. → Önerilen: **${incompatible.recommended}**`
          : "",
      ].filter(Boolean).join("\n");
    }

    case "recommend_tools": {
      const constraints = {
        framework: args.framework,
        prioritize_bundle: !!args.prioritize_bundle,
        prioritize_learning_curve: !!args.prioritize_learning_curve,
        typescript_strict: !!args.typescript_strict,
      };
      const PRIORITY_BONUS: Record<string, number> = { critical: 8, high: 5, medium: 2, low: 0 };
      const candidates = index
        .filter((t: any) => !args.category || t.category === args.category)
        .filter((t: any) => !args.tag || (t.tags ?? []).includes(args.tag))
        .filter((t: any) => (t.lifecycle ?? 'active') !== 'deprecated');
      const scored = candidates.map((t: any) => {
        const s = t.scores ?? {};
        const get = (k: string, fallback = 5) => (s[k] ?? fallback);
        let w = { ssr: 0.15, rsc: 0.10, bundle: 0.15, ts: 0.10, maint: 0.20, learn: 0.10, comm: 0.20 };
        if (constraints.prioritize_bundle) { w.bundle = 0.30; w.comm = 0.10; }
        if (constraints.prioritize_learning_curve) { w.learn = 0.25; w.comm = 0.10; }
        if (constraints.typescript_strict) { w.ts = 0.20; w.comm = 0.10; }
        if (constraints.framework?.toLowerCase().includes('next')) { w.rsc = 0.18; w.ssr = 0.18; }
        const base = get('ssr_compat') * w.ssr + get('rsc_compat') * w.rsc + get('bundle_cost') * w.bundle
          + get('typescript') * w.ts + get('maintenance') * w.maint + get('learning_curve') * w.learn
          + get('community') * w.comm;
        const total = Math.min(100, Math.round(base * 10 + (PRIORITY_BONUS[t.priority] ?? 0)));
        const reasons: string[] = [];
        if (t.lifecycle === 'legacy') reasons.push('Legacy — modern alternatif tercih edilebilir.');
        if (get('maintenance') >= 8) reasons.push(`Aktif bakım (${get('maintenance')}/10).`);
        if (get('bundle_cost') >= 8) reasons.push(`Düşük bundle (${t.bundle_kb_gzip ?? '?'}KB gzip).`);
        if (constraints.framework?.toLowerCase().includes('next') && get('rsc_compat') >= 8) reasons.push('Next.js RSC uyumlu.');
        if (t.priority === 'critical') reasons.push('Kritik önem (+8 bonus).');
        return { tool: t, total, reasons };
      }).sort((a, b) => b.total - a.total).slice(0, args.limit ?? 5);

      const md = scored.map((r, i) => `### ${i + 1}. ${r.tool.name} — ${r.total}/100\n- ${r.tool.url}\n- ${r.reasons.length ? r.reasons.join(' ') : 'Genel kriterler iyi.'}`).join('\n\n');
      return `# Öneri Listesi\n\n${md}`;
    }

    case "validate_workflow": {
      const wf = loadJSON(`orchestration/workflows/${args.workflow}.json`);
      if (!wf) return `❌ Workflow bulunamadı: ${args.workflow}`;
      const errors: string[] = [];
      if (!wf.workflow || !wf.version || !wf.steps?.length) errors.push('Zorunlu alanlar eksik.');
      if (wf.workflow !== args.workflow) errors.push(`field 'workflow' (${wf.workflow}) dosya adıyla uyuşmuyor.`);
      const idSet = new Set(index.map((t: any) => t.id));
      const deprSet = new Set(index.filter((t: any) => t.lifecycle === 'deprecated').map((t: any) => t.id));
      for (const s of wf.steps ?? []) {
        if (!idSet.has(s.tool_id)) errors.push(`Step ${s.order}: tool_id=${s.tool_id} index'te yok.`);
        if (deprSet.has(s.tool_id)) errors.push(`Step ${s.order}: deprecated tool ${s.tool_id}.`);
      }
      if (!errors.length) return `✅ ${args.workflow} geçerli (${wf.steps.length} adım).`;
      return `❌ ${args.workflow} hatalı:\n${errors.map((e) => `  • ${e}`).join('\n')}`;
    }

    case "resolve_deps": {
      const wf = loadJSON(`orchestration/workflows/${args.workflow}.json`);
      if (!wf) return `❌ Workflow bulunamadı.`;

      const toolIds = [
        ...wf.steps.map((s: any) => s.tool_id),
        ...wf.steps.map((s: any) => s.related_tool_id).filter(Boolean),
      ];

      const installs: string[] = [];
      const noInstall: string[] = [];

      for (const id of [...new Set(toolIds)] as number[]) {
        const tool = index.find((t) => t.id === id);
        if (!tool) continue;
        if (tool.install_command) installs.push(tool.install_command);
        else noInstall.push(tool.name);
      }

      const npmPkgs = installs
        .filter((c) => c.startsWith("npm install"))
        .map((c) => c.replace("npm install ", ""))
        .join(" ");

      return [
        `# Bağımlılıklar — ${args.workflow}`,
        `\n## Tek Komutla Kur (pnpm)`,
        `\`\`\`bash\npnpm add ${npmPkgs}\n\`\`\``,
        `\n## Tüm Kurulum Komutları`,
        installs.map((c) => `- \`${c}\``).join("\n"),
        noInstall.length ? `\n## Kurulum Gerektirmeyen\n${noInstall.map((n) => `- ${n}`).join("\n")}` : "",
      ].filter(Boolean).join("\n");
    }

    default:
      return `❌ Bilinmeyen tool: ${name}`;
  }
}

// ---- MCP Server Başlat ----
const server = new Server(
  { name: "ai-frontend-studio", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const result = await handleTool(request.params.name, request.params.arguments ?? {});
  return { content: [{ type: "text", text: result }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🚀 AI Frontend Studio MCP Server başlatıldı");
