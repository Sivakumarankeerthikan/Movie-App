
import React, { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/context/MovieContext';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  emptyMessage?: React.ReactNode | string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, emptyMessage = "No movies found" }) => {
  const [displayCount, setDisplayCount] = useState(12);

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 12);
  };

  if (!movies.length) {
    return (
      <div className="flex items-center justify-center h-40">
        {typeof emptyMessage === 'string' ? (
          <p className="text-muted-foreground">{emptyMessage}</p>
        ) : (
          emptyMessage
        )}
      </div>
    );
  }

  const moviesToShow = movies.slice(0, displayCount);
  const hasMore = displayCount < movies.length;

  return (
    <div className="space-y-6">
      <div className="movie-grid">
        {moviesToShow.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={loadMore} variant="outline" className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            <span>Load More</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
