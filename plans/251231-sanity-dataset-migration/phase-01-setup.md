# Phase 1: Setup & Prerequisites

**Time Estimate:** 5 minutes
**Risk Level:** 🟢 LOW

---

## 🎯 Objectives

1. Install Sanity CLI globally
2. Authenticate with Sanity account
3. Create directory structure for backups and logs
4. Configure .gitignore to exclude sensitive files

---

## ✅ Prerequisites Check

Before starting, verify:
- [ ] Have Sanity account credentials
- [ ] Have write access to Sanity project
- [ ] Sanity project ID known: Check `.env.local` for `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] Terminal access with npm/yarn available

---

## 📋 Step-by-Step Instructions

### Step 1: Install Sanity CLI

**Command:**
```bash
npm install -g @sanity/cli
```

**Expected Output:**
```
added 1 package in 2s
```

**Verification:**
```bash
sanity --version
```

**Expected:** Version 4.x.x or higher

---

### Step 2: Authenticate with Sanity

**Command:**
```bash
sanity login
```

**What happens:**
- Opens browser for authentication
- Login with Sanity account
- Terminal shows success message

**Expected Output:**
```
Login successful
```

**Troubleshooting:**
- If browser doesn't open: Copy URL from terminal and open manually
- If already logged in: Skip this step

---

### Step 3: Create Directory Structure

**Navigate to project root:**
```bash
cd /Applications/WorkSpace/egift-space/egift-admin
```

**Create directories:**
```bash
mkdir -p backups
mkdir -p logs
mkdir -p scripts
```

**Verify structure:**
```bash
ls -la | grep -E 'backups|logs|scripts'
```

**Expected Output:**
```
drwxr-xr-x  backups
drwxr-xr-x  logs
drwxr-xr-x  scripts
```

---

### Step 4: Configure .gitignore

**Check current .gitignore:**
```bash
cat .gitignore
```

**Add exclusions** (if not already present):
```bash
cat >> .gitignore << 'EOF'

# Sanity dataset backups (can be large)
backups/*.tar.gz

# Migration logs
logs/*.log

# Keep directory structure
!backups/.gitkeep
!backups/README.md
!logs/.gitkeep
EOF
```

**Verify addition:**
```bash
tail -10 .gitignore
```

**Should see:** New backup/log exclusions at end of file

---

### Step 5: Create .gitkeep Files

**Purpose:** Preserve empty directories in git

**Commands:**
```bash
touch backups/.gitkeep
touch logs/.gitkeep
```

**Verify:**
```bash
ls -la backups/
ls -la logs/
```

**Expected:** `.gitkeep` file in each directory

---

## 🔍 Verification Checklist

Run these commands to verify setup:

```bash
# 1. Sanity CLI installed
sanity --version

# 2. Authenticated
sanity projects list

# 3. Directories exist
ls -d backups logs scripts

# 4. .gitignore configured
grep -E 'backups|logs' .gitignore
```

**All checks must pass before continuing to Phase 2.**

---

## 📊 Success Criteria

- ✅ Sanity CLI v4.x.x installed
- ✅ Successfully authenticated (can list projects)
- ✅ Directories created: `backups/`, `logs/`, `scripts/`
- ✅ .gitignore excludes `*.tar.gz` and `*.log`
- ✅ .gitkeep files preserve empty directories

---

## ⚠️ Troubleshooting

### Issue: "sanity: command not found"
**Solution:**
```bash
# Try with npx
npx @sanity/cli --version

# Or add npm global bin to PATH
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Issue: "Login failed"
**Solution:**
- Check internet connection
- Clear browser cache
- Try: `sanity logout` then `sanity login` again

### Issue: "Permission denied" creating directories
**Solution:**
```bash
# Use sudo (macOS/Linux only)
sudo mkdir -p backups logs scripts
sudo chown $USER:$USER backups logs scripts
```

---

## 🚀 Next Steps

Once all verification checks pass:
1. ✅ Mark Phase 1 complete
2. ➡️ Proceed to `phase-02-scripts.md`

---

**Phase 1 Complete!** Ready to create migration scripts.
