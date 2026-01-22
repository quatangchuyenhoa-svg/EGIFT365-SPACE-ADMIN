import { NextResponse } from 'next/server'

/**
 * API Route để sync content từ Sanity Studio
 *
 * Proxy request đến egift-client's revalidate API với secret
 * Giữ secret an toàn ở server-side
 */
export async function POST() {
  try {
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://space.egift365.vn'
    const secret = process.env.SANITY_REVALIDATE_SECRET

    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'SANITY_REVALIDATE_SECRET not configured' },
        { status: 500 }
      )
    }

    // Call client's revalidate API with secret
    const response = await fetch(`${clientUrl}/api/revalidate?secret=${secret}&all=true`, {
      method: 'GET',
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        success: true,
        message: 'Content synced successfully',
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        { success: false, error: data.error || 'Sync failed' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Sync content error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
