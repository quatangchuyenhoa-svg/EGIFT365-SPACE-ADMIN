# Sanity Dataset Migration: Production → Dev

**Date:** 2024-12-31
**Type:** Brainstorming Session
**Status:** ✅ Solution Agreed, Ready for Implementation

---

## 📋 Problem Statement

**Requirement:** Copy ALL documents from `production` dataset to `dev` dataset in Sanity CMS

**Purpose:** Backup/restore testing for disaster recovery scenarios

**Constraints:**
- Have Sanity API write token
- Need automated, repeatable process
- Must preserve backups for safety
- Full dataset migration (not selective)

---

## 🎯 Final Solution

**Approach:** Automated dataset migration using Sanity CLI with safety measures

**Why this approach:**
1. Official Sanity tool - battle-tested, handles edge cases
2. Complete migration - docs, assets, references preserved
3. Repeatable - can script and automate
4. Safe - creates backups before destructive operations

**Rejected alternatives:**
- ❌ API script: Too complex, doesn't handle assets well
- ❌ Manual UI: Not automatable, error-prone for repeated ops

---

## 🏗️ Architecture

```
┌─────────────┐                  ┌──────────────┐
│ Production  │ ──export──→      │ Backups/     │
│ Dataset     │                  │ *.tar.gz     │
└─────────────┘                  └──────────────┘
                                        │
                                    import
                                        ↓
┌─────────────┐  ←──backup──     ┌──────────────┐
│ Dev Dataset │                  │ Dev Backup   │
│ (overwrite) │                  │ (safety)     │
└─────────────┘                  └──────────────┘
```

**Flow:**
1. Export dev → backup (safety)
2. Export production → backup
3. Import production backup → dev (OVERWRITES)
4. Verify migration success
5. Provide rollback if needed

---

## 📁 Files to Create

```
egift-admin/
├── scripts/
│   ├── migrate-dataset.sh          # Main migration script
│   ├── rollback-dataset.sh         # Emergency restore
│   └── verify-migration.sh         # Post-migration checks
├── backups/                         # Git-ignored backup storage
│   ├── .gitkeep
│   └── README.md                    # Backup management docs
└── docs/
    └── DATASET_MIGRATION.md         # Usage guide
```

---

## 🔧 Script Features

### `migrate-dataset.sh`

**Safety Checks:**
- Verify Sanity CLI installed
- Verify authentication
- Confirm destructive operation (require --confirm flag)
- Check disk space

**Execution:**
```bash
# 1. Backup dev (safety)
sanity dataset export dev backups/dev-backup-$(date).tar.gz

# 2. Export production
sanity dataset export production backups/production-$(date).tar.gz

# 3. Import to dev (DESTRUCTIVE)
sanity dataset import backups/production-$(date).tar.gz dev

# 4. Verify
./scripts/verify-migration.sh
```

**Logging:**
- Timestamped logs to `logs/migration-$(date).log`
- Success/failure status
- Document counts before/after
- Rollback instructions if failed

### `rollback-dataset.sh`

**Features:**
- List available dev backups
- Restore dev from selected backup
- Verify restoration
- Log rollback operation

### `verify-migration.sh`

**Checks:**
- Compare document counts (production vs dev)
- Verify siteSettings exists
- Test API endpoint returns dev data
- Check for broken references
- Validate asset accessibility

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Dev data loss | 🔴 CRITICAL | LOW | Auto-backup dev before import |
| Migration failure mid-way | 🟡 HIGH | LOW | Keep backups, provide rollback |
| Asset refs broken | 🟡 MEDIUM | LOW | Sanity CLI handles cross-dataset refs |
| Disk space exhaustion | 🟢 LOW | LOW | Monitor backups/, cleanup old files |
| API rate limits | 🟢 LOW | VERY LOW | CLI handles automatically |

**Overall Risk Level:** 🟢 LOW (with proper backups)

---

## 📊 Success Metrics

**Post-migration validation:**

```bash
# Document count match
production_count=$(sanity dataset list | grep production | awk '{print $3}')
dev_count=$(sanity dataset list | grep dev | awk '{print $3}')

if [ "$production_count" -eq "$dev_count" ]; then
  echo "✅ Document count matches"
fi

# siteSettings exists
sanity documents query 'count(*[_type == "siteSettings"])' --dataset dev

# API returns dev data
curl localhost:3001/api/theme | jq '.adminColors.buttonPrimaryBg'
```

**Expected results:**
- ✅ Document counts identical
- ✅ siteSettings document exists
- ✅ API returns dev dataset colors
- ✅ No 404s on asset URLs
- ✅ All references valid

