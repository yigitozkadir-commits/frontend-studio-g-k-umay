# 🎨 Agency / Studio Persona

> Müşteri projeleri yapan ajans veya stüdyo. Tutarlılık ve tekrarlanabilirlik kritik.

## Önerilen Giriş Noktası: CLI (strict mod)

```bash
npx @ai-frontend-studio/cli create client-x \
  --workflow dashboard \
  --strict \
  --persona agency
```

## Ne Zaman Hangi Workflow?

| Proje Tipi | Workflow |
|---|---|
| Kurumsal dashboard | `dashboard` |
| Müşteri landing page | `landing-page` |
| Figma teslimi | `figma-to-code` |
| Blog / içerik sitesi | `headless-cms` |

## Strict Mod Ne Sağlar?

- `pnpm` paket yöneticisi zorunlu
- `packageManager` alanı `package.json`'a eklenir
- `.nvmrc` üretilir (Node 20)
- Tüm projelerde aynı scaffold yapısı

## Proje Teslim Kontrol Listesi

```bash
pnpm audit:licenses
aifs audit
pnpm build
node scripts/check-budget.js <workflow>
```
