import { Movie } from '@/types/movies'

const WATCHLIST_KEY = 'movie_watchlist'

export const getWatchlist = (): Movie[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(WATCHLIST_KEY)
  return stored ? JSON.parse(stored) : []
}

export const addToWatchlist = (movie: Movie): void => {
  if (typeof window === 'undefined') return
  
  const watchlist = getWatchlist()
  const isAlreadyInList = watchlist.some(item => item.id === movie.id)
  
  if (!isAlreadyInList) {
    const updatedWatchlist = [...watchlist, movie]
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist))
  }
}

export const removeFromWatchlist = (movieId: number): void => {
  if (typeof window === 'undefined') return
  
  const watchlist = getWatchlist()
  const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId)
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist))
}

export const isInWatchlist = (movieId: number): boolean => {
  if (typeof window === 'undefined') return false
  
  const watchlist = getWatchlist()
  return watchlist.some(movie => movie.id === movieId)
}

export const clearWatchlist = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(WATCHLIST_KEY)
}