# ♟️ Chess Starter

Timurlenko satranç UI'ı - Next.js + React + TypeScript + Tailwind CSS

## 🚀 Başlangıç

```bash
# Bağımlılıkları yükle
pnpm install

# Dev sunucusu başlat
pnpm dev

# Tarayıcıda aç
# http://localhost:3000
```

## 📦 Proje Yapısı

```
app/
├── layout.tsx          # Root layout + metadata
├── page.tsx            # Main game page
└── globals.css         # Global styles

components/
├── Game.tsx            # Ana oyun komponenti
├── ChessBoard.tsx      # Satranç tahtası
├── GameControls.tsx    # Oyun kontrol paneli
├── MoveHistory.tsx     # Hamle geçmişi
└── __tests__/          # Component tests

hooks/
├── useGame.ts          # Oyun state yönetimi
└── useChessEngine.ts   # Chess.js wrapper

lib/
└── gameUtils.ts        # Yardımcı fonksiyonlar
```

## 🎮 Özellikler

- ✅ Canlı 2 oyunculu oyun
- ✅ Hamle validasyonu (Chess.js)
- ✅ Hamle geçmişi ve navigasyonu
- ✅ Checkmate/Stalemate tespiti
- ✅ Dark mode desteği
- ✅ Responsive design (mobile uyumlu)
- ✅ TypeScript + Jest testleri

## 📝 Komutlar

```bash
# Development
pnpm dev

# Build production
pnpm build
pnpm start

# Testler
pnpm test
pnpm test:watch

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🧪 Testing

```bash
pnpm test              # Tüm testleri çalıştır
pnpm test:watch       # Watch mode
```

Coverage: `pnpm test --coverage`

## 🎨 Styling

- Tailwind CSS teması `tailwind.config.ts` ile özelleştirilebilir
- Dark mode: `NEXT_PUBLIC_ENABLE_DARK_MODE=true` (.env.local)
- Satranç tahtası renkleri: `chess-light` (#f0d9b5), `chess-dark` (#b58863)

## 📚 Kaynaklar

- [Chess.js Documentation](https://github.com/jhlywa/chess.js)
- [React Chessboard](https://react-chessboard.squarely.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

MIT - Frontend Studio v4.0
