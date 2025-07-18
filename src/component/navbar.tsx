'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Film, Bookmark, Menu, X } from 'lucide-react'
import { getWatchlist } from '@/lib/watchlist'

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [watchlistCount, setWatchlistCount] = useState(0)

  useEffect(() => {
    const updateWatchlistCount = () => {
      const watchlist = getWatchlist()
      setWatchlistCount(watchlist.length)
    }

    updateWatchlistCount()

    // Listen for storage changes to update count
    const handleStorageChange = () => {
      updateWatchlistCount()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for when watchlist changes within the same tab
    window.addEventListener('watchlistChanged', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('watchlistChanged', handleStorageChange)
    }
  }, [])

  const navLinks = [
    { href: '/', label: 'Home', icon: Film },
    { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900">MovieList</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.href === '/watchlist' && watchlistCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                      {watchlistCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                    {link.href === '/watchlist' && watchlistCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                        {watchlistCount}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}