'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, Calendar, Plus, Check, Play } from 'lucide-react'
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
      className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(movie)}
    >
      {/* Blurred background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
              : '/placeholder-movie.jpg'
          }
          alt=""
          fill
          className="object-cover blur-lg opacity-30"
        />
      </div>

      {/* Poster */}
      <div className="relative z-10">
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/placeholder-movie.jpg'
          }
          alt={movie.title}
          width={500}
          height={750}
          className="w-full h-72 object-cover"
        />
      </div>

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 z-20 p-4 flex flex-col justify-between bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>

          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-full shadow transition-colors ${
              inWatchlist
                ? 'bg-green-500 text-white'
                : 'bg-white bg-opacity-80 text-gray-800 hover:bg-opacity-100'
            }`}
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Details */}
        <div className="text-white space-y-2">
          <h3 className="text-lg font-bold line-clamp-2">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{releaseYear}</span>
          </div>

          {/* Overview added here */}
          <p className="text-sm text-gray-200 line-clamp-3 leading-snug">
            {movie.overview || 'No description available.'}
          </p>

          <button
            className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full border border-white/20 backdrop-blur-sm"
          >
            <Play className="w-4 h-4" />
            Watch Trailer
          </button>
        </div>
      </div>
    </div>
  )
}
