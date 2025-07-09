import MovieCard from './MoviesCard'
import { Movie } from '@/types/movies'

interface MovieGridProps {
  movies: Movie[]
}

export default function MovieGrid({ movies }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          No movies found
        </h2>
        <p className="text-gray-600">
          Try adjusting your search or browse popular movies
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}