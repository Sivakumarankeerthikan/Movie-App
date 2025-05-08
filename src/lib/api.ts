
import axios from 'axios';

// TMDB API base URL and key
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '2dca580c2a14b55200e784d157207b4d'; // Public API key for demo purposes

// Image URLs
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
export const POSTER_SIZE = 'w500';
export const BACKDROP_SIZE = 'original';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// API endpoints
export const tmdbAPI = {
  // Get trending movies
  getTrending: async (page = 1) => {
    try {
      const response = await api.get('/trending/movie/week', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Search movies by query
  searchMovies: async (query: string, page = 1) => {
    try {
      if (!query.trim()) return { results: [] };
      
      const response = await api.get('/search/movie', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details by ID
  getMovieDetails: async (movieId: number) => {
    try {
      const response = await api.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,credits',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching details for movie ${movieId}:`, error);
      throw error;
    }
  },

  // Filter movies by parameters
  discoverMovies: async (params: any) => {
    try {
      const response = await api.get('/discover/movie', { params });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  },

  // Get movie genres
  getGenres: async () => {
    try {
      const response = await api.get('/genre/movie/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }
};
