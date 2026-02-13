/**
 * Script sao chép tất cả documents từ "concept" sang "knowledgeItem"
 * Giữ nguyên toàn bộ nội dung, chỉ đổi _type
 *
 * Usage: node scripts/migrate-concepts-to-knowledge.mjs
 */
import { createClient } from "next-sanity";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";

// Load .env.local manually (no dotenv dependency)
const envContent = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
const env = Object.fromEntries(
  envContent.split("\n").filter(l => l && !l.startsWith("#")).map(l => {
    const [k, ...v] = l.split("=");
    return [k.trim(), v.join("=").trim().replace(/^["']|["']$/g, "").split("#")[0].trim()];
  })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// Tất cả fields cần copy (giống hệt concept schema)
const FIELDS_TO_COPY = [
  "title", "subtitle", "headerContent", "bodyContent", "footerContent",
  "applicationContent", "image", "backgroundImage", "audio", "autoplay",
  "slug", "category", "author", "order", "isActive", "layoutType",
  "handwrittenMode",
];

async function migrate() {
  console.log("Fetching all concept documents...");

  const concepts = await client.fetch('*[_type == "concept"]');
  console.log(`Found ${concepts.length} concepts to migrate.`);

  if (concepts.length === 0) {
    console.log("No concepts found. Exiting.");
    return;
  }

  // Tạo transaction để thực hiện tất cả mutations cùng lúc
  let tx = client.transaction();

  for (const concept of concepts) {
    const newDoc = { _type: "knowledgeItem", _id: randomUUID() };

    for (const field of FIELDS_TO_COPY) {
      if (concept[field] !== undefined) {
        newDoc[field] = concept[field];
      }
    }

    tx = tx.create(newDoc);
    console.log(`  + "${concept.title}" (${concept._id} -> ${newDoc._id})`);
  }

  console.log("\nCommitting transaction...");
  const result = await tx.commit();
  console.log(`Done! Migrated ${concepts.length} concepts to knowledgeItem.`);
  console.log(`Transaction ID: ${result.transactionId}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
