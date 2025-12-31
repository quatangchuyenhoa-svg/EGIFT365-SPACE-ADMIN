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
