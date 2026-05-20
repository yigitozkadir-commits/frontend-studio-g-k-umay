# 🤖 Claude Code User Persona

> Kod yazımının çoğunu Claude Code ile yapan developer. MCP üzerinden doğal dil kullanır.

## Kurulum

```bash
cd mcp-server
pnpm install && pnpm build
claude mcp add aifs node /absolute/path/to/mcp-server/dist/index.js
```

## 13 Native MCP Tool

| Tool | Ne Yapar |
|---|---|
| `list_workflows` | Mevcut 12 workflow'u listeler |
| `get_workflow` | Seçili workflow'un adım adım talimatlarını verir |
| `get_tool` | id veya isme göre araç detayı |
| `search_tools` | Sorgu/kategori/öncelik ile araç arama |
| `recommend_tools` | Proje kısıtlarına göre öncelikli araç listesi |
| `validate_workflow` | Workflow JSON bütünlüğü ve tool_id kontrolü |
| `check_budget` | Workflow bundle tahmini vs hedef |
| `get_snippet` | Kod snippet'i getir (gsap, framer-motion, lenis…) |
| `get_component` | Component kaynak kodunu getir |
| `get_compatibility` | Stack uyumluluk raporu |
| `get_troubleshooting` | Araç bazlı hata çözüm rehberi |
| `get_alternatives` | Bir araç için alternatif önerileri |
| `resolve_deps` | Workflow için tek satır install komutu |

## Gerçek Kullanım Örnekleri

**Workflow başlatmak:**
> *"dashboard workflow'unu başlat, Next.js ve TypeScript strict kullan"*

```
get_workflow(name: "dashboard")
→ 7 adımlı kurulum talimatı, her adım için install komutu ve beklenen çıktı
```

**Araç önermek:**
> *"Bu projeye en uygun state yöneticisini öner, bundle küçük olsun"*

```
recommend_tools(category: "state-yonetimi", prioritize_bundle: true, limit: 3)
→ 1. zustand  — 87/100 (Düşük bundle 3KB gzip. Aktif bakım.)
   2. jotai   — 81/100
   3. valtio  — 76/100
```

**Workflow doğrulamak:**
> *"landing-page workflow'unu deploy öncesi kontrol et"*

```
validate_workflow(workflow: "landing-page")
→ ✅ landing-page geçerli (6 adım).
```

**Bundle bütçesi:**
> *"3d-scene workflow'u ne kadar KB tutar?"*

```
check_budget(workflow: "3d-scene")
→ three.js: 168KB | @react-three/fiber: 38KB | @react-three/drei: 45KB
  Toplam: 251KB | Hedef: 800KB ✅ BÜTÇE İÇİNDE
```
