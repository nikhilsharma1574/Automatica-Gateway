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

    const stored = await redis.get('gatedLinks')

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
