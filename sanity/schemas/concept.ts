import { defineType, defineField } from "sanity";
import { DeleteButtonInput } from "../components/DeleteButtonInput";

export default defineType({
  name: "concept",
  title: "Kho Quan Niệm",
  type: "document",
  groups: [
    { name: "content", title: "Nội Dung 📑", default: true },
    { name: "media", title: "Hình Ảnh 🖼️" },
    { name: "audio", title: "Âm Thanh 🎧" },
    { name: "layout", title: "Giao Diện 🎨" },
    { name: "marketing", title: "Quảng Bá 🚀" },
    { name: "settings", title: "Cài Đặt ⚙️" },
  ],
  fields: [
    // --- GROUP: CONTENT ---
    defineField({
      name: "title",
      title: "Tiêu đề chính",
      type: "string",
      group: "content",
      description: "Tên quan niệm (Ví dụ: Thấu Hiểu Nội Tâm)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Lời dẫn / Châm ngôn",
      type: "string",
      group: "content",
      description: "Câu trích dẫn ngắn xuất hiện dưới tiêu đề",
    }),
    defineField({
      name: "categories",
      title: "Phân loại / Tags",
      type: "array",
      group: "content",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.required().min(1).error('Vui lòng chọn ít nhất 1 tag'),
    }),
    defineField({
      name: "category",
      title: "Danh mục cũ (Legacy)",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      readOnly: true,
      description: "Dữ liệu cũ trước khi nâng cấp hệ thống nhiều tag. Hãy chọn lại ở ô phía trên.",
    }),
    defineField({
      name: "author",
      title: "Tác giả",
      type: "string",
      group: "content",
      initialValue: "EGift Space",
      description: "Người viết hoặc nguồn của quan niệm",
    }),
    defineField({
      name: "headerContent",
      title: "Dẫn nhập (Header)",
      type: "blockContent",
      group: "content",
      description: "Đoạn văn mở đầu khơi gợi vấn đề",
    }),
    defineField({
      name: "bodyContent",
      title: "Nội dung chính (Body)",
      type: "blockContent",
      group: "content",
      description: "Khai triển quan niệm một cách chi tiết",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerContent",
      title: "Lời kết (Footer)",
      type: "blockContent",
      group: "content",
      description: "Thông điệp cuối cùng muốn gửi gắm",
    }),
    defineField({
      name: "applicationContent",
      title: "Bài tập / Ứng dụng",
      type: "blockContent",
      group: "content",
      description: "Cách đưa triết lý này vào hành động thực tế",
    }),

    // --- GROUP: MEDIA ---
    defineField({
      name: "image",
      title: "Ảnh đại diện (Desktop)",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      description: "Hiển thị chính trên bản web",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Ảnh lướt Mobile (9:16)",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      description: "Dành riêng cho giao diện swipe điện thoại. Nên dùng ảnh dọc.",
    }),
    defineField({
      name: "backgroundImage",
      title: "Ảnh nền (Background)",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      description: "Họa tiết hoặc màu nền chìm cho toàn trang bài viết",
    }),

    // --- GROUP: AUDIO ---
    defineField({
      name: "audio",
      title: "Tệp âm thanh",
      type: "file",
      group: "audio",
      options: {
        accept: "audio/*",
      },
      description: "Upload giọng đọc bài viết (mp3, m4a...)",
    }),
    defineField({
      name: "autoplay",
      title: "Tự động phát",
      type: "boolean",
      group: "audio",
      description: "Nhạc sẽ tự phát ngay khi người dùng mở bài viết",
      initialValue: false,
    }),

    // --- GROUP: LAYOUT ---
    defineField({
       name: "layoutType",
       title: "Bố cục Desktop",
       type: "string",
       group: "layout",
       options: {
         list: [
           { title: "Dọc (Portrait) - Ảnh nhỏ bên trái", value: "portrait" },
           { title: "Ngang (Landscape) - Ảnh to banner", value: "landscape" },
         ],
         layout: "radio"
       },
       initialValue: "portrait",
     }),
    defineField({
      name: "mobileLayout",
      title: "Bố cục Mobile",
      type: "string",
      group: "layout",
      options: {
        list: [
          { title: "Full màn hình (Phù hợp ảnh dọc)", value: "portrait" },
          { title: "Chế độ dải mờ (Phù hợp ảnh ngang)", value: "landscape" },
        ],
        layout: "radio",
      },
      initialValue: "portrait",
    }),
    defineField({
      name: "handwrittenMode",
      title: "Chế độ Viết Tay ✍️",
      type: "boolean",
      group: "layout",
      description: "Bật để giao diện biến thành trang giấy kỉ niệm",
      initialValue: false,
    }),

    // --- GROUP: MARKETING ---
    defineField({
      name: "showCTA",
      title: "Nút liên kết Vật Phẩm",
      type: "boolean",
      group: "marketing",
      description: "Bật để hiển thị gợi ý vật phẩm triết lý liên quan",
      initialValue: true,
    }),
    defineField({
      name: "ctaLink",
      title: "Đường dẫn (URL)",
      type: "url",
      group: "marketing",
      description: "Link sang trang shop. Để trống sẽ dùng mặc định egift365.vn",
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }).error('Vui lòng nhập URL hợp lệ'),
    }),

    // --- GROUP: SETTINGS ---
    defineField({
      name: "isActive",
      title: "Trạng thái hiển thị",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
     defineField({
      name: "order",
      title: "Thứ tự sắp xếp",
      type: "number",
      group: "settings",
      description: "Số càng lớn hiện càng sớm",
      initialValue: 0,
    }),
    defineField({
      name: "slug",
      title: "Đường dẫn tĩnh (Slug)",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deleteAction",
      title: "Vùng nguy hiểm ⚠️",
      type: "string",
      group: "settings",
      components: {
        input: DeleteButtonInput
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      categories: "categories",
      legacyCategoryName: "category.name",
      handwrittenMode: "handwrittenMode",
      isActive: "isActive"
    },
    prepare({ title, media, categories, legacyCategoryName, handwrittenMode, isActive }) {
      // Ưu tiên lấy tag mới, nếu không có thì lấy tag cũ
      const firstCategory = (categories && categories[0] ? categories[0].name : null) || legacyCategoryName;
      const categoryText = firstCategory ? `[${firstCategory}]` : "";
      const status = isActive ? "✅" : "❌";
      const handwrittenIndicator = handwrittenMode ? " ✍️" : "";
      return {
        title: `${status} ${title || "Chưa đặt tên"}${handwrittenIndicator}`,
        subtitle: `${categoryText}`,
        media,
      };
    },
  },
});
