import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/^"|"$/g, '') || ''
const token = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^"|"$/g, '') || ''
const isRedisConfigured = Boolean(url && token)
const redis = isRedisConfigured ? new Redis({ url, token }) : null

export async function GET(request: NextRequest) {
  try {
    if (!isRedisConfigured || !redis) {
      return NextResponse.json(
        {
          error:
            'Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables.',
        },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    const stored = await redis.get('gatedLinks')

    if (!stored) {
      return NextResponse.json({ gatedLink: null })
    }

    const gatedLinks = typeof stored === 'string' ? JSON.parse(stored) : stored
    const link = gatedLinks.find((l: any) => l.id === id)
    
    return NextResponse.json({ gatedLink: link || null })
  } catch (error: any) {
    console.error('Error retrieving gated links:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve gated links' },
      { status: 500 }
    )
  }
}
