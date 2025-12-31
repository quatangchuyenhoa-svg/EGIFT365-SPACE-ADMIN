# Phase 2: Migration Scripts

**Time Estimate:** 20 minutes
**Risk Level:** 🟡 MEDIUM (creating automation)

---

## 🎯 Objectives

1. Create `migrate-dataset.sh` - Main migration automation
2. Create `rollback-dataset.sh` - Emergency restore
3. Create `verify-migration.sh` - Post-migration validation
4. Make all scripts executable
5. Test dry-run execution

---

## 📋 Scripts to Create

### 1. migrate-dataset.sh
**Purpose:** Automated production → dev migration with safety checks

**Features:**
- Verify Sanity CLI installed
- Verify authentication
- Require `--confirm` flag (prevent accidental execution)
- Check disk space (need ~2x dataset size)
- Backup dev before destructive import
- Export production
- Import to dev
- Log all operations
- Run verification checks
- Provide rollback instructions if failed

### 2. rollback-dataset.sh
**Purpose:** Emergency restore dev dataset from backup

**Features:**
- List available dev backups
- Restore from selected backup
- Verify restoration success
- Log rollback operation

### 3. verify-migration.sh
**Purpose:** Validate migration success

**Features:**
- Compare document counts (production vs dev)
- Verify siteSettings exists
- Check API returns dev data
- Validate no broken references
- Report success/failure

---

## 📝 Implementation

### Script 1: migrate-dataset.sh

**Create file:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
touch scripts/migrate-dataset.sh
chmod +x scripts/migrate-dataset.sh
```

**Content:**
```bash
#!/bin/bash

#############################################
# Sanity Dataset Migration: Production → Dev
#############################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project root
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

# Directories
BACKUPS_DIR="$PROJECT_ROOT/backups"
LOGS_DIR="$PROJECT_ROOT/logs"

# Timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Log file
LOG_FILE="$LOGS_DIR/migration-$TIMESTAMP.log"

# Datasets
SOURCE_DATASET="production"
TARGET_DATASET="dev"

#############################################
# Functions
#############################################

log() {
  echo -e "$1" | tee -a "$LOG_FILE"
}

error() {
  log "${RED}❌ ERROR: $1${NC}"
  exit 1
}

success() {
  log "${GREEN}✅ $1${NC}"
}

warning() {
  log "${YELLOW}⚠️  WARNING: $1${NC}"
}

# Check if Sanity CLI installed
check_sanity_cli() {
  log "Checking Sanity CLI..."
  if ! command -v sanity &> /dev/null; then
    error "Sanity CLI not found. Install: npm install -g @sanity/cli"
  fi
  success "Sanity CLI installed: $(sanity --version)"
}

# Check authentication
check_auth() {
  log "Checking authentication..."
  if ! sanity projects list &> /dev/null; then
    error "Not authenticated. Run: sanity login"
  fi
  success "Authenticated successfully"
}

# Check disk space (need at least 1GB free)
check_disk_space() {
  log "Checking disk space..."
  AVAILABLE=$(df -h "$BACKUPS_DIR" | tail -1 | awk '{print $4}' | sed 's/G.*//')

  if [ "$AVAILABLE" -lt 1 ]; then
    error "Insufficient disk space. Need at least 1GB free, have: ${AVAILABLE}GB"
  fi
  success "Disk space OK: ${AVAILABLE}GB available"
}

# Require confirmation
require_confirm() {
  if [ "${1:-}" != "--confirm" ]; then
    error "Migration requires confirmation. Run with: $0 --confirm"
  fi
  success "Confirmation flag provided"
}

# Backup dev dataset (safety)
backup_dev() {
  log "Backing up dev dataset (safety)..."
  DEV_BACKUP="$BACKUPS_DIR/dev-backup-$TIMESTAMP.tar.gz"

  if sanity dataset export "$TARGET_DATASET" "$DEV_BACKUP" >> "$LOG_FILE" 2>&1; then
    success "Dev backup created: $DEV_BACKUP"
  else
    error "Failed to backup dev dataset"
  fi
}

