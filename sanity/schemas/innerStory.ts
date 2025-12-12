import { defineType, defineField } from "sanity";

export default defineType({
  name: "innerStory",
  title: "Inner Story (Câu chuyện nội tâm)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
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
      description: "Bật/tắt story",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      categoryName: "category.name",
    },
    prepare({ title, media, categoryName }) {
      return {
        title: title || "Untitled Story",
        subtitle: categoryName ? `Category: ${categoryName}` : "",
        media,
      };
    },
  },
});

