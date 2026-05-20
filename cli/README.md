# AI Frontend Studio CLI

```bash
npx @ai-frontend-studio/cli create my-app --workflow ai-chat
```

## Kurulum

```bash
# Global
npm install -g @ai-frontend-studio/cli

# veya npx ile direkt kullan
npx aifs create my-app
```

## Komutlar

### `aifs create <proje-adi>`
Yeni proje oluşturur. Next.js kurulumu, paket yükleme ve workflow rehberi otomatik oluşturulur.

```bash
aifs create my-chat-app --workflow ai-chat
aifs create my-site --workflow landing-page --package-manager npm
aifs create my-dash --workflow dashboard --skip-install
```

**Seçenekler:**
- `-w, --workflow` — Workflow seç (yoksa interaktif menü açılır)
- `-p, --package-manager` — pnpm (varsayılan), npm, yarn
- `--skip-install` — Paket kurulumunu atla
- `--skip-git` — Git başlatmayı atla

### `aifs list`
Workflow, kategori ve araçları listeler.

```bash
aifs list --workflows      # Tüm workflow'lar
aifs list --categories     # Tüm kategoriler
aifs list --tools animasyonlar  # Kategorideki araçlar
```

### `aifs budget <workflow>`
Bundle bütçe raporu gösterir.

```bash
aifs budget dashboard
aifs budget landing-page
```

### `aifs deps <workflow>`
Tek komutluk bağımlılık listesi.

```bash
aifs deps ai-chat
# Çıktı: pnpm add framer-motion ai sonner localforage next-themes lucide-react
```

## Proje Oluşturma Çıktısı

```
my-app/
├── WORKFLOW.md          ← Adım adım rehber (checklistli)
├── .env.local.example   ← Ortam değişkeni şablonu
├── src/
│   ├── app/
│   └── components/
└── ...
```
