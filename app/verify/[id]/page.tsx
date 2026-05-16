'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import Navbar from '@/app/components/Navbar'

function GoogleSignInButton({ onSuccess, onError }: { onSuccess: (token: string) => void, onError: () => void }) {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => onSuccess(tokenResponse.access_token),
    onError: () => onError(),
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  return (
    <button
      onClick={() => login()}
      className="w-full bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center justify-center gap-3 transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
      Sign in with Google
    </button>
  );
}

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
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

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

  const handleVerifySubscription = async () => {
    if (!accessToken || !gatedLink) {
      setVerificationError('Please sign in with Google first')
      return
    }

    setIsVerifying(true)
    setVerificationError(null)

    try {
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          channelUrl: gatedLink.channelLink,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setVerificationError(data.error || 'Verification failed')
        setIsVerifying(false)
        return
      }

      if (data.isSubscribed) {
        setIsVerified(true)
      } else {
        setVerificationError(
          'You are not subscribed to this channel. Please subscribe to access the content.'
        )
      }
    } catch (err: any) {
      setVerificationError(err.message || 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleGoogleSuccess = (token: string) => {
    setAccessToken(token)
  }

  const handleAccessContent = () => {
    if (gatedLink) {
      window.open(gatedLink.realLink, '_blank')
    }
  }

  if (isLoading && !gatedLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
        <Navbar />
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
        <Navbar />
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Subscription</h1>
            <p className="text-gray-600">To access this content, you need to verify your subscription</p>
          </div>

          {/* YouTube Channel Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Required Subscription</h2>
            <p className="text-gray-600 mb-4">Subscribe to this YouTube channel to access the content:</p>
            <a
              href={gatedLink.channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Visit YouTube Channel
              <span className="ml-2">→</span>
            </a>
          </div>

          {/* Verification Status */}
          {!isVerified ? (
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Step 1: Sign In with Google</h3>
                <p className="text-blue-800 mb-6">
                  Sign in with your Google account that's associated with your YouTube subscription.
                </p>

                {!accessToken ? (
                  <div className="flex justify-center mb-6 max-w-sm mx-auto">
                    <GoogleSignInButton
                      onSuccess={handleGoogleSuccess}
                      onError={() => setVerificationError('Google sign-in failed')}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-green-700 mb-6 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Signed in with Google
                    </p>

                    {verificationError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700 text-sm">{verificationError}</p>
                      </div>
                    )}

                    <button
                      onClick={handleVerifySubscription}
                      disabled={isVerifying}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {isVerifying ? 'Checking Subscription...' : 'Verify Subscription'}
                    </button>
                  </div>
                )}
              </div>
            </GoogleOAuthProvider>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <span className="text-xl">✓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-900">Subscription Verified!</h3>
                </div>
              </div>
              <p className="text-green-800">
                Your subscription has been verified. You can now access the content.
              </p>
            </div>
          )}

          {/* Access Content Button */}
          {isVerified && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Access Content</h3>
              <button
                onClick={handleAccessContent}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition"
              >
                Open Content Link
              </button>
              <p className="text-gray-600 text-sm mt-4 text-center">
                The content will open in a new tab
              </p>
            </div>
          )}

          {/* Link Details */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Link Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Link ID:</p>
                <code className="bg-white px-3 py-1 rounded border border-gray-200 text-gray-800">
                  {gatedLink.id}
                </code>
              </div>
              <div>
                <p className="text-gray-600">Created:</p>
                <p className="text-gray-800">{gatedLink.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Automatica. Gate your content behind YouTube subscriptions.</p>
        </div>
      </footer>
    </div>
  )
}
