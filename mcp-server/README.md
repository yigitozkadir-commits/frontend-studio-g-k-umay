# AI Frontend Studio — MCP Server

Claude Code ile native entegrasyon. Claude, bu server aracılığıyla workflow'ları, snippet'ları, bütçe kontrollerini ve araç aramalarını doğrudan API çağrısı ile kullanır.

## Kurulum

```bash
cd mcp-server
pnpm install
pnpm build
```

## Claude Code'a Ekleme

```bash
claude mcp add aifs node /absolute/path/to/mcp-server/dist/index.js
```

Veya `~/.claude/claude_desktop_config.json` dosyasına:

```json
{
  "mcpServers": {
    "ai-frontend-studio": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"]
    }
  }
}
```

## Kullanılabilir Tool'lar

| Tool | Açıklama |
|---|---|
| `list_workflows` | Tüm workflow'ları listeler |
| `get_workflow` | Workflow adımlarını döner |
| `get_tool` | ID veya isimle araç arar |
| `search_tools` | Tag/kategori ile araç arar |
| `get_snippet` | Hazır kod snippet'i döner |
| `get_component` | UI bileşeni kaynak kodu döner |
| `check_budget` | Bundle bütçe kontrolü |
| `get_compatibility` | Versiyon uyumluluk bilgisi |
| `get_troubleshooting` | Hata çözüm rehberi |
| `get_alternatives` | Araç alternatifleri |
| `resolve_deps` | Tam bağımlılık listesi |

## Örnek Kullanım (Claude Code'da)

```
"ai-chat workflow'unu başlat"
→ Claude: get_workflow("ai-chat") çağırır, adımları sırayla uygular

"GSAP için snippet ver"
→ Claude: get_snippet("gsap") çağırır, kodu projeye ekler

"dashboard için bundle bütçesi nedir?"
→ Claude: check_budget("dashboard") çağırır, raporu gösterir
```
