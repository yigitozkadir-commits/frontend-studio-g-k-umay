# ⚡ Rapid Prototyper Persona

> Hackathon / demo / POC için saatlik prototip üreten developer.

## Önerilen Giriş Noktası: AI Workflow Generator

```bash
node ai-workflow-generator/index.js "müzik çalar uygulaması"
```

Generator şunları üretir:
1. En uygun workflow'u seçer (veya yeni türetir)
2. Her adım için `selection_rationale` açıklar
3. Scaffold oluşturur

## Alternatif: Wizard

```bash
node wizard/index.js
```

## Hız Tablosu

| Yöntem | Kurulum | İlk `pnpm dev` |
|---|---|---|
| CLI (bilinen workflow) | ~30 sn | ~2 dk |
| Wizard | ~2 dk | ~3 dk |
| Generator (doğal dil) | ~1 dk | ~3 dk |

## İpuçları

- 12 hazır workflow yetmiyorsa generator kullan
- Scaffold sonrası `aifs doctor` ile sağlık taraması yap
- `.env.example` → `.env.local` kopyalamayı unutma
