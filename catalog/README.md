# 🎨 Visual Catalog (v4)

Storybook benzeri görsel katalog. Tüm components/* ve snippets/* için canlı
önizleme, prop dokümantasyonu ve kopyala-yapıştır kullanım örnekleri sunar.

## Çalıştırma

```bash
cd catalog
pnpm install
pnpm dev
# http://localhost:6006 (Storybook konvansiyonu)
```

İlk çalıştırmada `pnpm storybook init` zaten yapılmıştır; `*.stories.tsx`
dosyaları her component için otomatik üretilir.

## Yapı

```
catalog/
├── .storybook/
│   ├── main.ts        # Storybook 8 config
│   └── preview.tsx    # Tailwind + tema provider
├── stories/
│   ├── AuthForm.stories.tsx
│   ├── DataTable.stories.tsx
│   ├── CommandPalette.stories.tsx
│   ├── HeroSection.stories.tsx
│   ├── DashboardSidebar.stories.tsx
│   ├── PricingTable.stories.tsx
│   └── TestimonialGrid.stories.tsx
└── package.json
```

> Storybook çıktısı CI'da `pnpm build-storybook` ile statik site olarak
> üretilir ve GitHub Pages'e deploy edilir (`.github/workflows/storybook.yml`).
