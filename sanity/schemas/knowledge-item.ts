import { defineType } from "sanity";
import { sharedFields, conceptFields, articleFields } from "./knowledge-item-fields";

// Schema cho Kho Tri Thức - hợp nhất concept + article
export default defineType({
  name: "knowledgeItem",
  title: "Kho Tri Thức (Knowledge Base)",
  type: "document",
  fieldsets: [
    {
      name: "conceptFields",
      title: "Nội dung dạng Quan Niệm",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "articleFields",
      title: "Nội dung dạng Bài Viết",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [...sharedFields, ...conceptFields, ...articleFields],
  preview: {
    select: {
      title: "title",
      contentType: "contentType",
      media: "image",
      categoryName: "category.name",
    },
    prepare({ title, contentType, media, categoryName }) {
      const typeLabel = contentType === "concept" ? "QN" : "BV";
      return {
        title: `[${typeLabel}] ${title || "Chưa có tiêu đề"}`,
        subtitle: categoryName ? `Danh mục: ${categoryName}` : "",
        media,
      };
    },
  },
});
