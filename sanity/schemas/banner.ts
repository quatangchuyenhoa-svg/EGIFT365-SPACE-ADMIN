import { defineType, defineField } from "sanity";

export default defineType({
  name: "banner",
  title: "Banner (Trang chủ)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Tên banner (để quản lý)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Banner Images",
      type: "array",
      description: "Tối đa 3 ảnh banner cho trang chủ",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Mô tả ảnh cho SEO và accessibility",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(3).min(1),
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Banner có đang được sử dụng không?",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      images: "images",
      isActive: "isActive",
    },
    prepare({ title, images, isActive }) {
      const imageCount = images?.length || 0;
      return {
        title: title || "Banner",
        subtitle: `${imageCount} ảnh${isActive ? " (Active)" : " (Inactive)"}`,
      };
    },
  },
});

