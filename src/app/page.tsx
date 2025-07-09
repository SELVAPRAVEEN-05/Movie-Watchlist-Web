'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/component/Searchbar'
import MovieGrid from '@/component/MoviesGrid'
import Pagination from '@/component/Pagenation'
import { searchMovies, getPopularMovies } from '@/lib/api'
import { Movie } from '@/types/movies'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPopularMovies()
  }, [])

  const loadPopularMovies = async () => {
    setLoading(true)
    try {
      const data = await getPopularMovies(1)
      setMovies(data.results)
      setTotalPages(data.total_pages)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error loading popular movies:', error)
    } finally {
      setLoading(false)
    }
  }

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
      setMovies(data.results)
      setTotalPages(data.total_pages)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error searching movies:', error)
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
      setMovies(data.results)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading page:', error)
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
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}