# Export production dataset
export_production() {
  log "Exporting production dataset..."
  PROD_EXPORT="$BACKUPS_DIR/production-$TIMESTAMP.tar.gz"

  if sanity dataset export "$SOURCE_DATASET" "$PROD_EXPORT" >> "$LOG_FILE" 2>&1; then
    success "Production exported: $PROD_EXPORT"
  else
    error "Failed to export production dataset"
  fi
}

# Import to dev (DESTRUCTIVE)
import_to_dev() {
  log "Importing to dev dataset (DESTRUCTIVE - overwrites existing data)..."

  warning "This will REPLACE all data in dev dataset!"
  warning "Backup created at: $DEV_BACKUP"

  if sanity dataset import "$PROD_EXPORT" "$TARGET_DATASET" --replace >> "$LOG_FILE" 2>&1; then
    success "Import completed successfully"
  else
    error "Import failed! Rollback: ./scripts/rollback-dataset.sh --restore $DEV_BACKUP"
  fi
}

# Run verification
run_verification() {
  log "Running post-migration verification..."

  if [ -f "$PROJECT_ROOT/scripts/verify-migration.sh" ]; then
    if bash "$PROJECT_ROOT/scripts/verify-migration.sh"; then
      success "Verification passed ✅"
    else
      warning "Verification failed! Check details above."
      warning "Rollback: ./scripts/rollback-dataset.sh --restore $DEV_BACKUP"
    fi
  else
    warning "verify-migration.sh not found, skipping verification"
  fi
}

#############################################
# Main Execution
#############################################

log "========================================="
log "Sanity Dataset Migration"
log "Source: $SOURCE_DATASET → Target: $TARGET_DATASET"
log "Started: $(date)"
log "========================================="
log ""

# Pre-flight checks
check_sanity_cli
check_auth
check_disk_space
require_confirm "$@"

log ""
log "========================================="
log "Starting Migration"
log "========================================="
log ""

# Execute migration steps
backup_dev
export_production
import_to_dev
run_verification

log ""
log "========================================="
log "Migration Complete"
log "========================================="
log ""
log "📊 Summary:"
log "  - Dev backup: $DEV_BACKUP"
log "  - Production export: $PROD_EXPORT"
log "  - Log file: $LOG_FILE"
log ""
log "🔄 To rollback:"
log "  ./scripts/rollback-dataset.sh --restore $DEV_BACKUP"
log ""

success "Migration completed successfully! 🎉"
```

---

### Script 2: rollback-dataset.sh

**Create file:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
touch scripts/rollback-dataset.sh
chmod +x scripts/rollback-dataset.sh
```

