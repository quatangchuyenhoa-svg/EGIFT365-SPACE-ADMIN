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

warning() {
  log "${YELLOW}⚠️  WARNING: $1${NC}"
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
