import { defineField, ConditionalPropertyCallbackContext } from "sanity";

// Callbacks ẩn/hiện theo loại nội dung
type Ctx = ConditionalPropertyCallbackContext;
const hideWhenNotConcept = ({ document }: Ctx) => document?.contentType !== "concept";
const hideWhenNotArticle = ({ document }: Ctx) => document?.contentType !== "article";

// === SHARED FIELDS ===
export const sharedFields = [
  defineField({
    name: "contentType",
    title: "Loại nội dung",
    type: "string",
    options: {
      list: [
        { title: "Quan Niệm (Concept)", value: "concept" },
        { title: "Bài Viết (Article)", value: "article" },
      ],
      layout: "radio",
    },
    validation: (Rule) => Rule.required(),
    initialValue: "article",
  }),
  defineField({
    name: "title",
    title: "Tiêu đề",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source: "title", maxLength: 96 },
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "image",
    title: "Ảnh đại diện",
    type: "image",
    options: { hotspot: true },
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "category",
    title: "Danh mục",
    type: "reference",
    to: [{ type: "category" }],
    options: { filter: "isActive == true" },
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: "author", title: "Tác giả", type: "string" }),
  defineField({
    name: "publishedAt",
    title: "Ngày xuất bản",
    type: "datetime",
    initialValue: () => new Date().toISOString(),
  }),
  defineField({ name: "order", title: "Thứ tự hiển thị", type: "number", initialValue: 0 }),
  defineField({ name: "isActive", title: "Kích hoạt", type: "boolean", initialValue: true }),
];

// === CONCEPT-SPECIFIC FIELDS ===
export const conceptFields = [
  defineField({
    name: "subtitle",
    title: "Phụ đề",
    type: "string",
    description: "Phụ đề hoặc câu trích dẫn ngắn",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "headerContent",
    title: "Mở bài (Header)",
    type: "blockContent",
    description: "Phần mở đầu của bài viết",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "bodyContent",
    title: "Thân bài (Body)",
    type: "blockContent",
    description: "Nội dung chính của bài viết",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "footerContent",
    title: "Kết bài (Footer)",
    type: "blockContent",
    description: "Phần kết thúc của bài viết",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "applicationContent",
    title: "Ứng dụng vào cuộc sống",
    type: "blockContent",
    description: "Hướng dẫn ứng dụng quan niệm vào cuộc sống thực tế",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "audio",
    title: "Audio",
    type: "file",
    options: { accept: "audio/*" },
    description: "Upload audio (mp3, m4a, wav...) cho concept",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "autoplay",
    title: "Tự động phát audio",
    type: "boolean",
    initialValue: false,
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "backgroundImage",
    title: "Ảnh nền",
    type: "image",
    options: { hotspot: true },
    description: "Ảnh nền cho trang concept",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "layoutType",
    title: "Loại layout",
    type: "string",
    options: {
      list: [
        { title: "Portrait (Ảnh dọc)", value: "portrait" },
        { title: "Landscape (Ảnh ngang)", value: "landscape" },
      ],
    },
    initialValue: "portrait",
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
  defineField({
    name: "handwrittenMode",
    title: "Chế độ viết tay",
    type: "boolean",
    description: "Hiển thị dạng chữ viết tay trên giấy kẻ ngang",
    initialValue: false,
    fieldset: "conceptFields",
    hidden: hideWhenNotConcept,
  }),
];

// === ARTICLE-SPECIFIC FIELDS ===
export const articleFields = [
  defineField({
    name: "excerpt",
    title: "Tóm tắt",
    type: "text",
    rows: 3,
    description: "Tóm tắt ngắn cho bài viết",
    fieldset: "articleFields",
    hidden: hideWhenNotArticle,
    validation: (Rule) => Rule.max(300),
  }),
  defineField({
    name: "content",
    title: "Nội dung bài viết",
    type: "blockContent",
    fieldset: "articleFields",
    hidden: hideWhenNotArticle,
  }),
  defineField({
    name: "coverImage",
    title: "Ảnh bìa",
    type: "image",
    options: { hotspot: true },
    description: "Ảnh bìa lớn cho bài viết",
    fieldset: "articleFields",
    hidden: hideWhenNotArticle,
  }),
  defineField({
    name: "readingTime",
    title: "Thời gian đọc (phút)",
    type: "number",
    fieldset: "articleFields",
    hidden: hideWhenNotArticle,
  }),
  defineField({
    name: "tags",
    title: "Tags",
    type: "array",
    of: [{ type: "string" }],
    options: { layout: "tags" },
    fieldset: "articleFields",
    hidden: hideWhenNotArticle,
  }),
];
