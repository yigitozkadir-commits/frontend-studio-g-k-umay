# 🏢 Enterprise Persona

> Kurumsal ekip. Güvenlik, lisans kontrolü ve supply-chain güvenliği zorunlu.

## Önerilen Giriş Noktası: CLI (strict + CI pipeline)

```bash
npx @ai-frontend-studio/cli create enterprise-app \
  --workflow dashboard \
  --strict \
  --persona enterprise
```

## CI Pipeline (Otomatik)

| Workflow | Ne Kontrol Eder |
|---|---|
| `security.yml` | pnpm audit (high+), lisans whitelist, gitleaks, CodeQL |
| `test.yml` | unit + smoke + schema validation |
| `validate-schemas.yml` | orchestration JSON şema uyumu |
| `bundle-budget.yml` | 12 workflow bundle bütçe kontrolü |
| `compatibility-smoke.yml` | 10 stack Node sürümü uyumluluğu |

## İzin Verilen Lisanslar

`MIT · Apache-2.0 · BSD-2-Clause · BSD-3-Clause · ISC · CC0-1.0 · CC-BY-4.0 · Unlicense · 0BSD`

## Manuel Kontroller

```bash
npx license-checker --production --json > licenses.json
node scripts/check-budget.js dashboard
npx @ai-frontend-studio/cli audit
```

## Changeset ile Sürüm Yönetimi

```bash
pnpm changeset
pnpm version
pnpm release
```
