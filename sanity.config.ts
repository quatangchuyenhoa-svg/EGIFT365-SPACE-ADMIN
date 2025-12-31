import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { resetThemeAction } from "./sanity/actions/resetTheme";
import React from "react";

export default defineConfig({
  name: "egift-studio",
  title: "🎨 E-Gift Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio", // Studio sẽ chạy tại /studio

  // Custom theme & branding
  theme: {
    primaryColor: {
      500: '#EB9947', // Brand orange
    },
  },

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
    },
  },

  plugins: [
    structureTool(), // Cấu trúc sidebar và navigation
    visionTool(),    // GROQ query tool
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add reset theme action for siteSettings
      if (context.schemaType === 'siteSettings') {
        return [...prev, resetThemeAction]
      }
      return prev
    },
  },
});

