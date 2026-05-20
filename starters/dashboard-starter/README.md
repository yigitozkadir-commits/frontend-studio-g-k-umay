# 📊 Dashboard Starter

`dashboard` workflow'undan türetilmiş admin dashboard örneği.

## İçerik

- Next.js 14 + Tailwind + shadcn/ui
- TanStack Table (sıralama, sayfalama, virtual scroll)
- Recharts gerçek zamanlı grafikler
- TanStack Query veri katmanı
- NextAuth.js v5 kimlik doğrulama
- Drizzle ORM + Postgres
- Cmd+K command palette (`components/command-palette.tsx`)

## Çalıştırma

```bash
pnpm install
cp .env.example .env.local   # DATABASE_URL ve NEXTAUTH_SECRET ekle
pnpm db:push
pnpm dev
```

## Workflow

Detaylar: `orchestration/workflows/dashboard.json`
