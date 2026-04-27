import { defineType, defineField } from "sanity";
import { DeleteButtonInput } from "../components/DeleteButtonInput";

export default defineType({
  name: "knowledgeItem",
  title: "Kho Tri Thức",
  type: "document",
  groups: [
    { name: "content", title: "Nội Dung 📖", default: true },
    { name: "media", title: "Hình Ảnh 🎨" },
    { name: "audio", title: "Âm Thanh 🎙️" },
    { name: "layout", title: "Giao Diện 🖥️" },
    { name: "settings", title: "Cài Đặt ⚙️" },
  ],
  fields: [
    // --- GROUP: CONTENT ---
    defineField({
      name: "title",
      title: "Tiêu đề tri thức",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Phụ đề / Trích dẫn",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "categories",
      title: "Lĩnh vực / Tags",
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
      title: "Lĩnh vực cũ (Legacy)",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      readOnly: true,
      description: "Dữ liệu cũ trước khi nâng cấp hệ thống nhiều tag. Hãy chọn lại ở ô phía trên.",
    }),
    defineField({
      name: "author",
      title: "Người chia sẻ",
      type: "string",
      group: "content",
      initialValue: "EGift Space",
    }),
    defineField({
      name: "headerContent",
      title: "Mở đầu (Header)",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "bodyContent",
      title: "Nội dung chi tiết (Body)",
      type: "blockContent",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerContent",
      title: "Lời kết (Footer)",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "applicationContent",
      title: "Ứng dụng thực tế",
      type: "blockContent",
      group: "content",
    }),

    // --- GROUP: MEDIA ---
    defineField({
      name: "image",
      title: "Ảnh chính",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Ảnh Mobile (9:16)",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "backgroundImage",
      title: "Ảnh nền trang",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),

    // --- GROUP: AUDIO ---
    defineField({
      name: "audio",
      title: "File Audio",
      type: "file",
      group: "audio",
      options: { accept: "audio/*" },
    }),
    defineField({
      name: "autoplay",
      title: "Tự động phát Audio",
      type: "boolean",
      group: "audio",
      initialValue: false,
    }),

    // --- GROUP: LAYOUT ---
    defineField({
      name: "layoutType",
      title: "Bố cục hiển thị",
      type: "string",
      group: "layout",
      options: {
        list: [
          { title: "Dọc (Portrait)", value: "portrait" },
          { title: "Ngang (Landscape)", value: "landscape" },
        ],
        layout: "radio",
      },
      initialValue: "portrait",
    }),
    defineField({
      name: "mobileLayout",
      title: "Bố cục lướt Mobile",
      type: "string",
      group: "layout",
      options: {
        list: [
          { title: "Full màn hình", value: "portrait" },
          { title: "Dải mờ (Contain)", value: "landscape" },
        ],
        layout: "radio",
      },
      initialValue: "portrait",
    }),
    defineField({
      name: "handwrittenMode",
      title: "Chế độ viết tay ✍️",
      type: "boolean",
      group: "layout",
      initialValue: false,
    }),

    // --- GROUP: SETTINGS ---
    defineField({
      name: "isActive",
      title: "Kích hoạt hiển thị",
      type: "boolean",
      group: "settings",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiện",
      type: "number",
      group: "settings",
      initialValue: 0,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "deleteAction",
      title: "Xóa vĩnh viễn 🗑️",
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
      const firstCategory = (categories && categories[0] ? categories[0].name : null) || legacyCategoryName;
      const status = isActive ? "🟢" : "🔴";
      const handwrittenIndicator = handwrittenMode ? " ✍️" : "";
      return {
        title: `${status} ${title || "Chưa có tên"}${handwrittenIndicator}`,
        subtitle: firstCategory ? `Danh mục: ${firstCategory}` : "Chưa phân loại",
        media,
      };
    },
  },
});
