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

    // Extract channel identifier from URL
    const channelInfo = extractChannelInfo(channelUrl)
    if (!channelInfo) {
      return NextResponse.json(
        { error: 'Invalid YouTube channel URL' },
        { status: 400 }
      )
    }

    // Get channel ID
    const channelId = await resolveChannelId(channelInfo)
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

interface ChannelInfo {
  type: 'id' | 'handle' | 'customUrl' | 'username'
  value: string
}

function extractChannelInfo(url: string): ChannelInfo | null {
  try {
    // Handle direct channel ID format: /channel/UCxxxxxx
    if (url.includes('/channel/')) {
      const match = url.match(/\/channel\/(UC[\w-]+)/)
      if (match) return { type: 'id', value: match[1] }
    }
    // Handle @handle format: /@handle or youtube.com/@handle
    if (url.includes('@')) {
      const match = url.match(/@([\w.-]+)/)
      if (match) return { type: 'handle', value: match[1] }
    }
    // Handle /c/custom-name format
    if (url.includes('/c/')) {
      const match = url.match(/\/c\/([\w-]+)/)
      if (match) return { type: 'customUrl', value: match[1] }
    }
    // Handle /user/username format
    if (url.includes('/user/')) {
      const match = url.match(/\/user\/([\w-]+)/)
      if (match) return { type: 'username', value: match[1] }
    }
    return null
  } catch {
    return null
  }
}

async function resolveChannelId(info: ChannelInfo): Promise<string | null> {
  // If it's already a channel ID, return it directly
  if (info.type === 'id') {
    return info.value
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    console.error('YOUTUBE_API_KEY not configured')
    return null
  }

  try {
    // For @handles, use the channels endpoint with forHandle parameter
    if (info.type === 'handle') {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(info.value)}&key=${apiKey}`,
        {
          headers: {
            'Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          return data.items[0].id
        }
      } else {
        const errorText = await response.text()
        console.error('YouTube API error (channels/forHandle):', response.status, errorText)
      }
    }

    // Fallback: use the search endpoint for custom URLs and usernames
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        info.value
      )}&type=channel&maxResults=1&key=${apiKey}`,
      {
        headers: {
          'Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('YouTube API error (search):', response.status, errorText)
      return null
    }

    const data = await response.json()
    if (data.items && data.items.length > 0) {
      return data.items[0].id.channelId
    }

    return null
  } catch (error) {
    console.error('Error resolving channel ID:', error)
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
          'Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        },
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Invalid or expired access token')
        return false
      }
      const errorText = await response.text()
      console.error('YouTube API error (subscriptions):', response.status, errorText)
      return false
    }

    const data = await response.json()
    return data.items && data.items.length > 0
  } catch (error) {
    console.error('Error checking subscription:', error)
    return false
  }
}
