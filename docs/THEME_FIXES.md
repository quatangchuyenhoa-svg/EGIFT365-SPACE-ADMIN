# Theme System Fixes

## ✅ Issue 1: Reset Theme Button

### Problem
Admin không có cách reset theme về màu mặc định.

### Solution
Thêm custom document action trong Sanity Studio.

### Files Created/Modified
1. **`sanity/actions/resetTheme.ts`** (NEW)
   - Định nghĩa DEFAULT_THEME với 12 màu mặc định
   - Custom action "🔄 Reset Theme"
   - Confirm dialog trước khi reset
   - Auto-publish sau khi reset

2. **`sanity.config.ts`** (MODIFIED)
   - Import resetThemeAction
   - Register action cho siteSettings document

### Usage
1. Mở siteSettings trong Studio
2. Click nút **"🔄 Reset Theme"** ở góc trên
3. Confirm → Tất cả 12 màu reset về defaults
4. Auto-publish → Client update ngay

### Default Theme Values
```typescript
{
  headerBg: '#FFFFFF',
  bodyBg: '#FDFBF7',
  footerBg: '#69372A',
  surfaceBg: '#FFFFFF',
  overlayBg: '#F5F1EB',
  buttonPrimaryBg: '#EB9947',
  buttonPrimaryHover: '#D68331',
  buttonOutlineText: '#EB9947',
  buttonOutlineBorder: '#EB9947',
  textHeading: '#3D2817',
  textBody: '#69372A',
  textHover: '#D68331',
}
```

---

## ✅ Issue 2: Client Không Update Khi Studio Đổi Màu

### Problem
Đổi màu trong Studio → Publish → Client không update ngay.

### Root Cause
- ISR cache 60s trong `/api/theme`
- Client chỉ fetch 1 lần lúc mount
- Không có mechanism để detect changes

### Solution Stack

#### 1. Auto-Refresh (Client-side)
**File:** `egift-client/app/providers/ThemeProvider.tsx`

**Changes:**
- ✅ Auto-refresh theme mỗi 60s
- ✅ Cache-busting với `?t=${Date.now()}`
- ✅ `cache: 'no-store'` để bypass browser cache
- ✅ Manual trigger via `window.dispatchEvent(new Event('sanity:theme:update'))`

**Behavior:**
- Initial load: Fetch theme ngay
- Every 60s: Auto-refetch theme từ API
- Manual trigger: Console → `window.dispatchEvent(new Event('sanity:theme:update'))`

#### 2. Webhook Revalidation (Server-side)
**File:** `egift-client/app/api/revalidate/route.ts` (NEW)

**Features:**
- POST endpoint nhận webhook từ Sanity
- Verify secret để bảo mật
- Revalidate `/api/theme` path
- Revalidate toàn bộ layout

**Setup Required:**

1. **Add env variable** (`egift-client/.env.local`):
   ```bash
   SANITY_REVALIDATE_SECRET=your-strong-secret-here
   ```

2. **Configure Sanity Webhook**:
   - Go to: https://sanity.io/manage
   - Settings → Webhooks → Create webhook
   - Name: "Theme Revalidation"
   - URL: `https://your-domain.com/api/revalidate`
   - Trigger on: `Create/Update` of `siteSettings`
   - HTTP method: `POST`
   - Secret: `your-strong-secret-here` (same as env)
   - Dataset: `production`

3. **Local Testing**:
   ```bash
   # Test revalidation endpoint
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"secret": "your-strong-secret-here"}'

   # Or use GET for manual trigger
   curl "http://localhost:3000/api/revalidate?secret=your-strong-secret-here"
   ```

### Update Flow (After Fixes)

```
┌─────────────────────────────────────────────────┐
│ Admin đổi màu trong Studio                      │
│ ↓                                               │
│ Click Publish                                   │
│ ↓                                               │
│ Sanity webhook triggers                         │
│ ↓                                               │
│ POST /api/revalidate (egift-client)            │
│ ↓                                               │
│ Next.js revalidates /api/theme                  │
│ ↓                                               │
│ ISR cache cleared                               │
│ ↓                                               │
│ Client auto-refresh (max 60s)                   │
│ ↓                                               │
│ ✅ Client shows new colors                      │
└─────────────────────────────────────────────────┘
```

### Timing
- **With webhook**: ~1-5 seconds (instant revalidation)
- **Without webhook**: Max 60 seconds (auto-refresh interval)
- **Manual trigger**: Instant (via custom event)

---

## Testing Checklist

### Issue 1: Reset Theme
- [ ] Open siteSettings in Studio
- [ ] Change some colors
- [ ] Click "🔄 Reset Theme"
- [ ] Confirm dialog appears
- [ ] Colors reset to defaults
- [ ] Document auto-publishes
- [ ] Check egift-client updates (within 60s)

### Issue 2: Client Update
- [ ] Change color in Studio
- [ ] Click Publish
- [ ] Wait max 60s → Client updates
- [ ] (Optional) Setup webhook → Update within 5s
- [ ] Manual trigger: `window.dispatchEvent(new Event('sanity:theme:update'))`
- [ ] Check browser console for logs

---

## Manual Trigger (Development)

### Quick Refresh Theme (Browser Console)
```javascript
// Force immediate theme reload
window.dispatchEvent(new Event('sanity:theme:update'))
```

### Verify Theme API
```bash
# Check current theme
curl http://localhost:3000/api/theme

# Force revalidation (if webhook setup)
curl "http://localhost:3000/api/revalidate?secret=your-secret"
```

---

## Files Summary

### egift-admin (Studio)
- ✅ `sanity/actions/resetTheme.ts` (NEW)
- ✅ `sanity.config.ts` (MODIFIED)

### egift-client
- ✅ `app/providers/ThemeProvider.tsx` (MODIFIED)
- ✅ `app/api/revalidate/route.ts` (NEW)
- ⚠️ `.env.local` (NEEDS UPDATE - add SANITY_REVALIDATE_SECRET)

---

## Next Steps

1. **Add webhook secret to .env.local**:
   ```bash
   cd egift-client
   echo "SANITY_REVALIDATE_SECRET=$(openssl rand -base64 32)" >> .env.local
   ```

2. **Deploy to production**:
   - Deploy egift-client với revalidate endpoint
   - Get production URL
   - Configure Sanity webhook với production URL

3. **Test end-to-end**:
   - Change color in Studio
   - Publish
   - Verify client updates within 60s (or 5s with webhook)

---

## Performance Notes

- Auto-refresh mỗi 60s không ảnh hưởng performance (lightweight fetch)
- Cache-busting chỉ cho theme API (không affect toàn bộ site)
- ISR cache vẫn hoạt động cho other requests
- Webhook revalidation optimal cho production
