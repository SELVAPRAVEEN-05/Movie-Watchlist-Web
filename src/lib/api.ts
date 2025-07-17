import axios from 'axios'
import { Movie, MovieDetails, MovieSearchResponse } from '@/types/movies'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

if (!API_KEY) {
  console.error('TMDB API Key is missing. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file')
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const searchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured')
    }
    
    const response = await api.get('/search/movie', {
      params: {
        api_key: API_KEY,
        query,
        page,
        include_adult: false,
        language: 'en-US',
      },
    })
    console.log('Search response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error searching movies:', error)
    throw error
  }
}

export const getPopularMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured')
    }
    
    const response = await api.get('/movie/popular', {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  try {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured')
    }
    
    const response = await api.get(`/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching movie details:', error)
    throw error
  }
}

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieSearchResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured')
    }
    
    const response = await api.get(`/trending/movie/${timeWindow}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    throw error
  }
}

export const getTopRatedMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured')
    }
    
    const response = await api.get('/movie/top_rated', {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching top rated movies:', error)
    throw error
  }
}

export const getUpcomingMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('TMDB API Key is not configured')
    }
    
    const response = await api.get('/movie/upcoming', {
      params: {
        api_key: API_KEY,
        page,
        language: 'en-US',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching upcoming movies:', error)
    throw error
  }
}