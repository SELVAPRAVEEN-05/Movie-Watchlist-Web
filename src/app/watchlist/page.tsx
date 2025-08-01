'use client'

import MovieGrid from '@/component/moviesGrid'
import TrailerModal from '@/component/trailerModal'
import { getWatchlist } from '@/lib/watchlist'
import { Movie } from '@/types/movies'
import { useState, useEffect } from 'react'


export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    loadWatchlist()
    
    const update = () => loadWatchlist()
    window.addEventListener('watchlistChanged', update)
    return () => window.removeEventListener('watchlistChanged', update)
  }, [])

  const loadWatchlist = () => {
    setLoading(true)
    try {
      const watchlistMovies = getWatchlist()
      setWatchlist(watchlistMovies)
    } catch (error) {
      console.error('Error loading watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Watchlist</h1>
        <p className="text-gray-600 text-lg">
          {watchlist.length === 0 
            ? 'Your watchlist is empty. Start adding movies!' 
            : `You have ${watchlist.length} movie${watchlist.length > 1 ? 's' : ''} in your watchlist`}
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            No movies in your watchlist yet
          </h2>
          <p className="text-gray-600 mb-6">
            Browse movies and add them to your watchlist to keep track of what you want to watch
          </p>
          <a href="/" className="btn btn-primary">Discover Movies</a>
        </div>
      ) : (
        <MovieGrid movies={watchlist} onSelectMovie={setSelectedMovie} />
      )}

      {selectedMovie && (
        <TrailerModal
          movieId={selectedMovie.id}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}
