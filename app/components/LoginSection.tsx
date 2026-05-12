'use client'

import { useState } from 'react'

interface LoginSectionProps {
  onLogin: (username: string) => void
}

export default function LoginSection({ onLogin }: LoginSectionProps) {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      alert('Please enter a username')
      return
    }

    setIsLoading(true)
    // Simulate dummy login
    setTimeout(() => {
      onLogin(username)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="w-full max-w-md mx-auto mb-12">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Demo login - Enter any username to continue
        </p>
      </form>
    </div>
  )
}
