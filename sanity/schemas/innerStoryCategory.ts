import { defineType, defineField } from "sanity";

export default defineType({
  name: "innerStoryCategory",
  title: "Inner Story Category (Danh mục câu chuyện nội tâm)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tên danh mục",
      type: "string",
      description: "Tên category (ví dụ: 'Gia đình', 'Sự nghiệp', 'Chữa lành')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      description: "Tag để phân loại (tự động generate từ tên, có thể chỉnh sửa)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Mô tả",
      type: "text",
      description: "Mô tả ngắn về danh mục này",
    }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị",
      type: "number",
      description: "Số càng nhỏ, hiển thị càng trước",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Đang hoạt động",
      type: "boolean",
      description: "Danh mục có đang được sử dụng không?",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      name: "name",
      tag: "tag.current",
      isActive: "isActive",
      order: "order",
    },
    prepare({ name, tag, isActive, order }) {
      return {
        title: name || "Danh mục",
        subtitle: `${tag ? `Tag: ${tag}` : ""}${isActive ? " • ✓ Hoạt động" : " • ✗ Không hoạt động"}${order !== undefined ? ` • Thứ tự: ${order}` : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Thứ tự hiển thị",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Tên A-Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});

