import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/^"|"$/g, '') || ''
const token = process.env.UPSTASH_REDIS_REST_TOKEN?.replace(/^"|"$/g, '') || ''
const isRedisConfigured = Boolean(url && token)
const redis = isRedisConfigured ? new Redis({ url, token }) : null

export async function POST(request: NextRequest) {
  try {
    if (!isRedisConfigured || !redis) {
      return NextResponse.json(
        {
          error:
            'Upstash Redis is not configured.',
        },
        { status: 500 }
      )
    }

    const data = await request.json()
    
    // Fetch existing links
    const stored = await redis.get('gatedLinks')
    let existingLinks: any[] = []
    
    if (stored) {
      existingLinks = typeof stored === 'string' ? JSON.parse(stored) : stored
    }

    // Handle single new link (preferred for universal app)
    if (data.newLink) {
      existingLinks.push(data.newLink)
      await redis.set('gatedLinks', JSON.stringify(existingLinks))
      return NextResponse.json({ success: true })
    }
    
    // Handle bulk array override (legacy support)
    if (data.gatedLinks && Array.isArray(data.gatedLinks)) {
      // In a real app we'd merge, but for now we'll just prepend to avoid losing data
      const merged = [...data.gatedLinks, ...existingLinks]
      // deduplicate by id
      const uniqueIds = new Set()
      const uniqueLinks = merged.filter(l => {
        if (uniqueIds.has(l.id)) return false
        uniqueIds.add(l.id)
        return true
      })
      await redis.set('gatedLinks', JSON.stringify(uniqueLinks))
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid data provided' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Error saving gated link:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save gated link' },
      { status: 500 }
    )
  }
}
