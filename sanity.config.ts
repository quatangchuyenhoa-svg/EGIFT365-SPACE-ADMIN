import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { ResetThemeAction } from "./sanity/actions/resetTheme";
import { NavbarActions } from "./sanity/components/NavbarActions";
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
          .title("E-Gift Studio")
          .items([
            ...S.documentTypeListItems().filter(
              (item) => !["knowledgeItem"].includes(item.getId() as string)
            ),
            S.divider(),
            S.listItem()
              .title("Kho Tri Thức")
              .child(
                S.documentList()
                  .title("Kho Tri Thức")
                  .filter('_type == "knowledgeItem"')
                  .defaultOrdering([{ field: "order", direction: "asc" }])
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
      // Add reset theme action for siteSettings
      if (context.schemaType === 'siteSettings') {
        return [...prev, ResetThemeAction]
      }
      return prev
    },
  },
});

