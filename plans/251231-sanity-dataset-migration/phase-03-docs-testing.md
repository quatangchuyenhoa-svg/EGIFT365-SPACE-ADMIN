# Phase 3: Documentation & Testing

**Time Estimate:** 15 minutes
**Risk Level:** 🟡 MEDIUM (first actual migration)

---

## 🎯 Objectives

1. Create `backups/README.md` - Backup management guide
2. Create `docs/DATASET_MIGRATION.md` - User documentation
3. Run dry-run test (export only, no import)
4. Execute actual migration with `--confirm`
5. Verify migration success
6. Document results

---

## 📋 Documentation Files

### 1. backups/README.md

**Create file:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
touch backups/README.md
```

**Content:**
```markdown
# Sanity Dataset Backups

This directory stores backup files from Sanity dataset exports.

## File Naming Convention

```
dev-backup-YYYYMMDD-HHMMSS.tar.gz        # Dev dataset safety backups
production-YYYYMMDD-HHMMSS.tar.gz       # Production dataset exports
```

## Backup Retention Policy

### Recommended Retention

- **Dev backups:** Keep last 7 (rolling)
- **Production backups:** Keep weekly for 4 weeks
- **Monthly archives:** Keep for 6 months

### Cleanup Old Backups

```bash
# Keep only last 5 dev backups
cd backups/
ls -t dev-backup-*.tar.gz | tail -n +6 | xargs rm -f

# Keep only last 5 production exports
ls -t production-*.tar.gz | tail -n +6 | xargs rm -f
```

## Disk Space Management

Backups can be large (100MB+). Monitor disk usage:

```bash
# Check backup directory size
du -sh backups/

# Check disk space
df -h .
```

## Security

⚠️ **IMPORTANT:**
- Backups contain ALL project data
- Do NOT commit to git (.gitignore excludes *.tar.gz)
- Store securely if data is sensitive
- Consider encryption for production backups

## Restore from Backup

See `docs/DATASET_MIGRATION.md` for restore instructions.

Quick reference:
```bash
# List available backups
./scripts/rollback-dataset.sh --list

# Restore dev from backup
./scripts/rollback-dataset.sh --restore backups/dev-backup-20241231-0945.tar.gz
```

## Automated Cleanup (Optional)

Add to cron for automatic cleanup:

```bash
# Add to crontab (run weekly on Sunday 2am)
0 2 * * 0 cd /Applications/WorkSpace/egift-space/egift-admin/backups && ls -t dev-backup-*.tar.gz | tail -n +8 | xargs rm -f
```

## Troubleshooting

### Backup failed: "Disk space exhausted"
- Free up space: Delete old backups
- Check: `df -h`

### Backup file corrupt
- Verify file integrity: `gzip -t backup-file.tar.gz`
- Re-export from Sanity if needed

---

**Last Updated:** 2025-12-31
```

---

### 2. docs/DATASET_MIGRATION.md

**Create file:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
touch docs/DATASET_MIGRATION.md
```

**Content:**
```markdown
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
- [Sanity CLI Documentation](https://www.sanity.io/docs/cli)
- [Dataset Export/Import Guide](https://www.sanity.io/docs/export-import)

---

**Last Updated:** 2025-12-31
**Maintainer:** Engineering Team
```

---

## 🧪 Dry-Run Test (Export Only)

**Purpose:** Test export functionality without destructive import

**Steps:**

1. **Navigate to project:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
```

2. **Export dev manually (dry-run):**
```bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
sanity dataset export dev backups/dev-dryrun-$TIMESTAMP.tar.gz
```

3. **Verify export created:**
```bash
ls -lh backups/dev-dryrun-*.tar.gz
```

**Expected:** Backup file created, size > 0 bytes

4. **Test gzip integrity:**
```bash
gzip -t backups/dev-dryrun-*.tar.gz && echo "✅ Backup file valid"
```

5. **Clean up dry-run:**
```bash
rm backups/dev-dryrun-*.tar.gz
```

---

## 🚀 Execute Actual Migration

**⚠️ WARNING: This will OVERWRITE dev dataset!**

**Pre-migration checklist:**
- [ ] Documentation complete
- [ ] Dry-run test passed
- [ ] Team notified
- [ ] Disk space verified (at least 1GB free)
- [ ] Client not making critical writes to dev

**Execute migration:**

```bash
cd /Applications/WorkSpace/egift-space/egift-admin

