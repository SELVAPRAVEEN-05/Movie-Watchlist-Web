import axios from 'axios'
import { Movie, MovieDetails, MovieSearchResponse } from '@/types/movies'

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'your_api_key_here'
const BASE_URL = 'https://api.themoviedb.org/3'

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

export const searchMovies = async (query: string, page: number = 1): Promise<MovieSearchResponse> => {
  const response = await api.get('/search/movie', {
    params: {
      query,
      page,
      include_adult: false,
    },
  })
  return response.data
}

export const getPopularMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  const response = await api.get('/movie/popular', {
    params: {
      page,
    },
  })
  return response.data
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const response = await api.get(`/movie/${id}`)
  return response.data
}

export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieSearchResponse> => {
  const response = await api.get(`/trending/movie/${timeWindow}`)
  return response.data
}

export const getTopRatedMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  const response = await api.get('/movie/top_rated', {
    params: {
      page,
    },
  })
  return response.data
}

export const getUpcomingMovies = async (page: number = 1): Promise<MovieSearchResponse> => {
  const response = await api.get('/movie/upcoming', {
    params: {
      page,
    },
  })
  return response.data
}