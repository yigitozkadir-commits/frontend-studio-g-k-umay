# ai-chat-starter

`ai-chat` workflow'undan türetilmiş tam çalışan örnek.

## Quickstart

```bash
pnpm install
cp .env.example .env.local   # OPENAI_API_KEY ekle
pnpm dev
```

## Yapı

```
ai-chat-starter/
├── app/
│   ├── api/chat/route.ts    # Streaming endpoint
│   ├── page.tsx             # Chat UI
│   └── layout.tsx
├── components/Chat.tsx
└── WORKFLOW.md              # Adım adım yapım rehberi
```

## Workflow

Detaylar için [WORKFLOW.md](./WORKFLOW.md).
