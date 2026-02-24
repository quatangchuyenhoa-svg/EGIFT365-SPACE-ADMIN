import { defineType, defineField } from "sanity";
import { DeleteButtonInput } from "../components/DeleteButtonInput";

// Schema cho Kho Tri Thức - giống hệt Kho Quan Niệm
export default defineType({
  name: "knowledgeItem",
  title: "Kho Tri Thức (Knowledge Base)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Phụ đề hoặc câu trích dẫn ngắn",
    }),
    defineField({
      name: "headerContent",
      title: "Mở bài (Header)",
      type: "blockContent",
      description: "Phần mở đầu của bài viết",
    }),
    defineField({
      name: "bodyContent",
      title: "Thân bài (Body)",
      type: "blockContent",
      description: "Nội dung chính của bài viết",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "footerContent",
      title: "Kết bài (Footer)",
      type: "blockContent",
      description: "Phần kết thúc của bài viết",
    }),
    defineField({
      name: "applicationContent",
      title: "Ứng dụng vào cuộc sống",
      type: "blockContent",
      description: "Phần hướng dẫn ứng dụng quan niệm vào cuộc sống thực tế",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Ảnh nền cho trang (dùng cho cả layout dọc và ngang)",
    }),
    defineField({
      name: "audio",
      title: "Audio",
      type: "file",
      options: { accept: "audio/*" },
      description: "Tùy chọn: upload audio (mp3, m4a, wav...) cho bài viết",
    }),
    defineField({
      name: "autoplay",
      title: "Auto Play",
      type: "boolean",
      description: "Tự động phát audio khi vào trang",
      initialValue: false,
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      options: { filter: "isActive == true" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Tác giả",
      type: "string",
      description: "Tên tác giả",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Thứ tự hiển thị",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Bật/tắt bài viết",
      initialValue: true,
    }),
    defineField({
      name: "layoutType",
      title: "Layout Type",
      type: "string",
      description: "Loại layout hiển thị: portrait (ảnh dọc) hoặc landscape (ảnh ngang)",
      options: {
        list: [
          { title: "Portrait (Ảnh dọc)", value: "portrait" },
          { title: "Landscape (Ảnh ngang)", value: "landscape" },
        ],
      },
      initialValue: "portrait",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "handwrittenMode",
      title: "Handwritten Mode",
      type: "boolean",
      description: "Bật để hiển thị bài viết dưới dạng chữ viết tay trên giấy kẻ ngang",
      initialValue: false,
    }),
    defineField({
      name: "deleteAction",
      title: "Thao tác xóa",
      type: "string",
      components: {
        input: DeleteButtonInput
      },
      description: "Cẩn trọng: Xóa bài viết vĩnh viễn",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      categoryName: "category.name",
      handwrittenMode: "handwrittenMode",
    },
    prepare({ title, media, categoryName, handwrittenMode }) {
      const handwrittenIndicator = handwrittenMode ? " ✍️" : "";
      return {
        title: (title || "Untitled") + handwrittenIndicator,
        subtitle: categoryName ? `Danh mục: ${categoryName}` : "",
        media,
      };
    },
  },
});
