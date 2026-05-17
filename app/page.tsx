import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden">
      {/* Light Theme Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-red-50 via-white to-white pointer-events-none -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-red-400/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-red-500/20">
            A
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">Automatica</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-600">
          <a href="#" className="hover:text-red-600 transition">How it Works</a>
          <a href="#" className="hover:text-red-600 transition">Pricing</a>
          <Link href="/dashboard" className="bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition shadow-md">
            Create Link
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-red-200 bg-red-50 text-sm font-bold text-red-600 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          100% Free forever
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-gray-900">
          Turn your viewers into <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">loyal subscribers.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10 font-medium">
          Gate your exclusive content, downloads, and secret links. Users must subscribe to your YouTube channel to unlock access. Supercharge your channel growth instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/dashboard"
            className="px-8 py-4 bg-red-600 text-white font-bold text-lg rounded-2xl hover:bg-red-700 transition transform hover:-translate-y-1 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] flex items-center gap-2"
          >
            Start For Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link 
            href="/dashboard"
            className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-2xl border border-gray-200 hover:bg-gray-50 transition shadow-sm"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Feature Highlights (Optional Visuals) */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Create Links Instantly</h3>
            <p className="text-gray-500 font-medium">Paste your YouTube URL and your secret destination. We handle the rest.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Grow Subscriptions</h3>
            <p className="text-gray-500 font-medium">Watch your channel metrics skyrocket as users subscribe to access your content.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mx-auto mb-6">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">100% Free & Secure</h3>
            <p className="text-gray-500 font-medium">No account required. Your generated links are saved locally in your browser.</p>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 font-medium">&copy; 2026 Automatica. The universal content unlocker.</p>
        </div>
      </footer>
    </main>
  )
}