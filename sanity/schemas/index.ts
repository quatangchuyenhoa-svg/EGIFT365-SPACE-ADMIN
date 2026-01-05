import { SchemaTypeDefinition } from "sanity";

// Import các schema types
import concept from "./concept";
import innerStory from "./innerStory";
import blockContent from "./blockContent";
import category from "./category";
import innerStoryCategory from "./innerStoryCategory";
import siteSettings from "./siteSettings";
import homeBanner from "./homeBanner";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,       // Theme configuration (12 colors → 49 tokens)
  concept,
  innerStory,
  blockContent,
  category,
  innerStoryCategory,
  homeBanner,
];

