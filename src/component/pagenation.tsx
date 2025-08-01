import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null

  const maxVisiblePages = 5
  const halfVisible = Math.floor(maxVisiblePages / 2)

  let startPage = Math.max(1, currentPage - halfVisible)
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-md transition-colors ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Show first page if we're not starting from 1 */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md transition-colors ${page === currentPage
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {page}
        </button>
      ))}

      {/* Show last page if we're not ending at totalPages */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md transition-colors ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
          }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}