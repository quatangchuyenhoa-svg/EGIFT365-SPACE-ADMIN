# Deployment Guide - Sanity Studio

## 🏠 Local Development (Hiện tại)

### Setup hiện tại:
- ✅ Sanity Studio chạy tại `http://localhost:3000/studio`
- ✅ Kết nối với Sanity project qua Project ID
- ✅ Data được lưu trên Sanity cloud (MongoDB)
- ✅ Chưa có authentication bảo vệ Studio

### Environment Variables (`.env.local`):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### Đặc điểm:
- Chạy trên máy local
- Chỉ developer mới truy cập được
- Không cần authentication (hoặc dùng Sanity default login)
- Hot reload, development tools

---

## 🚀 Production Deployment

### 1. **Option 1: Deploy Studio cùng với Admin App (Recommended)**

#### Vercel/Netlify Deployment:

```bash
# Build command
npm run build

# Start command (nếu dùng Node.js server)
npm start
```

#### Environment Variables (Production):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-write-token  # Nếu cần write operations
```

#### URL sau khi deploy:
- Admin Dashboard: `https://admin.egift365.vn/dashboard`
- Sanity Studio: `https://admin.egift365.vn/studio`

#### Ưu điểm:
- ✅ Một domain duy nhất
- ✅ Dễ quản lý
- ✅ Cùng authentication system

#### Nhược điểm:
- ⚠️ Studio phải public (hoặc cần thêm auth middleware)

---

### 2. **Option 2: Deploy Studio riêng biệt (Standalone)**

#### Tạo Sanity Studio riêng:

```bash
# Tạo project mới
npx create-sanity@latest --template clean

# Hoặc init trong folder riêng
mkdir sanity-studio
cd sanity-studio
sanity init
```

#### Deploy lên Vercel/Netlify:

```bash
# Build output: .sanity folder
npm run build

# Deploy
vercel deploy
```

#### URL sau khi deploy:
- Studio: `https://studio.egift365.vn` (subdomain riêng)

#### Ưu điểm:
- ✅ Tách biệt hoàn toàn
- ✅ Có thể dùng Sanity authentication
- ✅ Dễ scale riêng

#### Nhược điểm:
- ⚠️ Cần quản lý 2 projects riêng

---

### 3. **Option 3: Sanity Hosted Studio (Easiest)**

#### Sử dụng Sanity hosting:

```bash
# Deploy Studio lên Sanity
sanity deploy
```

#### URL sau khi deploy:
- Studio: `https://your-project.sanity.studio`

#### Ưu điểm:
- ✅ Miễn phí (cho personal projects)
- ✅ Tự động update
- ✅ Built-in authentication
- ✅ CDN global

#### Nhược điểm:
- ⚠️ URL là subdomain của Sanity
- ⚠️ Không customize domain được (trừ khi trả phí)

---

## 🔐 Authentication cho Production

### Vấn đề:
Studio hiện tại chưa có authentication, ai cũng có thể truy cập và chỉnh sửa content.

### Giải pháp:

#### 1. **Sanity Authentication (Built-in)**

Studio tự động có authentication nếu:
- Deploy lên `*.sanity.studio`
- Hoặc config trong `sanity.config.ts`:

```typescript
export default defineConfig({
  // ... other config
  auth: {
    providers: [
      {
        name: 'google',
        title: 'Google',
        // ... config
      }
    ]
  }
});
```

#### 2. **Next.js Middleware (Cho Admin App)**

Tạo middleware để protect `/studio` route:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect /studio route
  if (pathname.startsWith('/studio')) {
    // Check authentication
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/studio/:path*',
};
```

#### 3. **Environment-based Access**

Chỉ cho phép Studio trong development:

```typescript
// app/(studio)/studio/[[...index]]/page.tsx
export default function StudioPage() {
  // Chỉ cho phép trong development
  if (process.env.NODE_ENV === 'production') {
    return <div>Studio không khả dụng trong production</div>;
  }
  
  return <NextStudio config={config} />;
}
```

---

## 📦 Build & Deploy Checklist

### Pre-deployment:

- [ ] Set environment variables trong hosting platform
- [ ] Test build locally: `npm run build`
- [ ] Verify Sanity connection
- [ ] Setup authentication (nếu cần)
- [ ] Test Studio functionality

### Production Environment Variables:

```env
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional
SANITY_API_TOKEN=your-token
NODE_ENV=production
```

### Post-deployment:

- [ ] Verify Studio accessible
- [ ] Test create/edit/delete content
- [ ] Check authentication (nếu có)
- [ ] Monitor error logs
- [ ] Test data sync với frontend

---

## 🔄 Data Flow trong Production

### Local Development:
```
Local Studio → Sanity Cloud → MongoDB
                ↓
         Frontend (local) fetch từ Sanity
```

### Production:
```
Production Studio → Sanity Cloud → MongoDB
                      ↓
              Frontend (production) fetch từ Sanity
```

**Lưu ý:** Data luôn được lưu trên Sanity Cloud, không phụ thuộc vào nơi deploy Studio.

---

## 🌐 CDN & Performance

### Sanity CDN:

```typescript
// sanity.config.ts
export default defineConfig({
  // ...
  useCdn: process.env.NODE_ENV === 'production', // true trong production
});
```

CDN giúp:
- ✅ Tăng tốc độ fetch
- ✅ Giảm load cho Sanity API
- ✅ Cache tự động
- ✅ Global distribution

---

## 🚨 Security Best Practices

1. **API Token:**
   - ✅ Chỉ dùng ở server-side
   - ✅ Không commit vào git
   - ✅ Rotate định kỳ

2. **Environment Variables:**
   - ✅ Sử dụng secrets trong hosting platform
   - ✅ Không expose trong client code

3. **Authentication:**
   - ✅ Protect Studio route
   - ✅ Role-based access (nếu cần)

4. **CORS:**
   - ✅ Configure đúng origins
   - ✅ Chỉ allow trusted domains

---

## 📝 Tóm tắt

### Hiện tại (Local):
- ✅ Studio chạy tại `localhost:3000/studio`
- ✅ Kết nối với Sanity Cloud
- ✅ Data lưu trên Sanity
- ⚠️ Chưa có authentication

### Production Options:
1. **Deploy cùng Admin App** → `admin.egift365.vn/studio`
2. **Deploy riêng** → `studio.egift365.vn`
3. **Sanity Hosted** → `your-project.sanity.studio`

### Quan trọng:
- Data luôn ở Sanity Cloud (không phụ thuộc nơi deploy Studio)
- Cần thêm authentication cho production
- CDN tự động enable trong production

