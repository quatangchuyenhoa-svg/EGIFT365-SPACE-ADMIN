# Luồng hoạt động Sanity Studio trong E-Gift Admin

## 📋 Tổng quan

Sanity Studio được tích hợp vào Next.js admin app để quản lý content cho website E-Gift. Dưới đây là luồng hoạt động chi tiết.

---

## 🔄 Luồng Request khi truy cập `/studio`

### 1. **User truy cập URL: `http://localhost:3000/studio`**

```
Browser Request
    ↓
Next.js Router
    ↓
Route Matching: /studio → app/(studio)/studio/[[...index]]/page.tsx
```

### 2. **Layout Resolution (Next.js App Router)**

```
app/layout.tsx (Root Layout)
    ↓
├── <html><body>
├── QueryProvider (React Query)
└── StudioWrapper (Client Component)
    ↓
    ├── Check pathname: startsWith("/studio")?
    │   ├── YES → Render children trực tiếp (không có Sidebar)
    │   └── NO  → Render với SidebarProvider + AppSidebar
    ↓
app/(studio)/layout.tsx (Studio Layout)
    ↓
    └── Return children (không có html/body vì đã có ở root)
    ↓
app/(studio)/studio/[[...index]]/page.tsx (Studio Page)
```

### 3. **Studio Page Rendering**

```typescript
// app/(studio)/studio/[[...index]]/page.tsx
"use client"; // Client Component

// Dynamic import với SSR disabled
const NextStudio = dynamic(
  () => import("next-sanity/studio"),
  { ssr: false } // ⚠️ Quan trọng: Không render trên server
);

// Render Studio với config
<NextStudio config={config} />
```

**Tại sao `ssr: false`?**
- Sanity Studio sử dụng nhiều browser APIs
- Tránh hydration mismatch giữa server và client
- Studio cần chạy hoàn toàn trên client

---

## ⚙️ Cấu hình Studio (`sanity.config.ts`)

### 1. **Config Structure**

```typescript
{
  projectId: "abc123",        // Từ .env.local
  dataset: "production",      // Từ .env.local
  basePath: "/studio",        // URL path
  plugins: [...],             // Tools (structure, vision)
  schema: { types: [...] }    // Content types
}
```

### 2. **Plugins**

- **`structureTool()`**: Tạo sidebar navigation, document list
- **`visionTool()`**: GROQ query editor để test queries

### 3. **Schema Types**

```typescript
// sanity/schemas/index.ts
export const schemaTypes = [
  heroBanner,      // Quản lý banners
  concept,          // Quản lý quan niệm
  innerStory,      // Quản lý câu chuyện
  dailySection,    // Quản lý section hôm nay
];
```

---

## 📝 Luồng tạo/chỉnh sửa Content

### 1. **User tạo document mới trong Studio**

```
User clicks "Create new" → Hero Banner
    ↓
Studio hiển thị form dựa trên schema (heroBanner.ts)
    ↓
User điền:
  - title: "Banner mùa xuân"
  - image: Upload ảnh
  - alt: "Banner mùa xuân 2024"
  - link: "/promo/spring"
  - order: 1
  - isActive: true
    ↓
User clicks "Publish"
```

### 2. **Data được lưu vào Sanity**

```
Studio Client (Browser)
    ↓
Sanity API (POST /data/mutate)
    ↓
Sanity Backend
    ↓
Sanity Database (MongoDB)
    ↓
✅ Document được lưu với _id, _type, _createdAt, _updatedAt
```

### 3. **Schema Validation**

Mỗi field trong schema có validation:
- `required()`: Bắt buộc phải có
- `min()`, `max()`: Giới hạn giá trị
- Custom validation functions

---

## 🔍 Luồng Fetch Data từ Frontend (egift-client)

### 1. **Frontend cần data**

```typescript
// egift-client/app/page.tsx
const banners = await fetch(`${API_URL}/home/banners`);
```

### 2. **Backend API fetch từ Sanity**

```typescript
// Backend API route
import { client } from "@/sanity/client";

const banners = await client.fetch(`
  *[_type == "heroBanner" && isActive == true] 
  | order(order asc)
`);
```

### 3. **GROQ Query**

```
*[_type == "heroBanner" && isActive == true] | order(order asc)
│  │                    │                    │
│  │                    │                    └─ Sort by order
│  │                    └─ Filter: chỉ lấy active
│  └─ Filter: chỉ lấy type "heroBanner"
└─ Select all documents
```

