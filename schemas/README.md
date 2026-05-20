# 📐 Schemas (v4)

JSON Schema (draft-07) tabanlı doğrulama dosyaları. Bunlar PR aşamasında CI
tarafından çalıştırılır — bozuk workflow veya tool kaydı `main`'e merge edilemez.

| Schema | Doğrulanan Dosyalar |
|---|---|
| `workflow.schema.json` | `orchestration/workflows/*.json` |
| `tool.schema.json`     | `orchestration/index.json` öğeleri |
| `category.schema.json` | `orchestration/categories.json` öğeleri |

## Çalıştırma

```bash
# Tüm şemaları doğrula
node scripts/validate-schemas.js

# Tek bir workflow
node scripts/validate-schemas.js orchestration/workflows/ai-chat.json
```

## Programatik kullanım (Zod)

`packages/shared/src/schemas.ts` içinde aynı şemaların Zod karşılıkları yer alır.
Bu sayede MCP server ve CLI tip güvenliği ile aynı kuralları çalıştırır:

```ts
import { WorkflowSchema } from '@ai-frontend-studio/shared/schemas';
const result = WorkflowSchema.safeParse(json);
if (!result.success) console.error(result.error.format());
```
