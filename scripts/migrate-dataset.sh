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
  success "Sanity CLI installed: $(sanity --version | head -1)"
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
