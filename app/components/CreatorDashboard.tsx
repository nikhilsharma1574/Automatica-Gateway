'use client'

import { useState } from 'react'

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

    // Simulate creating a gated link
    setTimeout(() => {
      const newLink = {
        id: Date.now().toString(),
        channelLink: youtubeChannelLink,
        realLink: realLink,
        createdAt: new Date().toLocaleString(),
      }
      setGatedLinks([...gatedLinks, newLink])
      setYoutubeChannelLink('')
      setRealLink('')
      setIsLoading(false)
    }, 500)
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
                  <code className="bg-gray-100 px-3 py-2 rounded text-sm break-all">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/verify/${link.id}`}
                  </code>
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
