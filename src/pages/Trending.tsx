
import React, { useEffect } from 'react';
import { useMovies } from '@/context/MovieContext';
import MovieGrid from '@/components/MovieGrid';

const Trending = () => {
  const { trendingMovies, fetchTrending, isLoading } = useMovies();

  // We need to fix the dependency array to prevent infinite rendering
  useEffect(() => {
    // Fetch trending movies on component mount
    fetchTrending();
    // By removing fetchTrending from the dependency array, we prevent the continuous loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trending Movies This Week</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-md bg-muted h-64"></div>
          ))}
        </div>
      ) : (
        <MovieGrid 
          movies={trendingMovies} 
          emptyMessage="No trending movies available right now. Check back later!"
        />
      )}
    </div>
  );
};

export default Trending;