### 4. **Response**

```json
[
  {
    "_id": "abc123",
    "_type": "heroBanner",
    "title": "Banner mùa xuân",
    "image": {
      "asset": {
        "_ref": "image-xyz",
        "_type": "reference"
      }
    },
    "alt": "Banner mùa xuân 2024",
    "link": "/promo/spring",
    "order": 1,
    "isActive": true,
    "_createdAt": "2024-01-01T00:00:00Z",
    "_updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## 🎨 StudioWrapper - Conditional Rendering

### Logic hoạt động:

```typescript
// components/studio-wrapper.tsx
const pathname = usePathname(); // "/studio" hoặc "/dashboard"
const isStudio = pathname?.startsWith("/studio");

if (isStudio) {
  // ✅ Render trực tiếp, không có Sidebar
  return <>{children}</>;
} else {
  // ✅ Render với Sidebar cho admin dashboard
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
```

**Kết quả:**
- `/studio` → Full screen Studio, không có sidebar admin
- `/dashboard` → Admin dashboard với sidebar

---

## 🔐 Authentication Flow

### 1. **Lần đầu truy cập Studio**

```
User truy cập /studio
    ↓
Studio check authentication
    ↓
Chưa đăng nhập → Redirect đến Sanity login
    ↓
User đăng nhập với Sanity account
    ↓
Sanity trả về token
    ↓
Studio lưu token (localStorage/cookie)
    ↓
✅ User có thể sử dụng Studio
```

### 2. **Các lần sau**

```
User truy cập /studio
    ↓
Studio check token
    ↓
Token hợp lệ → Cho phép truy cập
Token hết hạn → Yêu cầu đăng nhập lại
```

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Sanity Studio  │ (Admin UI)
│  /studio        │
└────────┬────────┘
         │ Create/Update/Delete
         ↓
┌─────────────────┐
│  Sanity API     │
│  (Backend)      │
└────────┬────────┘
         │ Store/Query
         ↓
┌─────────────────┐
│  Sanity DB      │
│  (MongoDB)      │
└────────┬────────┘
         │ Fetch
         ↓
┌─────────────────┐
│  Backend API    │ (Your API)
│  /api/home/...  │
└────────┬────────┘
         │ GET request
         ↓
┌─────────────────┐
│  Frontend       │ (egift-client)
│  /              │
└─────────────────┘
```

---

## 🛠️ Các Schema Types hiện có

### 1. **HeroBanner**
- Quản lý banners trên homepage
- Fields: title, image, alt, link, order, isActive

### 2. **Concept**
- Quản lý các quan niệm (Nội tâm, Sức khỏe, etc.)
- Fields: title, description, image, slug, category, order, isActive

### 3. **InnerStory**
- Quản lý câu chuyện nội tâm
- Fields: title, category, image, description, listenTime, reads, reactions, slug

### 4. **DailySection**
- Quản lý section "Quan niệm hôm nay"
- Fields: title, description, primaryCTA, secondaryCTA, featuredConceptId

---

## 🔄 Caching & Revalidation

### 1. **Next.js Revalidation**

```typescript
// Trong API route hoặc page
fetch(url, { next: { revalidate: 60 } }); // Cache 60 giây
```

### 2. **Sanity CDN**

```typescript
// sanity.config.ts
useCdn: true // Trong production
```

CDN cache giúp:
- Tăng tốc độ fetch
- Giảm load cho Sanity API
- Tự động invalidate khi có update

---

## 🚀 Best Practices

1. **Schema Design**
   - Đặt tên field rõ ràng
   - Validation đầy đủ
   - Preview function để xem trước

2. **Performance**
   - Sử dụng CDN trong production
   - Cache data ở frontend
   - Chỉ fetch fields cần thiết

3. **Security**
   - API token chỉ dùng ở server-side
   - Không expose token ở client
   - Validate input từ Studio

---

## 📝 Tóm tắt

1. **Studio UI** (`/studio`) → Tạo/chỉnh sửa content
2. **Sanity Backend** → Lưu trữ data
3. **Backend API** → Fetch data từ Sanity
4. **Frontend** → Hiển thị data cho user

Tất cả hoạt động real-time, data được sync ngay khi publish trong Studio.

