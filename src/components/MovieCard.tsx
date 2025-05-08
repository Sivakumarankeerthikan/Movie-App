
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMAGE_BASE_URL, POSTER_SIZE } from '@/lib/api';
import { Movie } from '@/context/MovieContext';
import { Link } from 'react-router-dom';
import { useMovies } from '@/context/MovieContext';
import { useToast } from '@/components/ui/use-toast';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  const { toast } = useToast();
  const isFav = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFav) {
      removeFromFavorites(movie.id);
      toast({
        description: `Removed "${movie.title}" from your wishlist`,
      });
    } else {
      addToFavorites(movie);
      toast({
        description: `Added "${movie.title}" to your wishlist`,
      });
    }
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <Card className={cn('movie-card overflow-hidden h-full transition-all duration-300 hover:shadow-lg', 
        isFav ? 'ring-2 ring-primary ring-offset-2' : '', 
        className)}>
        <div className="relative">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
              alt={`${movie.title} poster`}
              className="w-full h-auto poster-image"
            />
          ) : (
            <div className="w-full h-0 pb-[150%] bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <Button 
            variant={isFav ? "default" : "ghost"} 
            size="icon" 
            className={cn(
              "absolute top-2 right-2 rounded-full transition-all duration-300",
              isFav ? "bg-primary hover:bg-primary/90" : "bg-black/40 hover:bg-black/60"
            )}
            onClick={handleFavoriteClick}
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={cn(
                "h-5 w-5", 
                isFav ? "fill-white text-white" : "text-white"
              )} 
            />
          </Button>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1">{movie.title}</h3>
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs text-muted-foreground">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
