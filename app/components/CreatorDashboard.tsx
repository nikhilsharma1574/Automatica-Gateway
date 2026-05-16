'use client'

import React, { useState } from 'react'

interface CreatorDashboardProps {
  username: string
}

export default function CreatorDashboard({ username }: CreatorDashboardProps) {
  const [youtubeChannelLink, setYoutubeChannelLink] = useState('')
  const [realLink, setRealLink] = useState('')
  const [gatedLinks, setGatedLinks] = useState<
    Array<{ id: string; channelLink: string; realLink: string; createdAt: string }>
  >([])
  const [isLoading, setIsLoading] = useState(false)

  // Load gated links from Vercel KV on mount
  React.useEffect(() => {
    const loadLinks = async () => {
      try {
        const response = await fetch('/api/gated-links/get')
        const data = await response.json()
        if (data.gatedLinks) {
          setGatedLinks(data.gatedLinks)
        }
      } catch (error) {
        console.error('Failed to load gated links:', error)
        // Fallback to localStorage for development
        const stored = localStorage.getItem('gatedLinks')
        if (stored) {
          try {
            setGatedLinks(JSON.parse(stored))
          } catch (e) {
            console.error('Failed to load gated links from localStorage:', e)
          }
        }
      }
    }
    loadLinks()
  }, [])

  const handleCreateGate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!youtubeChannelLink.trim() || !realLink.trim()) {
      alert('Please fill in both fields')
      return
    }

    if (!youtubeChannelLink.includes('youtube.com') && !youtubeChannelLink.includes('youtu.be')) {
      alert('Please enter a valid YouTube channel link')
      return
    }

    setIsLoading(true)

    const newLink = {
      id: Date.now().toString(),
      channelLink: youtubeChannelLink,
      realLink: realLink,
      createdAt: new Date().toLocaleString(),
    }
    const updatedLinks = [...gatedLinks, newLink]

    try {
      setGatedLinks(updatedLinks)

      // Save to Vercel KV
      const response = await fetch('/api/gated-links/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gatedLinks: updatedLinks }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.warn('KV save failed:', errorData?.error || response.statusText)

        // Fallback to localStorage when KV is unavailable
        localStorage.setItem('gatedLinks', JSON.stringify(updatedLinks))
        setYoutubeChannelLink('')
        setRealLink('')
        setIsLoading(false)
        return
      }

      // Also save to localStorage as fallback for faster local access
      localStorage.setItem('gatedLinks', JSON.stringify(updatedLinks))

      setYoutubeChannelLink('')
      setRealLink('')
    } catch (error) {
      console.error('Error creating gated link:', error)
      // Fallback to localStorage when network or KV errors happen
      localStorage.setItem('gatedLinks', JSON.stringify(updatedLinks))
      setYoutubeChannelLink('')
      setRealLink('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {username}!</h2>
        <p className="text-gray-700">Create gated links for your YouTube subscribers</p>
      </div>

      {/* Create New Gated Link Form */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Gated Link</h3>

        <form onSubmit={handleCreateGate}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              YouTube Channel Link
            </label>
            <input
              type="url"
              value={youtubeChannelLink}
              onChange={(e) => setYoutubeChannelLink(e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-sm mt-1">
              Viewers will need to subscribe to this channel to access the real link
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Real Link (Destination URL)
            </label>
            <input
              type="url"
              value={realLink}
              onChange={(e) => setRealLink(e.target.value)}
              placeholder="https://example.com/your-content"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-gray-500 text-sm mt-1">
              This link will be shown only to verified subscribers
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Gated Link'}
          </button>
        </form>
      </div>

      {/* Display Gated Links */}
      {gatedLinks.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Gated Links</h3>

          <div className="space-y-4">
            {gatedLinks.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">YouTube Channel</p>
                  <a
                    href={link.channelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 font-semibold hover:underline break-all"
                  >
                    {link.channelLink}
                  </a>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Real Link</p>
                  <a
                    href={link.realLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold hover:underline break-all"
                  >
                    {link.realLink}
                  </a>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Gatekeeper URL</p>
                  <div className="bg-gray-100 px-3 py-2 rounded text-sm break-all">
                    <a
                      href={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${link.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline break-all"
                    >
                      {`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${link.id}`}
                    </a>
                  </div>
                </div>

                <p className="text-xs text-gray-500">Created: {link.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {gatedLinks.length === 0 && (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-600 text-lg">No gated links yet. Create one to get started!</p>
        </div>
      )}
    </div>
  )
}
