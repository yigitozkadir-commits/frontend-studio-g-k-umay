# 👤 Solo Developer Persona

> Tek başına kişisel/yan proje geliştiren developer.

## Önerilen Giriş Noktası: CLI

```bash
npx @ai-frontend-studio/cli create my-app --workflow ai-chat
cd my-app
pnpm dev
```

## Ne Zaman Hangi Workflow?

| Hedef | Workflow |
|---|---|
| Chatbot / AI arayüz | `ai-chat` |
| Ürün tanıtım sitesi | `landing-page` |
| Offline-first uygulama | `pwa` |

## Tipik Akış

1. `aifs create` → scaffold oluşur
2. `aifs doctor` → Node, pnpm, .env kontrol
3. `pnpm dev` → geliştir
4. `aifs audit` → deploy öncesi bütünlük kontrolü

## İpuçları

- `--strict` bayrağı pnpm'i zorunlu kılar, lock-file karmaşasını önler
- Wizard'a gerek yok — CLI varsayılan stack ile 30 saniyede başlatır
