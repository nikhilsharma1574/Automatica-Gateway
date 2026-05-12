'use client'

import { useState } from 'react'
import Navbar from './components/Navbar'
import LandingSection from './components/LandingSection'
import LoginSection from './components/LoginSection'
import CreatorDashboard from './components/CreatorDashboard'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = (user: string) => {
    setUsername(user)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <LandingSection />

      <div className="px-6 py-12">
        {!isLoggedIn ? (
          <LoginSection onLogin={handleLogin} />
        ) : (
          <div>
            <div className="flex justify-end mb-6">
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
            <CreatorDashboard username={username} />
          </div>
        )}
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2026 Automatica. Gate your content behind YouTube subscriptions.</p>
        </div>
      </footer>
    </main>
  )
}