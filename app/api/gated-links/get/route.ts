import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const stored = await kv.get('gatedLinks')
    
    if (!stored) {
      return NextResponse.json({ gatedLinks: [] })
    }

    const gatedLinks = typeof stored === 'string' ? JSON.parse(stored) : stored
    return NextResponse.json({ gatedLinks })
  } catch (error: any) {
    console.error('Error retrieving gated links:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve gated links' },
      { status: 500 }
    )
  }
}