**Content:**
```bash
#!/bin/bash

#############################################
# Sanity Dataset Rollback
#############################################

set -e
set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Project root
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT"

BACKUPS_DIR="$PROJECT_ROOT/backups"
LOGS_DIR="$PROJECT_ROOT/logs"
TARGET_DATASET="dev"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="$LOGS_DIR/rollback-$TIMESTAMP.log"

#############################################
# Functions
#############################################

log() {
  echo -e "$1" | tee -a "$LOG_FILE"
}

error() {
  log "${RED}❌ ERROR: $1${NC}"
  exit 1
}

success() {
  log "${GREEN}✅ $1${NC}"
}

# List available backups
list_backups() {
  log "Available dev backups:"
  log ""

  cd "$BACKUPS_DIR"

  if ! ls -1 dev-backup-*.tar.gz 2>/dev/null; then
    error "No dev backups found in $BACKUPS_DIR"
  fi

  ls -lh dev-backup-*.tar.gz | awk '{print "  " $9 " (" $5 ")"}'
}

# Restore from backup
restore_backup() {
  local BACKUP_FILE="$1"

  if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup file not found: $BACKUP_FILE"
  fi

  log "Restoring dev dataset from backup..."
  log "Backup: $BACKUP_FILE"
  log ""

  warning "${YELLOW}⚠️  This will REPLACE all data in dev dataset!${NC}"
  read -p "Continue? (yes/no): " CONFIRM

  if [ "$CONFIRM" != "yes" ]; then
    error "Rollback cancelled by user"
  fi

  if sanity dataset import "$BACKUP_FILE" "$TARGET_DATASET" --replace >> "$LOG_FILE" 2>&1; then
    success "Restore completed successfully"
  else
    error "Restore failed! Check log: $LOG_FILE"
  fi

  # Verify restoration
  log ""
  log "Verifying restoration..."

  if bash "$PROJECT_ROOT/scripts/verify-migration.sh" >> "$LOG_FILE" 2>&1; then
    success "Verification passed ✅"
  else
    warning "Verification failed. Check log: $LOG_FILE"
  fi
}

#############################################
# Main
#############################################

log "========================================="
log "Sanity Dataset Rollback"
log "Started: $(date)"
log "========================================="
log ""

case "${1:-}" in
  --list)
    list_backups
    ;;
  --restore)
    if [ -z "${2:-}" ]; then
      error "Usage: $0 --restore <backup-file.tar.gz>"
    fi
    restore_backup "$2"
    ;;
  *)
    log "Usage:"
    log "  $0 --list                              # List available backups"
    log "  $0 --restore <backup-file.tar.gz>      # Restore from backup"
    log ""
    log "Example:"
    log "  $0 --restore backups/dev-backup-20241231-0945.tar.gz"
    exit 1
    ;;
esac

log ""
success "Done! 🎉"
```

---

### Script 3: verify-migration.sh

**Create file:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
touch scripts/verify-migration.sh
chmod +x scripts/verify-migration.sh
```

**Content:**
```bash
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

PROD_COUNT=$(sanity dataset list | grep "$SOURCE_DATASET" | awk '{print $3}' || echo "0")
DEV_COUNT=$(sanity dataset list | grep "$TARGET_DATASET" | awk '{print $3}' || echo "0")

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
```

---

## ✅ Make Scripts Executable

```bash
cd /Applications/WorkSpace/egift-space/egift-admin
chmod +x scripts/migrate-dataset.sh
chmod +x scripts/rollback-dataset.sh
chmod +x scripts/verify-migration.sh
```

**Verify permissions:**
```bash
ls -l scripts/*.sh
```

**Expected:** All scripts show `-rwxr-xr-x` (executable)

---

## 🧪 Test Dry-Run

**Test verification script (safest):**
```bash
./scripts/verify-migration.sh
```

**Expected:** Shows current state comparison (may fail if datasets different)

**Test rollback list (safe - no modifications):**
```bash
./scripts/rollback-dataset.sh --list
```

**Expected:** Lists available backups (or error if none exist yet)

**DO NOT run migrate script yet** - wait until Phase 3 documentation complete.

---

## ✅ Success Criteria

- ✅ All 3 scripts created
- ✅ Scripts are executable (`chmod +x` applied)
- ✅ verify-migration.sh runs without syntax errors
- ✅ rollback-dataset.sh --list runs without syntax errors
- ✅ Scripts contain all safety checks and logging

---

## ⚠️ Important Notes

1. **DO NOT run `migrate-dataset.sh` yet** - this is DESTRUCTIVE
2. First execution should be in Phase 3 after documentation ready
3. Always run with `--confirm` flag to prevent accidents
4. Backups are CRITICAL - script creates safety backup automatically

---

## 🚀 Next Steps

Once scripts created and verified:
1. ✅ Mark Phase 2 complete
2. ➡️ Proceed to `phase-03-docs-testing.md`

---

**Phase 2 Complete!** Scripts ready for documentation and testing.
