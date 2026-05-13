import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
)
const redis = isRedisConfigured ? Redis.fromEnv() : null

export async function POST(request: NextRequest) {
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

    const { gatedLinks } = await request.json()

    if (!Array.isArray(gatedLinks)) {
      return NextResponse.json(
        { error: 'Invalid gated links data' },
        { status: 400 }
      )
    }

    await redis.set('gatedLinks', JSON.stringify(gatedLinks))

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving gated links:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save gated links' },
      { status: 500 }
    )
  }
}
