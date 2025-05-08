
import React from 'react';
import { useMovies } from '@/context/MovieContext';
import MovieGrid from '@/components/MovieGrid';
import { BookmarkX } from 'lucide-react';

const Favorites = () => {
  const { favorites } = useMovies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Your Favorite Movies</h1>
        
        {favorites.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your favorites
          </div>
        )}
      </div>

      <MovieGrid 
        movies={favorites} 
        emptyMessage={
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookmarkX className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">You haven't added any movies to your favorites yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Explore movies and add them to your collection
            </p>
          </div>
        }
      />
    </div>
  );
};

export default Favorites;
