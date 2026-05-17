'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface GatedLink {
  id: string
  channelLink: string
  realLink: string
  createdAt: string
}

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [gatedLink, setGatedLink] = useState<GatedLink | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const loadLink = async () => {
      try {
        const response = await fetch('/api/gated-links/get')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load gated links')
        }

        if (data.gatedLinks && Array.isArray(data.gatedLinks)) {
          const link = data.gatedLinks.find((l: GatedLink) => l.id === id)
          if (link) {
            setGatedLink(link)
          } else {
            setError('Gated link not found')
          }
        } else {
          setError('No gated links found. This link may have expired.')
        }
      } catch (e: any) {
        console.error('Error loading gated links:', e)
        // Fallback to localStorage for development
        const stored = localStorage.getItem('gatedLinks')
        if (stored) {
          try {
            const links: GatedLink[] = JSON.parse(stored)
            const link = links.find(l => l.id === id)
            if (link) {
              setGatedLink(link)
            } else {
              setError('Gated link not found')
            }
          } catch (err) {
            setError('Failed to load gated link')
          }
        } else {
          setError(e.message || 'No gated links found. This link may have expired.')
        }
      }
      setIsLoading(false)
    }

    loadLink()
  }, [id])

  const handleSubscribeClick = () => {
    if (!gatedLink) return

    // Append ?sub_confirmation=1 to auto-show the subscribe popup if it's a youtube link
    let subscribeUrl = gatedLink.channelLink
    if (subscribeUrl.includes('youtube.com') && !subscribeUrl.includes('sub_confirmation')) {
      subscribeUrl += subscribeUrl.includes('?') ? '&sub_confirmation=1' : '?sub_confirmation=1'
    }

    // Open YouTube channel in a new tab
    window.open(subscribeUrl, '_blank')

    // Start verification sequence
    setIsVerifying(true)

    // Wait 6 seconds to give them time to click subscribe, then unlock the content
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
    }, 6000)
  }

  const handleAccessContent = () => {
    if (gatedLink) {
      window.open(gatedLink.realLink, '_blank')
    }
  }

  if (isLoading && !gatedLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white shadow-sm">
              A
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Automatica</span>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white shadow-sm">
              A
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Automatica</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Error</h1>
            <p className="text-red-700 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!gatedLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-6 bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white shadow-sm">
              A
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Automatica</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-yellow-800 mb-4">Link Not Found</h1>
            <p className="text-yellow-700 mb-6">This gated link does not exist or has expired.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex items-center justify-center py-6 bg-white border-b border-gray-100 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white shadow-sm">
            A
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">Automatica</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Unlock Content</h1>
            <p className="text-gray-600">Please complete the step below to unlock the hidden link</p>
          </div>

          {/* Verification Status */}
          {!isVerified ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Step 1: Subscribe to Channel</h3>
              <p className="text-blue-800 mb-6">
                Click the button below to subscribe. The content will unlock automatically after you subscribe.
              </p>

              {isVerifying ? (
                <div className="py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                  <p className="text-blue-700 font-medium animate-pulse">Waiting for verification...</p>
                </div>
              ) : (
                <button
                  onClick={handleSubscribeClick}
                  className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 transition transform hover:scale-105 shadow-md flex items-center justify-center mx-auto gap-3"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Subscribe on YouTube
                </button>
              )}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-900 mb-2">Unlocked successfully!</h3>
                <p className="text-green-800">
                  Thank you! You can now access your content below.
                </p>
              </div>
            </div>
          )}

          {/* Access Content Button */}
          <div className={`transition-all duration-500 ${isVerified ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Step 2: Access Content</h3>
              <button
                onClick={handleAccessContent}
                disabled={!isVerified}
                className={`w-full font-bold py-4 rounded-xl transition shadow-md text-lg ${
                  isVerified 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-1' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isVerified ? 'Go to Destination Link ✨' : 'Locked'}
              </button>
            </div>
          </div>
        </div>

        {/* Link Details Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
           <p>Gated link ID: {gatedLink.id}</p>
        </div>
      </div>

      <footer className="py-10 mt-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-gray-400">&copy; 2026 Automatica. The universal content unlocker.</p>
        </div>
      </footer>
    </div>
  )
}
