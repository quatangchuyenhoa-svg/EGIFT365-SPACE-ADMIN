# Sanity Dataset Migration Guide

## Overview

Automated system for copying all documents from `production` dataset to `dev` dataset with safety backups and verification.

**Purpose:** Backup/restore testing for disaster recovery scenarios

---

## Quick Start

### Prerequisites

1. Sanity CLI installed globally
2. Authenticated with Sanity account
3. Write access to Sanity project

### Run Migration

```bash
cd /Applications/WorkSpace/egift-space/egift-admin

# Run migration (requires --confirm flag)
./scripts/migrate-dataset.sh --confirm

# Verify success
./scripts/verify-migration.sh
```

**Expected time:** 5-10 minutes (depending on dataset size)

---

## What Happens During Migration

```
1. ✅ Pre-flight checks (CLI installed, authenticated, disk space)
2. 💾 Backup dev dataset → backups/dev-backup-TIMESTAMP.tar.gz
3. 📤 Export production → backups/production-TIMESTAMP.tar.gz
4. 📥 Import production to dev (OVERWRITES existing dev data)
5. ✔️  Run verification checks
6. 📊 Display summary and rollback instructions
```

**Timeline:**
- Backup dev: ~30 seconds
- Export production: ~1-2 minutes
- Import to dev: ~2-3 minutes
- Verification: ~10 seconds

---

## Safety Measures

### Automatic Backups

Before overwriting dev dataset, script **automatically creates backup**:
- Location: `backups/dev-backup-TIMESTAMP.tar.gz`
- Can rollback if migration fails
- Kept indefinitely (manual cleanup)

### Confirmation Required

Script WILL NOT run without `--confirm` flag:
```bash
# ❌ FAILS - no confirmation
./scripts/migrate-dataset.sh

# ✅ RUNS - explicit confirmation
./scripts/migrate-dataset.sh --confirm
```

### Verification Checks

Post-migration validation ensures:
- ✅ Document counts match (production == dev)
- ✅ siteSettings exists in dev
- ✅ API returns dev data (if client running)
- ✅ No broken references

---

## Emergency Rollback

If migration fails or produces unexpected results:

```bash
# 1. List available dev backups
./scripts/rollback-dataset.sh --list

# 2. Choose most recent backup and restore
./scripts/rollback-dataset.sh --restore backups/dev-backup-20241231-0945.tar.gz

# 3. Verify restoration
./scripts/verify-migration.sh
```

**Rollback time:** ~2-3 minutes

---

## Scripts Reference

### migrate-dataset.sh

**Purpose:** Main migration automation

**Usage:**
```bash
./scripts/migrate-dataset.sh --confirm
```

**Flags:**
- `--confirm` - Required. Confirms destructive operation.

**Logs to:** `logs/migration-TIMESTAMP.log`

**What it does:**
1. Verify prerequisites (CLI, auth, disk space)
2. Backup dev dataset
3. Export production dataset
4. Import to dev (OVERWRITES)
5. Run verification
6. Log all operations

---

### rollback-dataset.sh

**Purpose:** Emergency restore dev from backup

**Usage:**
```bash
# List backups
./scripts/rollback-dataset.sh --list

# Restore from backup
./scripts/rollback-dataset.sh --restore <backup-file.tar.gz>
```

**Example:**
```bash
./scripts/rollback-dataset.sh --restore backups/dev-backup-20241231-0945.tar.gz
```

**Logs to:** `logs/rollback-TIMESTAMP.log`

**What it does:**
1. Verify backup file exists
2. Confirm destructive operation (prompts user)
3. Import backup to dev (OVERWRITES)
4. Run verification
5. Log results

---

### verify-migration.sh

**Purpose:** Validate migration success

**Usage:**
```bash
./scripts/verify-migration.sh
```

**No flags required - safe to run anytime**

**Checks:**
1. Document count match (production == dev)
2. siteSettings exists in dev
3. API endpoint responding (optional)

**Exit codes:**
- `0` - All checks passed
- `1` - One or more checks failed

---

## Troubleshooting

### Issue: "Sanity CLI not found"

**Solution:**
```bash
npm install -g @sanity/cli
sanity --version
```

---

### Issue: "Not authenticated"

**Solution:**
```bash
sanity login
# Opens browser for authentication
```

---

### Issue: "Insufficient disk space"

**Solution:**
```bash
# Clean old backups
cd backups/
ls -t dev-backup-*.tar.gz | tail -n +6 | xargs rm -f

# Check space
df -h .
```

---

### Issue: "Document count mismatch"

**Possible causes:**
- Migration interrupted mid-way
- Drafts not included (expected)
- Data changed during export

**Solution:**
```bash
# Re-run migration
./scripts/migrate-dataset.sh --confirm

# Or rollback and investigate
./scripts/rollback-dataset.sh --list
./scripts/rollback-dataset.sh --restore <backup>
```

---

### Issue: "API returns old data"

**Possible causes:**
- Client not restarted
- CDN cache (should be disabled)
- Wrong dataset in client .env.local

**Solution:**
```bash
# 1. Restart egift-client
cd /Applications/WorkSpace/egift-space/egift-client
npm run dev

# 2. Verify client dataset
cat .env.local | grep SANITY_DATASET
# Should be: NEXT_PUBLIC_SANITY_DATASET=dev

# 3. Hard refresh browser (Cmd+Shift+R)
```

---

## Best Practices

### Before Migration

1. ✅ Verify client not making critical writes to dev
2. ✅ Check disk space (need ~2x dataset size)
3. ✅ Notify team (dev dataset will be overwritten)

### After Migration

1. ✅ Run verification script
2. ✅ Test API endpoint returns dev data
3. ✅ Check logs for any warnings
4. ✅ Keep backup for at least 7 days

### Backup Retention

- Keep last 7 dev backups (rolling)
- Delete backups older than 30 days
- Archive critical production exports

### Automation (Optional)

Can schedule regular syncs via cron:

```bash
# Add to crontab - daily at 3am
0 3 * * * cd /Applications/WorkSpace/egift-space/egift-admin && ./scripts/migrate-dataset.sh --confirm >> logs/cron-migration.log 2>&1
```

**Note:** Ensure `--confirm` is safe for unattended execution.

---

## FAQ

### Q: Does migration copy assets (images, files)?

**A:** No. Sanity assets are stored in CDN, not in dataset. Migration copies document **references** to assets, but files remain in original project. Dev dataset will reference production assets (OK for testing).

### Q: Are draft documents included?

**A:** Yes. Drafts are exported with `drafts.` prefix. Published versions also included. Can filter during import if needed.

### Q: Can I migrate specific document types only?

**A:** Not with these scripts (full dataset migration). For selective sync, see brainstorm report section "Alternative: Incremental Sync".

### Q: What if migration fails mid-way?

**A:** Dev dataset backup is created BEFORE import. Use rollback script to restore. Check logs for failure reason.

### Q: Can I rollback production?

**A:** NO. These scripts only backup/restore **dev** dataset. Production is source dataset (read-only in this workflow).

---

## Additional Resources

- Brainstorm report: `plans/reports/brainstorm-251231-0944-sanity-dataset-migration.md`
- Implementation plan: `plans/251231-sanity-dataset-migration/plan.md`
- [Sanity CLI Documentation](https://www.sanity.io/docs/cli)
- [Dataset Export/Import Guide](https://www.sanity.io/docs/export-import)

---

**Last Updated:** 2025-12-31
**Maintainer:** Engineering Team
