import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    // Dùng cùng projectId/dataset với studio
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});


