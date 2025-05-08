
import React from 'react';
import { useMovies } from '@/context/MovieContext';
import MovieGrid from '@/components/MovieGrid';
import { HeartCrack } from 'lucide-react';

const Wishlist = () => {
  const { favorites } = useMovies();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
        
        {favorites.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} in your wishlist
          </div>
        )}
      </div>

      <MovieGrid 
        movies={favorites} 
        emptyMessage={
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <HeartCrack className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add movies to your wishlist by clicking the heart icon on movie cards
            </p>
          </div>
        }
      />
    </div>
  );
};

export default Wishlist;
