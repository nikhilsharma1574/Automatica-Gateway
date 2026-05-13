import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { gatedLinks } = await request.json()

    if (!Array.isArray(gatedLinks)) {
      return NextResponse.json(
        { error: 'Invalid gated links data' },
        { status: 400 }
      )
    }

    // Save all gated links to KV store
    await kv.set('gatedLinks', JSON.stringify(gatedLinks))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving gated links:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save gated links' },
      { status: 500 }
    )
  }
}
