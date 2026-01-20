import { defineType, defineField } from "sanity";

export default defineType({
  name: "concept",
  title: "Concept (Kho Quan Niệm)",
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
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Ảnh nền cho trang concept (dùng cho cả layout dọc và ngang)",
    }),
    defineField({
      name: "audio",
      title: "Audio",
      type: "file",
      options: {
        accept: "audio/*",
      },
      description: "Tùy chọn: upload audio (mp3, m4a, wav...) cho concept",
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
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        filter: "isActive == true",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Tác giả",
      type: "string",
      description: "Tên tác giả của concept",
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
      description: "Bật/tắt concept",
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
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      categoryName: "category.displayName",
      categoryValue: "category.value",
    },
    prepare({ title, media, categoryName, categoryValue }) {
      return {
        title: title || "Untitled Concept",
        subtitle: categoryName || categoryValue ? `Category: ${categoryName || categoryValue}` : "",
        media,
      };
    },
  },
});

