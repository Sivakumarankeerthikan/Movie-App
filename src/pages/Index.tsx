
import React, { useEffect } from 'react';
import { useMovies } from '@/context/MovieContext';
import MovieGrid from '@/components/MovieGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Clapperboard } from 'lucide-react';

const Index = () => {
  const { trendingMovies, fetchTrending, favorites } = useMovies();

  useEffect(() => {
    // Fetch trending movies when component mounts
    fetchTrending();
  }, [fetchTrending]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Movie Explorer</h1>
        <p className="text-muted-foreground max-w-lg">
          Discover trending movies and create your own movie collection.
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/trending">
            <Clapperboard className="h-4 w-4" />
            <span>Trending Movies</span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/wishlist">
            <Heart className="h-4 w-4" />
            <span>My Wishlist</span>
            {favorites.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold text-white bg-primary rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Movies</h2>
        <MovieGrid 
          movies={trendingMovies} 
          emptyMessage="Loading movies..."
        />
      </div>
    </div>
  );
};

export default Index;
