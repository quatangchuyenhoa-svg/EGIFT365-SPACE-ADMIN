/**
 * Force publish siteSettings document
 * Copies draft to published if exists
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // Need WRITE token
})

async function forcePublish() {
  console.log('=== Force Publish siteSettings ===\n')

  try {
    // Get draft document
    const draft = await client.fetch(
      `*[_type == "siteSettings" && _id in path("drafts.**")][0]`
    )

    if (!draft) {
      console.log('❌ No draft found to publish!')
      return
    }

    console.log('📝 Found draft:', draft._id)
    console.log('Colors:', {
      buttonPrimaryBg: draft.buttonPrimaryBg,
      headerBg: draft.headerBg,
    })

    // Extract published ID (remove "drafts." prefix)
    const publishedId = draft._id.replace('drafts.', '')

    console.log('\n🚀 Publishing...')

    // Create/update published document
    const result = await client
      .patch(publishedId)
      .set({
        ...draft,
        _id: publishedId,
        _type: 'siteSettings',
      })
      .commit()

    console.log('✅ Published successfully!')
    console.log('Document ID:', result._id)
    console.log('Updated at:', result._updatedAt)

    // Delete draft
    await client.delete(draft._id)
    console.log('🗑️ Draft deleted')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Details:', error)
  }
}

forcePublish()
