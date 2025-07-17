'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Calendar, Plus, Check } from 'lucide-react'
import { Movie } from '@/types/movies'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist'

interface MovieCardProps {
  movie: Movie
  onSelect?: (movie: Movie) => void
}

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  const [inWatchlist, setInWatchlist] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setInWatchlist(isInWatchlist(movie.id))
  }, [movie.id])

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      setInWatchlist(false)
    } else {
      addToWatchlist(movie)
      setInWatchlist(true)
    }

    window.dispatchEvent(new Event('watchlistChanged'))
  }

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'
  const rating = movie.vote_average || 0

  return (
    <div
      className="card group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(movie)}
    >
      <div className="relative overflow-hidden">
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.jpg'
          }
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleWatchlistToggle}
              className={`p-2 rounded-full transition-colors ${
                inWatchlist 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white bg-opacity-80 text-gray-800 hover:bg-opacity-100'
              }`}
            >
              {inWatchlist ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{releaseYear}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {movie.overview || 'No description available.'}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({movie.vote_count} votes)</span>
          </div>
          <span className="text-sm text-gray-500">{releaseYear}</span>
        </div>
      </div>
    </div>
  )
}
