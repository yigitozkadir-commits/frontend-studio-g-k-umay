# Katkı Rehberi

## Gereksinimler

- Node ≥ 20 (`.nvmrc` → `nvm use`)
- pnpm ≥ 9

## Kurulum

```bash
pnpm install
pnpm build
pnpm test
```

## Yeni Araç Eklemek

1. `orchestration/index.json`'a yeni entry ekle
2. `pnpm validate:schemas` ile şema doğrula
3. `pnpm coverage:report` ile `docs/COVERAGE.md` güncelle
4. PR aç

## Yeni Workflow Eklemek

1. `orchestration/workflows/<isim>.json` oluştur
2. `mcp-server/src/index.ts` satır 50'deki `get_workflow` description listesine ekle
3. `performance/bundle-budget.json`'a hedef ekle
4. `tools/compat-smoke/index.js` matrix'e ekle

## Changesets

```bash
pnpm changeset
pnpm version
pnpm release
```
