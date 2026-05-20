#!/bin/bash

# =============================================================================
# AI Frontend Studio — Bağımlılık Çözümleyici
# Kullanım: ./scripts/resolve-deps.sh <workflow-adi>
# Örnek:    ./scripts/resolve-deps.sh ai-chat
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
INDEX_FILE="$ROOT_DIR/orchestration/index.json"
WORKFLOWS_DIR="$ROOT_DIR/orchestration/workflows"

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ---- Yardım mesajı ----
usage() {
  echo -e "${BLUE}Kullanım:${NC} $0 <workflow-adi>"
  echo ""
  echo "Mevcut workflow'lar:"
  for f in "$WORKFLOWS_DIR"/*.json; do
    name=$(basename "$f" .json)
    echo "  - $name"
  done
  exit 1
}

# ---- Argüman kontrolü ----
if [ -z "$1" ]; then
  usage
fi

WORKFLOW_NAME="$1"
WORKFLOW_FILE="$WORKFLOWS_DIR/$WORKFLOW_NAME.json"

if [ ! -f "$WORKFLOW_FILE" ]; then
  echo -e "${RED}Hata:${NC} '$WORKFLOW_NAME' workflow'u bulunamadı."
  usage
fi

# ---- jq kontrolü ----
if ! command -v jq &> /dev/null; then
  echo -e "${YELLOW}Uyarı:${NC} 'jq' kurulu değil. Kurulum: brew install jq / apt install jq"
  exit 1
fi

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE} AI Frontend Studio — Bağımlılık Çözümleyici${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "Workflow: ${GREEN}$WORKFLOW_NAME${NC}"
echo ""

# ---- Tool ID'lerini çek ----
TOOL_IDS=$(jq -r '.steps[].tool_id' "$WORKFLOW_FILE")
RELATED_IDS=$(jq -r '.steps[].related_tool_id // empty' "$WORKFLOW_FILE")
ALL_IDS=$(echo -e "$TOOL_IDS\n$RELATED_IDS" | sort -u | grep -v '^$')

echo -e "${YELLOW}📦 Gerekli Paketler:${NC}"
echo ""

INSTALL_COMMANDS=()
PEER_DEPS=()

while IFS= read -r tool_id; do
  if [ -z "$tool_id" ]; then continue; fi

  # index.json'dan araç bilgisini çek
  tool_data=$(jq -r --argjson id "$tool_id" '.[] | select(.id == $id)' "$INDEX_FILE")

  if [ -z "$tool_data" ]; then
    echo -e "  ${RED}✗ ID $tool_id bulunamadı${NC}"
    continue
  fi

  name=$(echo "$tool_data" | jq -r '.name')
  install_cmd=$(echo "$tool_data" | jq -r '.install_command // "null"')
  peers=$(echo "$tool_data" | jq -r '.peer_dependencies[]? // empty')
  priority=$(echo "$tool_data" | jq -r '.priority')

  priority_color=$NC
  if [ "$priority" = "high" ]; then priority_color=$GREEN; fi
  if [ "$priority" = "medium" ]; then priority_color=$YELLOW; fi
  if [ "$priority" = "low" ]; then priority_color=$RED; fi

  echo -e "  [${priority_color}$priority${NC}] ${BLUE}$name${NC}"

  if [ "$install_cmd" != "null" ]; then
    echo -e "         → $install_cmd"
    INSTALL_COMMANDS+=("$install_cmd")
  else
    echo -e "         → (kurulum gerekmez)"
  fi

  while IFS= read -r peer; do
    if [ -n "$peer" ]; then
      PEER_DEPS+=("$peer")
    fi
  done <<< "$peers"

  echo ""
done <<< "$ALL_IDS"

# ---- Peer bağımlılıkları ----
if [ ${#PEER_DEPS[@]} -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Peer Bağımlılıkları (önceden kurulu olmalı):${NC}"
  printf '%s\n' "${PEER_DEPS[@]}" | sort -u | while read -r dep; do
    echo "  - $dep"
  done
  echo ""
fi

# ---- Toplu kurulum komutu ----
echo -e "${GREEN}🚀 Toplu Kurulum Komutu:${NC}"
echo ""

PKG_LIST=""
for cmd in "${INSTALL_COMMANDS[@]}"; do
  pkgs=$(echo "$cmd" | sed 's/^npm install //' | sed 's/^npx [^ ]* //' | sed 's/^cargo install //' | sed 's/^pip install //')
  # Sadece npm install olanları al
  if echo "$cmd" | grep -q "^npm install"; then
    PKG_LIST="$PKG_LIST $pkgs"
  fi
done

if [ -n "$PKG_LIST" ]; then
  echo -e "  ${BLUE}pnpm add$PKG_LIST${NC}"
else
  echo "  (npm dışı kurulum adımları mevcut, yukarıdaki komutları tek tek çalıştırın)"
fi

echo ""

# ---- Test listesi ----
echo -e "${YELLOW}✅ Test Kontrol Listesi:${NC}"
jq -r '.test_checklist[]' "$WORKFLOW_FILE" | while IFS= read -r item; do
  echo "  [ ] $item"
done

echo ""
echo -e "${GREEN}Toplam adım:${NC} $(jq '.steps | length' "$WORKFLOW_FILE")"
echo -e "${GREEN}Tahmini süre:${NC} $(jq -r '.estimated_time // "Belirtilmemiş"' "$WORKFLOW_FILE")"
echo ""
