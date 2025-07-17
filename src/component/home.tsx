'use client'

import { useState, useEffect, useCallback } from 'react'
import { searchMovies, getPopularMovies, getGenres, getFilteredMovies } from '@/lib/api'
import { Movie, Genre } from '@/types/movies'
import SearchBar from '@/component/Searchbar'
import MovieGrid from '@/component/MoviesGrid'
import Pagination from '@/component/Pagenation'
import FilterModal from '@/component/filter'

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const [showFilter, setShowFilter] = useState(false)
  const [genres, setGenres] = useState<Genre[]>([])

  const [filters, setFilters] = useState({
    genres: [] as number[],
    minRating: 0,
    sortBy: 'popularity.desc',
  })

  // Load genres once
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres()
        setGenres(genreList)
      } catch (error) {
        console.error('Failed to load genres', error)
      }
    }
    fetchGenres()
  }, [])

  // Load popular movies initially or on filters change (only when no search query)
  const loadPopularMovies = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      let data
      if (filters.genres.length || filters.minRating > 0 || filters.sortBy !== 'popularity.desc') {
        data = await getFilteredMovies({
          page,
          with_genres: filters.genres.length ? filters.genres.join(',') : undefined,
          sort_by: filters.sortBy,
          'vote_average.gte': filters.minRating > 0 ? filters.minRating : undefined,
        })
      } else {
        data = await getPopularMovies(page)
      }
      setMovies(data.results)
      setTotalPages(Math.min(data.total_pages, 500)) // TMDB limits to 500
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading popular movies:', error)
      setMovies([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (!searchQuery.trim()) {
      loadPopularMovies(1)
    }
  }, [loadPopularMovies, searchQuery])

  // Search ignoring filters for simplicity (TMDB search does not support filtering by genre, rating, or sorting)
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchQuery('')
      loadPopularMovies(1)
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

  // Page change supports filters or search accordingly
  const handlePageChange = async (page: number) => {
    setLoading(true)
    try {
      let data
      if (searchQuery) {
        data = await searchMovies(searchQuery, page)
      } else if (filters.genres.length || filters.minRating > 0 || filters.sortBy !== 'popularity.desc') {
        data = await getFilteredMovies({
          page,
          with_genres: filters.genres.length ? filters.genres.join(',') : undefined,
          sort_by: filters.sortBy,
          'vote_average.gte': filters.minRating > 0 ? filters.minRating : undefined,
        })
      } else {
        data = await getPopularMovies(page)
      }
      setMovies(data.results || [])
      setCurrentPage(page)
      setTotalPages(Math.min(data.total_pages || 1, 500))
    } catch (error) {
      console.error('Error loading page:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setShowFilter(false)
    setSearchQuery('')
    loadPopularMovies(1)
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

      <div className="flex space-x-2 ">
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => setShowFilter(true)}
          aria-label="Open filter modal"
          className="px-4 h-[55px] rounded border border-gray-300 hover:bg-gray-100"
          title="Filter & Sort"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
        </button>
      </div>

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

      {showFilter && (
        <FilterModal
          genres={genres}
          initialSelectedGenres={filters.genres}
          initialMinRating={filters.minRating}
          initialSortBy={filters.sortBy}
          onClose={() => setShowFilter(false)}
          onApply={handleApplyFilters}
        />
      )}

    </div>
  )
}
