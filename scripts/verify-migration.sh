#!/bin/bash

#############################################
# Sanity Dataset Migration Verification
#############################################

set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Project root
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

SOURCE_DATASET="production"
TARGET_DATASET="dev"

FAILED=0

#############################################
# Functions
#############################################

log() {
  echo -e "$1"
}

pass() {
  log "${GREEN}✅ PASS:${NC} $1"
}

fail() {
  log "${RED}❌ FAIL:${NC} $1"
  FAILED=$((FAILED + 1))
}

#############################################
# Verification Checks
#############################################

log "========================================="
log "Migration Verification"
log "========================================="
log ""

# Check 1: Compare document counts
log "1️⃣ Checking document counts..."

PROD_COUNT=$(sanity documents query 'count(*)' --dataset "$SOURCE_DATASET" 2>/dev/null | head -1 || echo "0")
DEV_COUNT=$(sanity documents query 'count(*)' --dataset "$TARGET_DATASET" 2>/dev/null | head -1 || echo "0")

log "   Production: $PROD_COUNT documents"
log "   Dev: $DEV_COUNT documents"

if [ "$PROD_COUNT" -eq "$DEV_COUNT" ]; then
  pass "Document counts match ($PROD_COUNT == $DEV_COUNT)"
else
  fail "Document count mismatch! Production: $PROD_COUNT, Dev: $DEV_COUNT"
fi

log ""

# Check 2: Verify siteSettings exists
log "2️⃣ Checking siteSettings document..."

SITE_SETTINGS_COUNT=$(sanity documents query 'count(*[_type == "siteSettings"])' --dataset "$TARGET_DATASET" 2>/dev/null || echo "0")

if [ "$SITE_SETTINGS_COUNT" -gt 0 ]; then
  pass "siteSettings exists in dev dataset"
else
  fail "siteSettings not found in dev dataset!"
fi

log ""

# Check 3: Check if API returns dev data (optional - requires client running)
log "3️⃣ Checking API endpoint (optional)..."

if command -v curl &> /dev/null; then
  API_RESPONSE=$(curl -s http://localhost:3001/api/theme 2>/dev/null || echo "")

  if [ -n "$API_RESPONSE" ]; then
    if echo "$API_RESPONSE" | grep -q "success"; then
      pass "API endpoint responding"
    else
      fail "API returned unexpected response"
    fi
  else
    log "${YELLOW}⚠️  SKIP:${NC} API not reachable (client not running?)"
  fi
else
  log "${YELLOW}⚠️  SKIP:${NC} curl not installed"
fi

log ""

#############################################
# Summary
#############################################

log "========================================="
log "Verification Summary"
log "========================================="
log ""

if [ $FAILED -eq 0 ]; then
  log "${GREEN}✅ All checks passed! Migration successful.${NC}"
  exit 0
else
  log "${RED}❌ $FAILED check(s) failed. Migration may have issues.${NC}"
  log ""
  log "Recommended action:"
  log "  ./scripts/rollback-dataset.sh --list"
  log "  ./scripts/rollback-dataset.sh --restore <backup-file>"
  exit 1
fi
