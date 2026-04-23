import { createClient } from "next-sanity";

/**
 * Sanity Client for egift-admin
 * Optimized for Sanity v5 with stega support (Source Maps)
 */
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-03-24", // Latest stable as of update
  useCdn: true, // CDN for faster loading in public contexts
  stega: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview', // Enable stega only in preview for visual editing
    studioUrl: '/studio',
  },
});