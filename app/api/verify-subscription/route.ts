import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken, channelUrl } = await request.json()

    if (!accessToken || !channelUrl) {
      return NextResponse.json(
        { error: 'Missing accessToken or channelUrl' },
        { status: 400 }
      )
    }

    // Extract channel handle from URL
    const channelHandle = extractChannelHandle(channelUrl)
    if (!channelHandle) {
      return NextResponse.json(
        { error: 'Invalid YouTube channel URL' },
        { status: 400 }
      )
    }

    // Get channel ID from handle
    const channelId = await getChannelIdFromHandle(channelHandle)
    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }

    // Check if user is subscribed to the channel
    const isSubscribed = await checkSubscription(accessToken, channelId)

    return NextResponse.json({ isSubscribed, channelId })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}

function extractChannelHandle(url: string): string | null {
  try {
    // Handle @handle format
    if (url.includes('@')) {
      const match = url.match(/@([\w-]+)/)
      return match ? match[1] : null
    }
    // Handle /c/channel-name format
    if (url.includes('/c/')) {
      const match = url.match(/\/c\/([\w-]+)/)
      return match ? match[1] : null
    }
    // Handle /user/username format
    if (url.includes('/user/')) {
      const match = url.match(/\/user\/([\w-]+)/)
      return match ? match[1] : null
    }
    return null
  } catch {
    return null
  }
}

async function getChannelIdFromHandle(handle: string): Promise<string | null> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      console.error('YOUTUBE_API_KEY not configured')
      return null
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        handle
      )}&type=channel&key=${apiKey}`
    )

    if (!response.ok) {
      console.error('YouTube API error:', response.statusText)
      return null
    }

    const data = await response.json()
    if (data.items && data.items.length > 0) {
      return data.items[0].id.channelId
    }

    return null
  } catch (error) {
    console.error('Error getting channel ID:', error)
    return null
  }
}

async function checkSubscription(accessToken: string, channelId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=${channelId}&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Invalid or expired access token')
        return false
      }
      console.error('YouTube API error:', response.statusText)
      return false
    }

    const data = await response.json()
    return data.items && data.items.length > 0
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}
