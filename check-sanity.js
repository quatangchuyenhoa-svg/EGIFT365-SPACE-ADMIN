require('dotenv').config({path: '.env.local'});
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false
});

async function run() {
  const concepts = await client.fetch('*[_type == "concept"]{_id,title}');
  console.log('Concepts Count:', concepts.length);
  const knowledge = await client.fetch('*[_type == "knowledgeItem"]{_id,title}');
  console.log('Knowledge Count:', knowledge.length);
}
run();
