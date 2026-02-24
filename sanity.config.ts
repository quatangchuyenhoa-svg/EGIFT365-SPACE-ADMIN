import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { ResetThemeAction } from "./sanity/actions/resetTheme";
import { DeletePostAction } from "./sanity/actions/deletePost";
import { NavbarActions } from "./sanity/components/NavbarActions";
import {
  BookIcon,
  BulbOutlineIcon,
  DocumentsIcon,
  TagIcon,
  FolderIcon,
} from "@sanity/icons";
import React from "react";

export default defineConfig({
  name: "egift-studio",
  title: "🎨 E-Gift Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio", // Studio sẽ chạy tại /studio

  // Studio appearance
  studio: {
    components: {
      logo: () =>
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#EB9947',
            },
          },
          React.createElement('span', { style: { fontSize: '24px' } }, '🎨'),
          React.createElement('span', null, 'E-Gift Studio')
        ),
      navbar: NavbarActions,
    },
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Quản lý Nội dung")
          .items([
            // --- MAIN CONTENT ---
            S.listItem()
              .title("Kho Tri Thức")
              .icon(BookIcon)
              .child(
                S.documentTypeList("knowledgeItem")
                  .title("Kho Tri Thức")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.listItem()
              .title("Kho Quan Niệm")
              .icon(BulbOutlineIcon)
              .child(
                S.documentTypeList("concept")
                  .title("Kho Quan Niệm")
                  .defaultOrdering([{ field: "order", direction: "asc" }])
              ),
            S.listItem()
              .title("Câu Chuyện Nội Tâm")
              .icon(DocumentsIcon)
              .child(
                S.documentTypeList("innerStory").title("Danh sách Câu chuyện")
              ),

            S.divider(),

            // --- CLASSIFICATION ---
            S.listItem()
              .title("Phân loại & Danh mục")
              .icon(FolderIcon)
              .child(
                S.list()
                  .title("Phân loại")
                  .items([
                    S.listItem()
                      .title("Danh mục bài viết")
                      .icon(TagIcon)
                      .child(S.documentTypeList("category").title("Danh mục bài viết")),
                    S.listItem()
                      .title("Danh mục câu chuyện")
                      .icon(TagIcon)
                      .child(S.documentTypeList("innerStoryCategory").title("Danh mục câu chuyện")),
                  ])
              ),

            // Hide automatically generated items that we manually added above
            ...S.documentTypeListItems().filter(
              (item) => !["knowledgeItem", "concept", "siteSettings", "innerStory", "homeBanner", "category", "innerStoryCategory", "blockContent"].includes(item.getId() as string)
            ),
          ]),
    }),
    visionTool(),    // GROQ query tool
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add custom delete action for knowledge and concepts
      if (['knowledgeItem', 'concept'].includes(context.schemaType)) {
        return [...prev, DeletePostAction]
      }

      // Add reset theme action for siteSettings
      if (context.schemaType === 'siteSettings') {
        return [...prev, ResetThemeAction]
      }
      return prev
    },
  },
});

