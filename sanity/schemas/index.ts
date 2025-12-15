import { SchemaTypeDefinition } from "sanity";

// Import các schema types
import concept from "./concept";
import innerStory from "./innerStory";
import blockContent from "./blockContent";
import category from "./category";

export const schemaTypes: SchemaTypeDefinition[] = [
  concept,
  innerStory,
  blockContent,
  category,
];

