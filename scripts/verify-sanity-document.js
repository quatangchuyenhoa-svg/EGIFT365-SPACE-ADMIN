/**
 * Verify siteSettings document in Sanity
 * Checks draft vs published state
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: join(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID not found in .env.local')
  process.exit(1)
}

console.log(`📦 Project ID: ${projectId}`)
console.log(`📊 Dataset: ${dataset}\n`)

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function verify() {
  console.log('=== Sanity Document Verification ===\n')

  try {
    // Check published document
    console.log('1️⃣ Checking PUBLISHED document...')
    const published = await client.fetch(
      `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{
        _id,
        _updatedAt,
        buttonPrimaryBg,
        headerBg,
        surfaceBg
      }`
    )

    if (published) {
      console.log('✅ Published document found:')
      console.log(JSON.stringify(published, null, 2))
    } else {
      console.log('❌ No published document found!')
    }

    console.log('\n2️⃣ Checking DRAFT document...')
    const draft = await client.fetch(
      `*[_type == "siteSettings" && _id in path("drafts.**")][0]{
        _id,
        _updatedAt,
        buttonPrimaryBg,
        headerBg,
        surfaceBg
      }`
    )

    if (draft) {
      console.log('📝 Draft document found:')
      console.log(JSON.stringify(draft, null, 2))
    } else {
      console.log('ℹ️ No draft document')
    }

    console.log('\n3️⃣ Checking ALL siteSettings documents...')
    const all = await client.fetch(
      `*[_type == "siteSettings"]{
        _id,
        _updatedAt,
        buttonPrimaryBg
      }`
    )
    console.log(`Found ${all.length} documents:`)
    console.log(JSON.stringify(all, null, 2))

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

verify()
