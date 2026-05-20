# CHANGELOG — v4.0.0

> Bu dosya v3 → v4 yolculuğunu **20 madde halinde** belgeler.
> Bundan sonraki sürümler [Changesets](./.changeset) tarafından otomatik üretilir.

## v4.0.0 — 2026-05-18

### 🧪 Quality & DX (Madde 1, 2, 3, 6, 7)

#### 1. Test katmanı eklendi
- `cli/`, `mcp-server/`, `packages/shared/` paketlerinde **Jest + ts-jest (ESM)** kuruldu.
- Smoke testler `tests/smoke/orchestration.smoke.test.js` — `node --test` ile çalışır (sıfır bağımlılık).
- `.github/workflows/test.yml`: Node 18 + 20 matrix'inde Jest + smoke + schema validation.

#### 2. JSON Schema doğrulama
- `schemas/workflow.schema.json`, `tool.schema.json`, `category.schema.json` (draft-07).
- `scripts/validate-schemas.js` — Ajv tabanlı, PR aşamasında CI gate olarak çalışır.
- `packages/shared/src/schemas.ts` — aynı kuralların Zod karşılığı (runtime + tip güvenliği).

#### 3. CI tüm workflow'lara yayıldı
- `bundle-budget.yml` artık 12 workflow'un tamamı için matrix çalıştırıyor.
- `compatibility-smoke.yml`: Node 18/20 × 10 stack için canlı `create-next-app + pnpm add` testi.

#### 6. Security CI eklendi
- `pnpm audit` (high+)
- `license-checker` allowlist (MIT/Apache/BSD/ISC/CC0/Unlicense/0BSD)
- `gitleaks` secret scan
- GitHub CodeQL (JS/TS)

#### 7. Compatibility matrix → canlı smoke test
- `compatibility-smoke.yml` her Pazar çalışır; `version-matrix.json`'daki paket sürümlerini gerçekten kurup `tsc + next build` yapar.
- Sürümler eskidiğinde CI failure veriyor.

### 🧱 Architecture (Madde 4, 5, 14, 16, 18)

#### 4. CLI / Wizard / Generator çıktısı standardize edildi
- `create.ts` artık her zaman üretir: `.env.example`, `.env.local.example`, `.nvmrc`, `WORKFLOW.md`.
- `--strict` bayrağı (pnpm + Node 20 zorunlu).
- `--persona` bayrağı (solo-developer | agency-studio | claude-code-user | rapid-prototyper | enterprise).

#### 5. Versiyonlama: Changesets
- `.changeset/config.json` ile `cli + mcp-server + shared` **fixed grup** (her zaman birlikte sürüm artar).
- `release.yml` workflow'u "Release PR" oluşturur veya `pnpm changeset publish` çalıştırır.
- Tüm paket sürümleri **4.0.0**'a hizalandı.

#### 14. Scoring engine
- `packages/shared/src/scoring.ts` — 7 boyutlu (ssr/rsc/bundle/ts/maint/learn/community) ağırlıklı puanlama.
- `eligible()` deprecated tool'ları filtreler.
- `recommendTools()` puan + rationale döner.

#### 16. MCP server → 2 yeni tool
- `recommend_tools(category, tag, framework, prioritize_*, typescript_strict)` — puanlı + rationale'lı öneri.
- `validate_workflow(workflow)` — şema + tool referansı + deprecated kontrolü.

#### 18. Strict mode
- `aifs create --strict` ve `aifs doctor --strict`: yalnızca pnpm + Node 20 + TS kabul eder.

### 📚 Content & Catalog (Madde 8, 10, 11, 12, 20)

#### 8. Component kütüphanesi büyüdü (+3 → 7)
- `auth-form.tsx` — react-hook-form + zod + a11y
- `data-table.tsx` — TanStack Table + Virtual scrolling
- `command-palette.tsx` — Cmd+K + Fuse.js + keyboard nav

#### 10. Storybook görsel katalog
- `catalog/` (Storybook 8 + Vite) — her component için story.
- `.github/workflows/storybook.yml` → GitHub Pages otomatik deploy.

#### 11. Workflow sayısı 6 → 12
- ⭐ `testing.json` — Jest + RTL + Playwright piramidi
- ⭐ `i18n.json` — Next.js App Router i18n + RTL
- ⭐ `pwa.json` — Manifest + offline + install prompt
- ⭐ `micro-frontend.json` — Vite Module Federation
- ⭐ `headless-cms.json` — Sanity/Contentful + ISR + Zod
- ⭐ `wasm.json` — Rust → WASM → Web Worker

#### 12. Snippet kütüphanesi büyüdü (+3 → 8)
- `react-query.tsx` — typed query + optimistic mutation
- `zod-form.tsx` — schema-first form
- `ai-streaming.ts` — Vercel AI SDK best practice

#### 20. Starter projeleri
- `starters/ai-chat-starter/`
- `starters/landing-page-starter/`
- `starters/dashboard-starter/`

### 🏷 Metadata (Madde 9, 13, 17)

#### 9. Zengin metadata (200/200 tool)
- `lifecycle`, `replaced_by`, `scores` (7 alan), `bundle_kb_gzip` eklendi.
- `scripts/enrich-metadata.js` idempotent — mevcut değerleri ezmiyor.

#### 13. Deprecated tool işaretleme
- `react-beautiful-dnd` → deprecated, replaced_by: dnd-kit.
- `moment` ve `redux` legacy işaretlendi.
- CLI `doctor` projenin package.json'unu tarayıp uyarıyor.

#### 17. Kategori kapsama raporu
- `scripts/category-coverage.js` → `docs/COVERAGE.md` (otomatik).
- v4 ilk ölçümde **%45 kapsama** (23/51 kategori workflow'larda kullanılıyor). Kapsam dışı 28 kategori roadmap girdisi.

### 🎭 Documentation (Madde 4, 19)

#### 4 (kısmi). "Neden bu araç seçildi?" açıklaması
- `ai-workflow-generator/index.js` her üretilen workflow'a `selection_rationale` ekliyor.
- MCP `recommend_tools` her sonuç için bullet-list halinde rationale döner.

#### 19. Persona-tabanlı README
- Ana README başında 5 persona için "sana göre başlangıç" tablosu.
- Her workflow.json'a opsiyonel `personas: []` alanı eklendi.

### 🪛 CLI eklemeleri (Madde 15)

#### 15. `aifs doctor` ve `aifs audit`
- `doctor`: Node sürümü, paket yöneticisi, .env*, deprecated dep, npm outdated kontrolleri. `--strict` ve `--json` bayrakları.
- `audit`: Repo-içi denetim — kategori kapsaması, kullanılmayan tool'lar, deprecated workflow referansları.

---

## Önceki sürümler

- **v3.0.0** — 200 tool / 51 kategori / 6 workflow + MCP server + CLI + wizard + generator (taban).
