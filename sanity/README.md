# Sanity CMS Setup Guide

## Bước 1: Tạo Sanity Project

1. Truy cập [Sanity.io](https://www.sanity.io/)
2. Đăng ký/Đăng nhập tài khoản
3. Tạo project mới:
   - Vào [Manage Projects](https://www.sanity.io/manage)
   - Click "Create project"
   - Đặt tên project (vd: "egift-admin")
   - Chọn dataset: "production"

## Bước 2: Lấy Project ID

1. Vào project vừa tạo
2. Vào Settings → API
3. Copy **Project ID** (dạng: `abc123xyz`)

## Bước 3: Tạo API Token (Optional)

Chỉ cần nếu bạn muốn write/update data từ admin:

1. Vào Settings → API → Tokens
2. Click "Add API token"
3. Chọn quyền:
   - **Viewer**: Chỉ đọc (cho frontend)
   - **Editor**: Đọc + Ghi (cho admin)
4. Copy token

## Bước 4: Cấu hình Environment Variables

1. Tạo file `.env.local` trong thư mục `egift-admin`:

```bash
cp .env.example .env.local
```

2. Cập nhật các giá trị:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token  # Optional
```

## Bước 5: Cài đặt Sanity Studio (Optional)

Nếu muốn dùng Sanity Studio để quản lý content:

```bash
npm install -g @sanity/cli
sanity init --project your-project-id --dataset production
```

Hoặc sử dụng Sanity Studio trong Next.js:

```bash
npm install @sanity/vision @sanity/desk-tool
```

## Bước 6: Test Connection

Tạo file test để kiểm tra kết nối:

```typescript
// sanity/test.ts
import { client } from "./client";

async function testConnection() {
  try {
    const data = await client.fetch(`*[_type == "post"][0..5]`);
    console.log("✅ Sanity connected!", data);
  } catch (error) {
    console.error("❌ Sanity connection failed:", error);
  }
}

testConnection();
```

## Sử dụng trong Code

### Fetch Data:

```typescript
import { client } from "@/sanity/client";

// Fetch tất cả documents
const posts = await client.fetch(`*[_type == "post"]`);

// Fetch với điều kiện
const featuredPosts = await client.fetch(
  `*[_type == "post" && featured == true]`
);

// Fetch single document
const post = await client.fetch(
  `*[_type == "post" && slug.current == $slug][0]`,
  { slug: "my-post" }
);
```

### Write Data (cần token):

```typescript
import { writeClient } from "@/sanity/client";

if (writeClient) {
  await writeClient.create({
    _type: "post",
    title: "My Post",
    // ... other fields
  });
}
```

## Tài liệu tham khảo

- [Sanity Documentation](https://www.sanity.io/docs)
- [next-sanity Documentation](https://github.com/sanity-io/next-sanity)
- [GROQ Query Language](https://www.sanity.io/docs/groq)

