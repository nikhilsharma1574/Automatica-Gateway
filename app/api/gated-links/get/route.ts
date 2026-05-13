import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)
const redis = isRedisConfigured ? Redis.fromEnv() : null

export async function GET(request: NextRequest) {
  try {
    if (!isRedisConfigured || !redis) {
      return NextResponse.json({ gatedLinks: [] })
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
