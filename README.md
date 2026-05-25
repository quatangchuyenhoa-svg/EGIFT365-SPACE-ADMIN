# EGIFT Admin Control Panel

Ứng dụng quản trị (Admin Panel) trung tâm xử lý dữ liệu và cấu hình cho toàn bộ hệ thống microsite của **eGift Space**. Được xây dựng bằng Next.js 15 (App Router).

## 🚀 Các tính năng chính
- **Quản lý không gian kỷ niệm (Microsites)**: Cập nhật thông tin, cấu hình chi tiết cho các trường học.
- **Quản lý học sinh (Students)**:
  - Xem danh sách học sinh theo từng trường (Ban Mai, Newton, Nguyễn Bỉnh Khiêm).
  - Thêm mới, chỉnh sửa thông tin, ngày sinh, lời nhắn cá nhân hóa.
  - Tự động chuẩn hóa tên học sinh thành mã ký ức (slug) không dấu tương thích với Microsite.
  - Khóa/mở khóa tài khoản học sinh.
- **Quản lý mã công khai (Public Tokens)** & phân quyền truy cập.
- **Thống kê lượt xem (Analytics)** & đồng bộ lượng truy cập từ Sanity.

## 🛠️ Cài đặt & Chạy dưới local

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 20+ hoặc 25+ (khuyên dùng v25.8.1).
- **pnpm**: Trình quản lý package.

### 2. Cấu hình biến môi trường (`.env.local`)
Tạo file `.env.local` ở thư mục gốc và cấu hình các giá trị sau:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3002
# Trỏ tới NestJS Backend xử lý Database
NEXT_PUBLIC_API_URL='http://localhost:9062'

# Cấu hình Sanity Studio (Đọc & Đồng bộ nội dung)
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skxxxxxx

# Google Analytics Integration
NEXT_PUBLIC_GA_ID=G-XXXXXX
GA_PROPERTY_ID=xxxxxx
GA_CLIENT_EMAIL="xxxxxx"
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

### 3. Cài đặt thư viện & Khởi chạy
```bash
# Cài đặt package dependencies
pnpm install

# Khởi chạy dự án ở chế độ Development (mặc định chạy trên Port 3000)
pnpm dev
```

## 🔄 Cấu hình API Proxy (Rewrites)
Dự án sử dụng cơ chế **Next.js Rewrites** trong `next.config.ts` để chuyển tiếp (proxy) toàn bộ các cuộc gọi API từ client (`/api/*` trên port 3000) sang NestJS Backend (`port 9062`):

```typescript
async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9062"}/api/:path*`,
    },
  ];
}
```
**Tại sao cần cấu hình này?**
- Giúp cookie bảo mật (`httpOnly` session token) hoạt động trơn tru giữa Client và Server cùng một Origin.
- Tránh các lỗi Cross-Origin Resource Sharing (CORS) khi tương tác trực tiếp với API của backend.

## ⚠️ Lưu ý khi phát triển
- **Hydration Mismatch**: Các component hiển thị văn bản dịch đa ngôn ngữ i18n ở khu vực phân trang (DataTable) đã được bọc bằng `mounted` state check. Hãy luôn đảm bảo các chuỗi dịch động chỉ render sau khi component đã mounted ở Client-side.
