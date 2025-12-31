# Sanity Dataset Migration Implementation Plan

**Date:** 2025-12-31
**Status:** Ready for Implementation
**Estimated Time:** 40 minutes
**Risk Level:** 🟢 LOW (with proper backups)

---

## 📋 Overview

Implement automated Sanity dataset migration system to copy all documents from `production` dataset to `dev` dataset with comprehensive safety measures, rollback capability, and verification checks.

**Purpose:** Backup/restore testing for disaster recovery scenarios

**Approach:** Sanity CLI-based automation with safety-first design

---

## 🎯 Goals

1. ✅ Automated migration from production → dev dataset
2. ✅ Safety backups before all destructive operations
3. ✅ Emergency rollback capability
4. ✅ Post-migration verification
5. ✅ Comprehensive documentation

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
1. Export dev → safety backup
2. Export production → migration source
3. Import production → dev (OVERWRITES)
4. Verify migration success
5. Provide rollback if needed

---

## 📁 Deliverables

### Scripts
- `scripts/migrate-dataset.sh` - Main migration automation
- `scripts/rollback-dataset.sh` - Emergency restore
- `scripts/verify-migration.sh` - Post-migration validation

### Infrastructure
- `backups/` directory with `.gitkeep` and `README.md`
- `logs/` directory for migration logs

### Documentation
- `docs/DATASET_MIGRATION.md` - Usage guide
- Updated `.gitignore` to exclude backups and logs

---

## 📝 Implementation Phases

### Phase 1: Setup & Prerequisites
**Time:** 5 minutes
**File:** `phase-01-setup.md`

- Install Sanity CLI globally
- Authenticate with Sanity
- Create directory structure
- Configure .gitignore

### Phase 2: Migration Scripts
**Time:** 20 minutes
**File:** `phase-02-scripts.md`

- Create `migrate-dataset.sh` with safety checks
- Create `rollback-dataset.sh` for recovery
- Create `verify-migration.sh` for validation
- Make scripts executable

### Phase 3: Documentation & Testing
**Time:** 15 minutes
**File:** `phase-03-docs-testing.md`

- Create `backups/README.md`
- Create `docs/DATASET_MIGRATION.md`
- Run dry-run test
- Execute actual migration
- Verify results

---

## ⚠️ Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Dev data loss | 🔴 CRITICAL | Auto-backup dev before import |
| Migration failure | 🟡 HIGH | Keep backups, provide rollback |
| Disk space exhaustion | 🟢 LOW | Monitor backups/, cleanup old files |

**Overall Risk:** 🟢 LOW with proper execution

---

## ✅ Success Criteria

**Post-migration validation must pass:**
- ✅ Document counts match (production == dev)
- ✅ siteSettings document exists in dev
- ✅ API returns dev dataset colors
- ✅ No broken asset references
- ✅ All document references valid

**Verification command:**
```bash
./scripts/verify-migration.sh
```

---

## 🚀 Execution Order

1. Read `phase-01-setup.md` → Execute setup steps
2. Read `phase-02-scripts.md` → Create all scripts
3. Read `phase-03-docs-testing.md` → Document and test
4. Run migration: `./scripts/migrate-dataset.sh --confirm`
5. Verify: `./scripts/verify-migration.sh`

---

## 📚 References

- Brainstorm report: `plans/reports/brainstorm-251231-0944-sanity-dataset-migration.md`
- [Sanity CLI Documentation](https://www.sanity.io/docs/cli)
- [Dataset Export/Import Guide](https://www.sanity.io/docs/export-import)

---

## 📊 Progress Tracking

- [ ] Phase 1: Setup & Prerequisites
- [ ] Phase 2: Migration Scripts
- [ ] Phase 3: Documentation & Testing
- [ ] Final verification passed
- [ ] Migration documented

---

**Next Step:** Read and execute `phase-01-setup.md`
