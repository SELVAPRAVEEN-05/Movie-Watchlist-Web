'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Star, Calendar, Clock, Plus, Check } from 'lucide-react'
import { getMovieDetails } from '@/lib/api'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/watchlist'
import { MovieDetails } from '@/types/movies'

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    if (id) {
      loadMovieDetails()
      checkWatchlistStatus()
    }
  }, [id])

  const loadMovieDetails = async () => {
    setLoading(true)
    try {
      const data = await getMovieDetails(Number(id))
      setMovie(data)
    } catch (error) {
      console.error('Error loading movie details:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkWatchlistStatus = () => {
    setInWatchlist(isInWatchlist(Number(id)))
  }

  const handleWatchlistToggle = () => {
    if (!movie) return

    if (inWatchlist) {
      removeFromWatchlist(movie.id)
      setInWatchlist(false)
    } else {
      addToWatchlist(movie)
      setInWatchlist(true)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Movie not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <Image
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-movie.jpg'
              }
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
              <button
                onClick={handleWatchlistToggle}
                className={`btn ${inWatchlist ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.runtime} min</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
            </div>

            {movie.production_companies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Production Companies</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.production_companies.map((company) => (
                    <span
                      key={company.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {company.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.tagline && (
              <div className="mb-4">
                <p className="text-gray-600 italic">"{movie.tagline}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}