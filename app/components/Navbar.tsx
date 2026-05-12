export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">Automatica</div>
        <div className="flex gap-6 items-center">
          <a href="#" className="text-white hover:text-gray-200 font-medium">
            Home
          </a>
          <a href="#" className="text-white hover:text-gray-200 font-medium">
            About
          </a>
          <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