---

## 🚀 Implementation Steps

### Phase 1: Setup (5 min)
1. Install Sanity CLI: `npm install -g @sanity/cli`
2. Authenticate: `sanity login`
3. Create backups/ directory
4. Create scripts/ directory

### Phase 2: Script Creation (15 min)
1. Create `migrate-dataset.sh` with safety checks
2. Create `rollback-dataset.sh` for emergency restore
3. Create `verify-migration.sh` for validation
4. Make scripts executable: `chmod +x scripts/*.sh`

### Phase 3: Testing (10 min)
1. Run dry-run migration (export only)
2. Verify backup files created
3. Check file sizes reasonable
4. Test rollback script

### Phase 4: Execution (5 min)
1. Run `./scripts/migrate-dataset.sh --confirm`
2. Monitor progress
3. Run `./scripts/verify-migration.sh`
4. Document results

### Phase 5: Documentation (5 min)
1. Create usage guide in docs/
2. Document backup retention policy
3. Add migration to runbook

**Total Time:** ~40 minutes

---

## 📚 Usage Examples

### Normal Migration
```bash
cd /Applications/WorkSpace/egift-space/egift-admin

# Run migration (requires confirmation)
./scripts/migrate-dataset.sh --confirm

# Verify success
./scripts/verify-migration.sh
```

### Emergency Rollback
```bash
# List backups
./scripts/rollback-dataset.sh --list

# Restore from specific backup
./scripts/rollback-dataset.sh --restore backups/dev-backup-20241231-0945.tar.gz
```

### Cleanup Old Backups
```bash
# Keep only last 5 backups
cd backups/
ls -t dev-backup-*.tar.gz | tail -n +6 | xargs rm -f
```

---

## 🎓 Best Practices

### Backup Retention
- Keep last 7 dev backups (rolling)
- Keep weekly production backups (4 weeks)
- Archive monthly backups (6 months)

### Automation
- Can schedule via cron for regular sync
- Add to CI/CD pipeline for staging refreshes
- Integrate with monitoring (Slack notifications)

### Security
- Store backups securely (encrypt if sensitive)
- Limit access to migration scripts
- Audit log all migrations

---

## 📖 Additional Considerations

### Asset Storage
Sanity assets stored in CDN, not in dataset export. References preserved but files remain in original project.

**Implication:** Dev dataset will reference production assets (OK for testing).

### Draft Documents
Drafts exported with `drafts.` prefix. Published versions also included.

**Consideration:** May want to exclude drafts for cleaner dev environment.

### Cross-Dataset References
If documents reference other datasets, Sanity CLI handles via `--skip-cross-dataset-references` flag.

---

## 🔄 Alternative: Incremental Sync

If full migration too heavy, consider **selective sync:**

```typescript
// Sync only specific types
const SYNC_TYPES = ['siteSettings', 'page', 'post']

async function incrementalSync() {
  for (const type of SYNC_TYPES) {
    const docs = await prodClient.fetch(`*[_type == "${type}"]`)

    for (const doc of docs) {
      await devClient.createOrReplace(doc)
    }
  }
}
```

**Use when:**
- Only need subset of data
- Want to transform during sync
- Need frequent small syncs

---

## 🎯 Next Actions

1. **Create implementation plan:** Use `/plan` command
2. **Execute scripts:** Follow generated plan
3. **Test migration:** Dry-run first
4. **Document process:** Add to team runbook
5. **Schedule backups:** Automate if needed

---

## 📝 Summary

**Solution:** Automated Sanity dataset migration using official CLI with comprehensive safety measures

**Key Benefits:**
- ✅ Official tool, battle-tested
- ✅ Complete data preservation
- ✅ Automated with safety backups
- ✅ Rollback capability
- ✅ Repeatable process

**Risks Mitigated:**
- 🛡️ Auto-backup before destructive ops
- 🛡️ Verification checks
- 🛡️ Rollback scripts
- 🛡️ Detailed logging

**Implementation Time:** ~40 minutes
**Maintenance:** Minimal (cleanup old backups)
**Overall Assessment:** 🟢 **RECOMMENDED APPROACH**

---

## 🔗 References

- [Sanity CLI Documentation](https://www.sanity.io/docs/cli)
- [Dataset Export/Import Guide](https://www.sanity.io/docs/export-import)
- [Backup Best Practices](https://www.sanity.io/docs/backup-and-restore)

---

**Ready to implement?** Use `/plan` command to generate detailed implementation plan with all scripts and documentation.
