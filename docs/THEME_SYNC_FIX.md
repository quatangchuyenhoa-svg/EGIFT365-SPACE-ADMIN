# Theme Sync Fix - Client Update Issue

## Problem
Màu chưa được apply bên client khi thay đổi trong Studio.

## Root Causes

### 1. Auth Middleware Blocking `/api/theme`
**File:** `egift-client/proxy.ts`

**Issue:**
- Proxy middleware redirect `/api/theme` về `/auth/login`
- ThemeProvider không fetch được colors
- Client fallback về globals.css defaults

**Fix:**
```typescript
// Add at top of proxy() function
const publicApiRoutes = ['/api/theme', '/api/revalidate'];
if (publicApiRoutes.some(route => pathname.startsWith(route))) {
  return NextResponse.next();
}
```

---

### 2. Sanity Returns Color Objects Instead of Strings
**File:** `egift-client/app/api/theme/route.ts`

**Issue:**
- Sanity schema type `string` with custom ColorInput
- Sanity stores as: `{hex: "#FF0000", alpha: 1}`
- colorUtils expects plain strings: `"#FF0000"`
- Type mismatch breaks token derivation

**Fix:**
```typescript
// Normalization function
function normalizeColor(color: string | { hex: string; alpha: number } | undefined): string {
  if (!color) return '#FFFFFF'
  if (typeof color === 'string') return color
  return color.hex
}

// Apply to all 12 colors
const adminColors: AdminColors = rawColors ? {
  headerBg: normalizeColor(rawColors.headerBg),
  bodyBg: normalizeColor(rawColors.bodyBg),
  // ... all 12 fields
} : DEFAULT_ADMIN_COLORS
```

---

### 3. Next.js 16 Middleware Convention Change
**Issue:**
- Created `middleware.ts` but Next.js 16 uses `proxy.ts`
- Error: "Both middleware.ts and proxy.ts detected"

**Fix:**
- Removed `middleware.ts`
- Used existing `proxy.ts` with correct export signature

---

## Files Modified

### egift-client
1. **`proxy.ts`**
   - Added publicApiRoutes whitelist
   - Exempt `/api/theme` and `/api/revalidate` from auth

2. **`app/api/theme/route.ts`**
   - Added `normalizeColor()` helper
   - Normalize Sanity color objects to hex strings
   - Ensure AdminColors interface compliance

3. **`middleware.ts`**
   - DELETED (Next.js 16 uses proxy.ts)

---

## Verification

### Test API Endpoint
```bash
curl http://localhost:3001/api/theme | jq '.adminColors'
```

**Expected:**
```json
{
  "headerBg": "#FFFFFF",
  "buttonPrimaryBg": "#FF0000",
  ...
}
```

### Test Theme Update Flow

1. **Change color in Studio:**
   - http://localhost:3333/studio/structure/siteSettings
   - Change `buttonPrimaryBg` from `#FF0000` → `#00FF00`
   - Click Publish

2. **Verify API:**
   ```bash
   curl http://localhost:3001/api/theme?t=$(date +%s) | jq -r '.adminColors.buttonPrimaryBg'
   # Expected: #00FF00
   ```

3. **Client auto-refresh:**
   - Wait max 60 seconds
   - Or trigger manually: `window.dispatchEvent(new Event('sanity:theme:update'))`
   - Check browser console for: "✅ Theme loaded successfully"

---

## Update Timeline

**Before fix:**
- ❌ Theme API blocked by auth
- ❌ Client always uses globals.css defaults
- ❌ No sync from Studio to Client

**After fix:**
- ✅ Theme API publicly accessible
- ✅ Client fetches colors from Sanity
- ✅ Auto-refresh every 60 seconds
- ✅ Studio → Publish → Client update (max 60s)

---

## Manual Trigger (Dev Only)

### Browser Console (Client)
```javascript
// Force immediate theme reload
window.dispatchEvent(new Event('sanity:theme:update'))
```

### Verify Script
```bash
/tmp/verify-theme-sync.sh
```

---

## Architecture Flow

```
┌─────────────────────────────────────────────┐
│ 1. Admin changes color in Studio            │
│    http://localhost:3333/studio             │
│ ↓                                           │
│ 2. Click Publish → Sanity stores            │
│    {hex: "#00FF00", alpha: 1}               │
│ ↓                                           │
│ 3. Client fetches /api/theme                │
│    - NO AUTH REQUIRED (public route)        │
│ ↓                                           │
│ 4. API normalizes Sanity objects            │
│    {hex: "#00FF00"} → "#00FF00"             │
│ ↓                                           │
│ 5. colorUtils derives 48 tokens             │
│    12 admin colors → 48 design tokens       │
│ ↓                                           │
│ 6. ThemeProvider injects CSS vars           │
│    document.documentElement.style           │
│ ↓                                           │
│ 7. ✅ UI updates instantly                  │
│    All components using var(--xxx)          │
└─────────────────────────────────────────────┘
```

---

## Testing Checklist

- [x] `/api/theme` accessible without auth
- [x] API returns hex strings (not objects)
- [x] Change color in Studio → Publish
- [x] API reflects new color within 60s
- [x] Client auto-refreshes theme
- [x] Manual trigger works
- [x] Browser console shows "Theme loaded successfully"
- [x] UI components update with new colors

---

## Performance Notes

- Auto-refresh every 60s: ~1KB fetch
- ISR cache: 60s revalidation
- No impact on page load
- Minimal bandwidth usage
- Client-side only (no SSR blocking)

---

## Future Enhancements

### Instant Update (Webhook)
Currently: Max 60s delay
Possible: Instant update with Sanity webhooks

**Setup:**
1. Add webhook in Sanity: `POST /api/revalidate`
2. Trigger on: `siteSettings` publish
3. Client receives update: ~1-5 seconds

**Already implemented:** `/api/revalidate` endpoint exists
**Needs:** Sanity webhook configuration (production only)
