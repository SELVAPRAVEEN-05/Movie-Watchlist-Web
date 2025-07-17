'use client'

import { useState } from 'react'
import { X, Filter, Star, Calendar, TrendingUp } from 'lucide-react'
import { Genre } from '@/types/movies'

interface FilterModalProps {
  genres: Genre[]
  initialSelectedGenres: number[]
  initialMinRating: number
  initialSortBy: string
  onClose: () => void
  onApply: (newFilters: {
    genres: number[]
    minRating: number
    sortBy: string
  }) => void
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity Descending', icon: TrendingUp },
  { value: 'popularity.asc', label: 'Popularity Ascending', icon: TrendingUp },
  { value: 'release_date.desc', label: 'Release Date Descending', icon: Calendar },
  { value: 'release_date.asc', label: 'Release Date Ascending', icon: Calendar },
  { value: 'vote_average.desc', label: 'Rating Descending', icon: Star },
  { value: 'vote_average.asc', label: 'Rating Ascending', icon: Star },
]

export default function FilterModal({
  genres,
  initialSelectedGenres,
  initialMinRating,
  initialSortBy,
  onClose,
  onApply
}: FilterModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>(initialSelectedGenres)
  const [minRating, setMinRating] = useState(initialMinRating)
  const [sortBy, setSortBy] = useState(initialSortBy)

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    )
  }

  const handleApply = () => {
    onApply({ genres: selectedGenres, minRating, sortBy })
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setMinRating(0)
    setSortBy('popularity.desc')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Filter & Sort Movies</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {/* Genres */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Genres</h3>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {selectedGenres.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {genres.map((genre) => (
                <label
                  key={genre.id}
                  className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedGenres.includes(genre.id)
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre.id)}
                    onChange={() => toggleGenre(genre.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedGenres.includes(genre.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedGenres.includes(genre.id) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Minimum Rating</h3>
              <div className="flex items-center space-x-1 text-amber-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{minRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                min={0}
                max={10}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(minRating / 10) * 100}%, #e5e7eb ${(minRating / 10) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.0</span>
                <span>5.0</span>
                <span>10.0</span>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sort By</h3>
            <div className="space-y-2">
              {SORT_OPTIONS.map((option) => {
                const IconComponent = option.icon
                return (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      sortBy === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        sortBy === option.value ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    >
                      {sortBy === option.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <IconComponent className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium underline"
            >
              Clear all filters
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
