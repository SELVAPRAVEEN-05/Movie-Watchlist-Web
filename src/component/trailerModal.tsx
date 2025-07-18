'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { MovieVideoResponse } from '@/types/movies'

interface TrailerModalProps {
  movieId: number
  onClose: () => void
}

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

export default function TrailerModal({ movieId, onClose }: TrailerModalProps) {
  const [videoKey, setVideoKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await axios.get<MovieVideoResponse>(
          `https://api.themoviedb.org/3/movie/${movieId}/videos`,
          {
            params: {
              api_key: API_KEY,
              language: 'en-US',
            },
          }
        )
        const trailer = response.data.results.find(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
        )
        setVideoKey(trailer?.key || null)
      } catch (error) {
        console.error('Error fetching trailer:', error)
      }
    }

    fetchTrailer()
  }, [movieId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-full max-w-4xl aspect-video bg-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
        >
          <X size={24} />
        </button>

        {videoKey ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Movie Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white text-xl">
            No trailer available
          </div>
        )}
      </div>
    </div>
  )
}
