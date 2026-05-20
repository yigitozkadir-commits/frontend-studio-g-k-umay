# 🧠 AI Frontend Studio — Orkestrasyon Reposu v4.0

> 200 araç • 51 kategori • **12 hazır workflow** • Sonsuz üretilebilir.
> Test piramidi, şema doğrulama, scoring engine ve persona tabanlı başlangıç ile **kurumsal hazır** sürüm.

[![Test](https://img.shields.io/badge/test-jest%2Bnode--test-green)]() [![Schemas](https://img.shields.io/badge/schemas-validated-blue)]() [![Coverage](https://img.shields.io/badge/categories-45%25-yellow)]() [![License](https://img.shields.io/badge/license-MIT-lightgrey)]()

---

## 🎯 Sana göre başlangıç (persona seç)

| Persona | Önerilen başlangıç | Neden? |
|---|---|---|
| 👤 **Solo developer** — küçük yan proje | `npx aifs create my-app -w ai-chat` | CLI tek komutla scaffold + .env standart üretir. |
| 🏢 **Agency / studio** — müşteri projesi | `node wizard/index.js` → strict mode | Interactive wizard + strict mode (pnpm + Node 20 + TS) tutarlılığı garanti eder. |
| 🤖 **Claude Code user** | `claude mcp add aifs node mcp-server/dist/index.js` | `recommend_tools` ve `validate_workflow` ile Claude tüm kataloğu güvenle kullanır. |
| ⚡ **Rapid prototyper** | `node ai-workflow-generator/index.js "müzik çalar"` | Doğal dilden workflow + selection rationale üretir. |
| 🏛 **Enterprise** | `pnpm doctor --strict` + `pnpm audit:repo` | Security/license/secret-scan CI + compatibility live testleri. |

---

## 🚀 v3 → v4 Yenilikleri (özet)

| # | Madde | Çıktı |
|---|---|---|
| 1 | **Test katmanı** | Jest (CLI, MCP, shared) + node --test smoke + `.github/workflows/test.yml` |
| 2 | **Şema doğrulama** | `schemas/*.json` (JSON Schema) + `packages/shared/src/schemas.ts` (Zod) |
| 3 | **CI tüm workflow'lara** | `bundle-budget.yml` matrix ile 12 workflow'u kapsar |
| 4 | **CLI/wizard/generator standartı** | Ortak `.env.example` + `.nvmrc` + WORKFLOW.md çıktısı |
| 5 | **Versiyonlama** | Changesets + paket sürümleri 4.0.0 fixed grup |
| 6 | **Security CI** | pnpm audit + license-checker + gitleaks + CodeQL |
| 7 | **Compatibility live test** | `compatibility-smoke.yml` Node 18/20 × 10 stack |
| 8 | **Component kütüphanesi** | +3 yeni: AuthForm, DataTable, CommandPalette |
| 9 | **Zengin metadata** | `lifecycle`, `scores`, `bundle_kb_gzip` (200/200 tool) |
| 10 | **Görsel katalog** | `catalog/` — Storybook 8 + GitHub Pages deploy |
| 11 | **Workflow kapsamı** | +6 yeni: testing, i18n, pwa, micro-frontend, headless-cms, wasm |
| 12 | **Snippet'ler** | +3 yeni: react-query, zod-form, ai-streaming |
| 13 | **Deprecated işaretleme** | `enrich-metadata.js` react-beautiful-dnd → dnd-kit |
| 14 | **Scoring motoru** | `packages/shared/src/scoring.ts` |
| 15 | **CLI doctor/audit** | `aifs doctor [--strict]`, `aifs audit` |
| 16 | **MCP +2 tool** | `recommend_tools`, `validate_workflow` |
| 17 | **Kapsama raporu** | `scripts/category-coverage.js` → `docs/COVERAGE.md` |
| 18 | **Strict mode** | `aifs create --strict` (sadece pnpm + Node 20) |
| 19 | **Persona README** | Yukarıdaki tablo |
| 20 | **Starter projeleri** | `starters/{ai-chat,landing-page,dashboard}-starter` |

Detaylı liste: [CHANGELOG.md](./CHANGELOG.md)

---

## 🗺️ Mimari

```
Claude Code / Claude.ai / IDE
        │
        ▼
  MCP Server (13 native tool ⬆ v3:11)
        │
        ├── orchestration/  (200 tool, 12 workflow ⬆ v3:6)
        ├── snippets/       (8 hazır kod ⬆ v3:5)
        ├── components/     (7 bileşen ⬆ v3:4)
        ├── catalog/        ⭐ NEW — Storybook görsel katalog
        ├── schemas/        ⭐ NEW — JSON Schema doğrulama
        ├── packages/shared ⭐ NEW — Zod + scoring engine
        ├── starters/       ⭐ NEW — Türetilmiş örnek projeler
        ├── docs/           ⭐ NEW — Otomatik üretilen raporlar
        └── tests/smoke/    ⭐ NEW — Repo invariant testleri
```

---

## 📂 Tam Dizin Yapısı (v4)

```
.
├── orchestration/
│   ├── index.json              # 200 araç (v4: scores + lifecycle + bundle_kb_gzip)
│   ├── categories.json         # 51 kategori
│   └── workflows/              # 12 hazır workflow
│       ├── ai-chat.json
│       ├── landing-page.json
│       ├── 3d-scene.json
│       ├── dashboard.json
│       ├── animation.json
│       ├── figma-to-code.json
│       ├── testing.json        ⭐
│       ├── i18n.json           ⭐
│       ├── pwa.json            ⭐
│       ├── micro-frontend.json ⭐
│       ├── headless-cms.json   ⭐
│       └── wasm.json           ⭐
├── schemas/                    ⭐ JSON Schema doğrulama
├── packages/shared/            ⭐ Zod + scoring engine
├── snippets/                   # 8 snippet
├── components/                 # 7 component
├── catalog/                    ⭐ Storybook görsel katalog
├── starters/                   ⭐ 3 örnek proje
├── tests/smoke/                ⭐ Repo invariants
├── docs/                       ⭐ Otomatik raporlar (COVERAGE.md)
├── troubleshooting/
├── compatibility/
├── performance/
├── mcp-server/                 # 13 native tool
├── cli/                        # +2 komut: doctor, audit
├── wizard/
├── ai-workflow-generator/      # +selection_rationale
├── scripts/
│   ├── validate-schemas.js     ⭐
│   ├── enrich-metadata.js      ⭐
│   ├── category-coverage.js    ⭐
│   ├── check-budget.js
│   ├── check-versions.js
│   └── resolve-deps.sh
├── prompts/
├── .changeset/                 ⭐ Changesets versiyonlama
└── .github/workflows/
    ├── test.yml                ⭐
    ├── security.yml            ⭐
    ├── compatibility-smoke.yml ⭐
    ├── storybook.yml           ⭐
    ├── release.yml             ⭐
    ├── bundle-budget.yml       # genişletildi (12 workflow)
    ├── version-check.yml
    └── lighthouse.yml
```

---

## ⚡ Hızlı Başlangıç

```bash
# Monorepo kurulumu
pnpm install
pnpm build

# Repo sağlığını kontrol et
pnpm validate:schemas       # tüm JSON şemaları
pnpm test                   # Jest + smoke testler
pnpm coverage:report        # docs/COVERAGE.md güncelle
pnpm doctor                 # mevcut projenin sağlığı

# Yeni proje
npx @ai-frontend-studio/cli create my-app -w ai-chat --strict
```

---

## 🔧 MCP Server Tool'ları (v4 — 13 adet)

```
get_workflow, list_workflows, get_tool, search_tools, get_snippet,
get_component, check_budget, get_compatibility, get_troubleshooting,
get_alternatives, resolve_deps,
recommend_tools  ⭐ v4
validate_workflow ⭐ v4
```

`recommend_tools` örneği (Claude'da):
> "Next.js + RSC için chart kütüphanesi öner, bundle hassasım"
>
> → MCP scoring engine ile filtrelenmiş, "selection rationale" içeren puanlı liste döner.

---

## 📖 Daha fazlası

- [CHANGELOG.md](./CHANGELOG.md) — v4 değişiklikleri (20 madde tek tek)
- [docs/COVERAGE.md](./docs/COVERAGE.md) — Kategori kapsama raporu
- [schemas/README.md](./schemas/README.md) — Şema doğrulama
- [catalog/README.md](./catalog/README.md) — Görsel katalog
- [starters/](./starters) — Çalışan örnek projeler

---

**Lisans:** MIT • **Engine:** Node ≥ 18 • **Önerilen:** Node 20 + pnpm 9
