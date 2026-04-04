import { SchemaTypeDefinition } from "sanity";

// Import các schema types
import concept from "./concept";
import innerStory from "./innerStory";
import blockContent from "./blockContent";
import category from "./category";
import innerStoryCategory from "./innerStoryCategory";
import homeBanner from "./homeBanner";
import knowledgeItem from "./knowledge-item";

export const schemaTypes: SchemaTypeDefinition[] = [
  concept,
  knowledgeItem,
  innerStory,
  blockContent,
  category,
  innerStoryCategory,
  homeBanner,
];

