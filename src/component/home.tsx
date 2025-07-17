'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchMovies, getPopularMovies } from '@/lib/api'
import { Movie } from '@/types/movies'
import SearchBar from '@/component/Searchbar'
import MovieGrid from '@/component/MoviesGrid'
import Pagination from '@/component/Pagenation'
import TrailerModal from '@/component/TrailerModal'

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const loadPopularMovies = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPopularMovies(1)
      setMovies(data.results)
      setTotalPages(Math.min(data.total_pages, 500))
      setCurrentPage(1)
    } catch (error) {
      console.error('Error loading popular movies:', error)
      setMovies([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPopularMovies()
  }, [])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadPopularMovies()
      setSearchQuery('')
      return
    }

    setLoading(true)
    setSearchQuery(query)
    try {
      const data = await searchMovies(query, 1)
      setMovies(data.results || [])
      setTotalPages(Math.min(data.total_pages || 1, 500))
      setCurrentPage(1)
    } catch (error) {
      console.error('Error searching movies:', error)
      setMovies([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    setLoading(true)
    try {
      const data = searchQuery
        ? await searchMovies(searchQuery, page)
        : await getPopularMovies(page)
      setMovies(data.results || [])
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading page:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Movie Search & Watchlist
        </h1>
        <p className="text-gray-600 text-lg">
          Discover movies and build your personal watchlist
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} onSelectMovie={setSelectedMovie} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {selectedMovie && (
        <TrailerModal movieId={selectedMovie.id} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  )
}