# Run migration
./scripts/migrate-dataset.sh --confirm
```

**Monitor output for:**
- ✅ All pre-flight checks pass
- ✅ Dev backup created
- ✅ Production export successful
- ✅ Import completed
- ✅ Verification passed

**Check log file:**
```bash
# View most recent migration log
tail -50 logs/migration-*.log | tail -50
```

---

## ✅ Verify Migration Success

**Run verification script:**
```bash
./scripts/verify-migration.sh
```

**Expected output:**
```
=========================================
Migration Verification
=========================================

1️⃣ Checking document counts...
   Production: 42 documents
   Dev: 42 documents
✅ PASS: Document counts match (42 == 42)

2️⃣ Checking siteSettings document...
✅ PASS: siteSettings exists in dev dataset

3️⃣ Checking API endpoint (optional)...
✅ PASS: API endpoint responding

=========================================
Verification Summary
=========================================

✅ All checks passed! Migration successful.
```

**If verification fails:**
1. Check logs: `cat logs/migration-*.log`
2. Consider rollback: `./scripts/rollback-dataset.sh --list`
3. Re-run migration if needed

---

## 📊 Post-Migration Validation

### Manual API Test

**Restart egift-client:**
```bash
cd /Applications/WorkSpace/egift-space/egift-client
# Kill existing process
pkill -f "next dev"
# Start fresh
npm run dev
```

**Test API endpoint:**
```bash
curl http://localhost:3001/api/theme | jq '{
  source: .source,
  buttonColor: .adminColors.buttonPrimaryBg,
  totalTokens: .meta.totalTokens
}'
```

**Expected:**
```json
{
  "source": "sanity",
  "buttonColor": "#XXXXXX",  // Should match production colors
  "totalTokens": 48
}
```

### Browser Test

1. Open http://localhost:3001
2. Open DevTools → Console
3. Check for: `✅ Theme loaded successfully`
4. Verify colors match production

---

## 📝 Document Results

**Create migration report:**

```bash
cd /Applications/WorkSpace/egift-space/egift-admin

cat > plans/251231-sanity-dataset-migration/migration-report.md << 'EOF'
# Migration Execution Report

**Date:** $(date)
**Status:** ✅ SUCCESS / ❌ FAILED

## Execution Summary

- **Started:** [TIME]
- **Completed:** [TIME]
- **Duration:** [X minutes]

## Dataset Statistics

- **Production documents:** [COUNT]
- **Dev documents (before):** [COUNT]
- **Dev documents (after):** [COUNT]

## Backups Created

- Dev backup: `backups/dev-backup-YYYYMMDD-HHMMSS.tar.gz` ([SIZE])
- Production export: `backups/production-YYYYMMDD-HHMMSS.tar.gz` ([SIZE])

## Verification Results

- [ ] Document counts match
- [ ] siteSettings exists
- [ ] API returns dev data

## Issues Encountered

[None / List any issues]

## Rollback Information

If rollback needed:
```bash
./scripts/rollback-dataset.sh --restore backups/dev-backup-YYYYMMDD-HHMMSS.tar.gz
```

## Next Steps

- [ ] Clean old backups (keep last 7)
- [ ] Update team documentation
- [ ] Schedule next migration (if recurring)

---

**Log file:** `logs/migration-YYYYMMDD-HHMMSS.log`
EOF
```

Fill in actual values from migration output.

---

## ✅ Success Criteria

**Phase 3 complete when:**
- ✅ Both documentation files created
- ✅ Dry-run test passed
- ✅ Actual migration executed successfully
- ✅ Verification script passed all checks
- ✅ API test confirms dev data
- ✅ Migration report documented

---

## 🎉 Migration Complete!

**Final checklist:**
- [ ] All scripts working
- [ ] Documentation complete
- [ ] Migration successful
- [ ] Verification passed
- [ ] Team notified
- [ ] Backups retained

**Next steps:**
- Monitor dev dataset for issues
- Set backup retention policy
- Consider scheduling (if needed)
- Share documentation with team

---

**Phase 3 Complete!** Dataset migration system fully operational.
