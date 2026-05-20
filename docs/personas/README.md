# 👤 Persona Rehberi

AI Frontend Studio 4 farklı giriş noktası sunar (CLI / Wizard / MCP / Generator). Hangisini ne zaman kullanacağınız personanıza göre değişir.

---

## 🧑‍💻 Solo Developer

> **Profil**: Tek başına kişisel/yan proje geliştiren developer.

**Önerilen akış**:
```bash
npx @ai-frontend-studio/cli create my-app --workflow ai-chat
cd my-app
pnpm dev
```

**Neden CLI?** Hızlı, kararlı bir varsayılan stack ile başlamak istiyorsun. Wizard'ın soru-cevap akışına bile gerek yok.

**Öneri workflow'ları**: `ai-chat`, `landing-page`, `pwa`

---

## 🎨 Agency / Studio

> **Profil**: Müşteri projeleri yapan ajans/stüdyo. Tutarlılık ve marka standardı kritik.

**Önerilen akış**:
```bash
npx @ai-frontend-studio/cli create client-x \
  --workflow dashboard \
  --strict \
  --persona agency
```

**Neden strict mode?** Tüm projelerde aynı paket yöneticisi (pnpm), aynı Node sürümü, aynı scaffold yapısı.

**Öneri workflow'ları**: `dashboard`, `landing-page`, `headless-cms`, `figma-to-code`

---

## 🤖 Claude Code User

> **Profil**: Kod yazımının çoğunu Claude Code ile yapan developer.

**Önerilen akış**:
```bash
cd mcp-server && pnpm install && pnpm build
claude mcp add aifs node /path/to/mcp-server/dist/index.js
```

Sonra Claude Code'da doğal dilde konuş:
- *"ai-chat workflow'unu başlat"*
- *"Bu projeye en uygun state yöneticisini öner"*
- *"dashboard workflow'unu doğrula"*

**Neden MCP?** Claude Code 13 native tool ile workflow seçimi, kod üretimi ve doğrulamayı tek seferde yapabiliyor.

**Yeni v4 tool'ları**: `recommend_tools`, `validate_workflow`.

---

## ⚡ Rapid Prototyper

> **Profil**: Hackathon / demo / POC için saatlik prototip üreten developer.

**Önerilen akış**:
```bash
node ai-workflow-generator/index.js "müzik çalar uygulaması"
```

Generator açıklamandan workflow üretir, gerekçesini gösterir ve scaffold'u oluşturur.

**Neden generator?** Hazır 12 workflow yetmediğinde, açıklamadan otomatik workflow türetir. v4'te artık her adım için **selection_rationale** üretiliyor.

---

## 🏢 Enterprise

> **Profil**: Kurumsal ekip. Güvenlik, lisans, supply-chain kontrolleri zorunlu.

**Önerilen akış**:
```bash
npx @ai-frontend-studio/cli create app --strict
# CI'da otomatik çalışır:
pnpm audit
node tools/license-check/index.js
```

**Neden strict + CI?** v4'te `security.yml` workflow'u her PR'da audit + lisans + secret tarama yapıyor.
