'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GatedLink {
  id: string
  channelLink: string
  realLink: string
  fileName?: string
  createdAt: string
}

export default function DashboardPage() {
  const [youtubeChannelLink, setYoutubeChannelLink] = useState('')
  const [realLink, setRealLink] = useState('')
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [myLinks, setMyLinks] = useState<GatedLink[]>([])
  const [justGeneratedLink, setJustGeneratedLink] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('myGatedLinks')
    if (stored) {
      try {
        setMyLinks(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load my gated links', e)
      }
    }
  }, [])

  const handleCreateGate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!youtubeChannelLink.trim() || !realLink.trim() || !fileName.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (!youtubeChannelLink.includes('youtube.com') && !youtubeChannelLink.includes('youtu.be')) {
      alert('Please enter a valid YouTube channel link')
      return
    }

    setIsLoading(true)
    setJustGeneratedLink(null)

    const newLink: GatedLink = {
      id: Date.now().toString(),
      channelLink: youtubeChannelLink,
      realLink: realLink,
      fileName: fileName,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    }

    try {
      await fetch('/api/gated-links/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newLink }),
      })

      const updatedLinks = [newLink, ...myLinks]
      setMyLinks(updatedLinks)
      localStorage.setItem('myGatedLinks', JSON.stringify(updatedLinks))

      setYoutubeChannelLink('')
      setRealLink('')
      setFileName('')
      
      const domain = typeof window !== 'undefined' ? window.location.origin : ''
      setJustGeneratedLink(`${domain}/verify/${newLink.id}`)
      
    } catch (error) {
      console.error('Error creating gated link:', error)
      alert('Failed to create link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans relative">
      {/* Light Theme Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-red-50 to-white pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-red-500/20">
            A
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">Automatica</span>
        </Link>
        <Link href="/" className="text-gray-500 hover:text-gray-900 transition font-medium">
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        
        {/* Create Link Form */}
        <section className="w-full">
          <div className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium">Create a new gated link in seconds.</p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-400"></div>
            
            <form onSubmit={handleCreateGate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">1. Your YouTube Channel URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </div>
                    <input
                      type="url"
                      value={youtubeChannelLink}
                      onChange={(e) => setYoutubeChannelLink(e.target.value)}
                      placeholder="https://youtube.com/@mkbhd"
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all font-medium"
                      required
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">2. Secret Destination URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={realLink}
                    onChange={(e) => setRealLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">3. Name of File / Content</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g. Graphic Design Assets Pack"
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl hover:bg-black transition transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>Generate Gated Link ✨</>
                )}
              </button>
            </form>

            {/* Success Result */}
            {justGeneratedLink && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                <p className="text-sm font-bold text-green-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Success! Your link is ready to share
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input 
                    type="text" 
                    readOnly 
                    value={justGeneratedLink} 
                    className="flex-1 w-full bg-white border border-green-200 text-gray-800 py-3 px-4 rounded-lg outline-none font-mono text-sm shadow-inner"
                  />
                  <button 
                    onClick={() => copyToClipboard(justGeneratedLink)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition whitespace-nowrap shadow-md flex justify-center"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
