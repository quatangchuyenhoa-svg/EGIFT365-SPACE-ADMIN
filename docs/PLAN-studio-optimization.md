# Plan: Tối ưu Sanity Studio Admin

## 🎯 Mục tiêu
Cải thiện giao diện Studio để **dễ nhìn, đẹp, mượt mà**, đồng thời **gọn code** theo clean-code principles.

---

## 📊 Đánh giá hiện trạng

### Cấu trúc hiện tại
```
sanity/
├── schemas/          (9 files — 2 schemas bị trùng lặp nặng)
│   ├── concept.ts         ← 180 dòng
│   ├── knowledge-item.ts  ← 167 dòng  ← ~90% giống concept.ts
│   ├── innerStory.ts      ← 81 dòng
│   ├── innerStoryCategory.ts ← 75 dòng
│   ├── category.ts        ← 44 dòng
│   ├── blockContent.ts    ← 94 dòng
│   ├── homeBanner.ts      ← 93 dòng
│   ├── siteSettings.ts    ← 247 dòng
│   └── index.ts           ← 24 dòng
├── components/       (4 files)
│   ├── ColorInput.tsx       ← 157 dòng (inline styles nặng)
│   ├── DeleteButtonInput.tsx ← 41 dòng ✅ OK
│   ├── NavbarActions.tsx    ← 106 dòng ✅ OK
│   └── SiteSettingsPreview.tsx ← 131 dòng ✅ OK
├── actions/          (2 files — OK)
├── studio/           (3 empty dirs — rác)
└── sanity.config.ts  ← React.createElement x3 (đáng lẽ dùng JSX)
```

### Vấn đề phát hiện

| # | Vấn đề | Mức độ | File(s) |
|---|--------|--------|---------|
| 1 | **concept.ts ≈ knowledge-item.ts** — ~90% code trùng lặp (DRY violation) | 🔴 Critical | `concept.ts`, `knowledge-item.ts` |
| 2 | **Schema fields không có `group`** — form dài dằng dặc, khó tìm field | 🟡 High | `concept.ts`, `knowledge-item.ts` |
| 3 | **`sanity.config.ts` dùng `React.createElement`** thay vì JSX cho Logo | 🟡 Medium | `sanity.config.ts` |
| 4 | **Thư mục `studio/` trống** — rác, gây confuse | 🟢 Low | `sanity/studio/` |
| 5 | **Sidebar Structure chưa có Home Banner & Site Settings** — admin phải tìm thủ công | 🟡 Medium | `sanity.config.ts` |
| 6 | **Preview descriptions chưa sát nghĩa** — subtitle chỉ show category, thiếu status | 🟢 Low | Nhiều schema |

---

## 📋 Proposed Changes

### Phase 1: DRY — Gộp Schema Concept + Knowledge (Gọn code)

> **Mục tiêu**: Loại bỏ ~150 dòng code trùng lặp.

#### [NEW] `sanity/schemas/shared/articleFields.ts`
- Trích xuất **tất cả fields chung** (title, subtitle, headerContent, bodyContent, footerContent, applicationContent, image, mobileImage, backgroundImage, audio, autoplay, slug, category, author, order, isActive, layoutType, handwrittenMode, deleteAction) thành một **factory function**:
  ```ts
  export function createArticleFields(options: { type: 'concept' | 'knowledgeItem' }) {
    return [ ...fields ]
  }
  ```
- Các schema `concept.ts` và `knowledge-item.ts` chỉ còn ~20 dòng mỗi file, gọi `createArticleFields()` + custom preview.

#### [MODIFY] `sanity/schemas/concept.ts`
- Giảm từ ~180 dòng → ~25 dòng.

#### [MODIFY] `sanity/schemas/knowledge-item.ts`
- Giảm từ ~167 dòng → ~25 dòng.

---

### Phase 2: UX — Thêm Field Groups (Giao diện dễ nhìn)

> **Mục tiêu**: Tổ chức form thành các tab rõ ràng thay vì cuộn dài.

Thêm `groups` vào schema concept/knowledgeItem:

| Group | Icon | Fields |
|-------|------|--------|
| 📝 Nội dung | `DocumentTextIcon` | title, subtitle, headerContent, bodyContent, footerContent, applicationContent |
| 🖼️ Media | `ImageIcon` | image, mobileImage, backgroundImage, audio, autoplay |
| ⚙️ Cài đặt | `CogIcon` | slug, category, author, order, isActive, layoutType, handwrittenMode |
| ⚠️ Nguy hiểm | `TrashIcon` | deleteAction |

Kết quả: Form chuyển thành **tabbed interface**, admin chỉ cần click vào tab thay vì cuộn 15+ fields.

---

### Phase 3: Navigation — Cải thiện Sidebar Structure

> **Mục tiêu**: Đưa Home Banner và Site Settings vào sidebar rõ ràng.

#### [MODIFY] `sanity.config.ts`
- Thêm **section "⚙️ Cấu hình hệ thống"** chứa:
  - 🏠 Home Banner (singleton)
  - 🎨 Cài đặt giao diện (singleton — thay vì list, dùng `S.editor()`)
- Chuyển Logo component từ `React.createElement` sang JSX (rename file sang `.tsx` nếu cần).

**Sidebar mới:**
```
📚 Kho Tri Thức
💡 Kho Quan Niệm
📖 Câu Chuyện Nội Tâm
─────────────────
📁 Phân loại & Danh mục
  ├── Danh mục bài viết
  └── Danh mục câu chuyện
─────────────────
⚙️ Cấu hình hệ thống
  ├── 🏠 Home Banner
  └── 🎨 Giao diện
```

---

### Phase 4: Cleanup — Dọn rác

> **Mục tiêu**: Xóa các thư mục/code không cần thiết.

- [DELETE] `sanity/studio/components/` (empty)
- [DELETE] `sanity/studio/styles/` (empty)
- [DELETE] `sanity/studio/types/` (empty)
- [DELETE] `sanity/studio/` (empty parent)

---

### Phase 5: Preview Enhancement (Tùy chọn)

> **Mục tiêu**: Preview trong danh sách dễ nhìn hơn.

- Cải thiện `prepare()` trong concept/knowledgeItem:
  - Hiển thị thêm `isActive` status (✅/❌)
  - Hiển thị `order` number
  - Format: `"[#3] Cấu trúc con người ✅"` với subtitle `"Danh mục: Nội tâm ✍️"`

---

## ✅ Tiêu chí hoàn thành

| Check | Tiêu chí |
|-------|----------|
| ✅ | concept.ts và knowledge-item.ts dùng shared fields (DRY) |
| ✅ | Form có tabbed groups (UX) |
| ✅ | Sidebar có đầy đủ Home Banner + Site Settings |
| ✅ | Không còn thư mục rác |
| ✅ | TypeScript pass, Studio hoạt động bình thường |

---

## ⚠️ Lưu ý quan trọng

> Sanity sử dụng **schema-driven** approach. Mọi thay đổi schema **KHÔNG ảnh hưởng** đến dữ liệu đã lưu trong Sanity Dataset (vì data là JSON documents). Việc refactor code schema hoàn toàn an toàn — chỉ thay đổi cách Studio hiển thị form, không thay đổi structure dữ liệu.
