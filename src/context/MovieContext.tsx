import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tmdbAPI } from '@/lib/api';
import { localStorageKeys } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

export type MovieDetail = Movie & {
  backdrop_path: string;
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  videos: { results: { key: string; type: string }[] };
  credits: { cast: { id: number; name: string; character: string; profile_path: string }[] };
};

type GenreType = {
  id: number;
  name: string;
};

type MovieContextType = {
  searchResults: Movie[];
  trendingMovies: Movie[];
  movieDetail: MovieDetail | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchMovies: (query: string, page?: number) => Promise<void>;
  getMovieDetails: (id: number) => Promise<void>;
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (id: number) => void;
  isFavorite: (id: number) => boolean;
  genres: GenreType[];
  fetchTrending: () => Promise<void>;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem(localStorageKeys.LAST_SEARCH) || '';
  });
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const savedFavorites = localStorage.getItem(localStorageKeys.FAVORITES);
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [genres, setGenres] = useState<GenreType[]>([]);
  const { toast } = useToast();

  // Save last search query to localStorage
  useEffect(() => {
    if (searchQuery) {
      localStorage.setItem(localStorageKeys.LAST_SEARCH, searchQuery);
    }
  }, [searchQuery]);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(localStorageKeys.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbAPI.getGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  // Memoize functions with useCallback to prevent unnecessary re-renders
  const searchMovies = useCallback(async (query: string, page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tmdbAPI.searchMovies(query, page);
      setSearchResults(data.results || []);
      setSearchQuery(query);
    } catch (error) {
      setError('Failed to search movies. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to search movies. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getMovieDetails = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tmdbAPI.getMovieDetails(id);
      setMovieDetail(data);
    } catch (error) {
      setError('Failed to fetch movie details. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch movie details. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchTrending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tmdbAPI.getTrending();
      setTrendingMovies(data.results || []);
    } catch (error) {
      setError('Failed to fetch trending movies. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to fetch trending movies. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addToFavorites = (movie: Movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites(prev => [...prev, movie]);
      toast({
        title: "Success",
        description: `Added ${movie.title} to favorites`,
      });
    }
  };

  const removeFromFavorites = (id: number) => {
    const movieToRemove = favorites.find(movie => movie.id === id);
    setFavorites(prev => prev.filter(movie => movie.id !== id));
    if (movieToRemove) {
      toast({
        title: "Success",
        description: `Removed ${movieToRemove.title} from favorites`,
      });
    }
  };

  const isFavorite = (id: number) => favorites.some(movie => movie.id === id);

  return (
    <MovieContext.Provider
      value={{
        searchResults,
        trendingMovies,
        movieDetail,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        searchMovies,
        getMovieDetails,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        genres,
        fetchTrending,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
