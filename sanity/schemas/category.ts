import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Category (Danh mục)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Tên category (ví dụ: 'Nội tâm', 'Sức khỏe')",
      validation: (Rule) => Rule.required(),
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
      description: "Category có đang được sử dụng không?",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      name: "name",
      isActive: "isActive",
    },
    prepare({ name, isActive }) {
      return {
        title: name || "Category",
        subtitle: isActive ? "" : " (Inactive)",
      };
    },
  },
});

