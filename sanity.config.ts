import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "egift-studio",
  title: "E-Gift Studio",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",

  basePath: "/studio", // Studio sẽ chạy tại /studio

  plugins: [
    structureTool(), // Cấu trúc sidebar và navigation
    visionTool(), // GROQ query tool
  ],

  schema: {
    types: schemaTypes,
  },
});

