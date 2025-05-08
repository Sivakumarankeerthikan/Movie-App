
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMovies } from '@/context/MovieContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Clock, Calendar, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getMovieDetails, movieDetail, isLoading, isFavorite, addToFavorites, removeFromFavorites } = useMovies();

  useEffect(() => {
    if (id) {
      getMovieDetails(parseInt(id));
    }
  }, [id, getMovieDetails]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="w-full h-48 md:h-72 bg-muted rounded-lg"></div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="w-full aspect-[2/3] bg-muted rounded-lg"></div>
          </div>
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetail) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  const isFav = isFavorite(movieDetail.id);
  
  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFromFavorites(movieDetail.id);
    } else {
      // Add simplified movie object (not full detail) to favorites
      addToFavorites({
        id: movieDetail.id,
        title: movieDetail.title,
        poster_path: movieDetail.poster_path,
        release_date: movieDetail.release_date,
        vote_average: movieDetail.vote_average,
        overview: movieDetail.overview,
        genre_ids: movieDetail.genres.map(g => g.id),
      });
    }
  };

  // Find trailer if available
  const trailer = movieDetail.videos?.results.find(
    video => video.type === 'Trailer'
  );
  
  return (
    <div className="space-y-6">
      {/* Backdrop Image */}
      {movieDetail.backdrop_path && (
        <div className="relative w-full h-48 md:h-72 overflow-hidden rounded-lg">
          <img
            src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${movieDetail.backdrop_path}`}
            alt={`${movieDetail.title} backdrop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          {movieDetail.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movieDetail.poster_path}`}
              alt={`${movieDetail.title} poster`}
              className="rounded-lg shadow-lg w-full"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center rounded-lg">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{movieDetail.title}</h1>
            {movieDetail.tagline && (
              <p className="text-lg italic text-muted-foreground">{movieDetail.tagline}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {movieDetail.genres.map(genre => (
              <Badge key={genre.id} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{movieDetail.vote_average.toFixed(1)} / 10</span>
            </div>
            {movieDetail.release_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(movieDetail.release_date)}</span>
              </div>
            )}
            {movieDetail.runtime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{movieDetail.runtime} min</span>
              </div>
            )}
          </div>

          <Button 
            onClick={handleFavoriteToggle} 
            variant={isFav ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Heart className={isFav ? "fill-current" : ""} size={16} />
            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>

          <div className="pt-2">
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p className="text-muted-foreground">{movieDetail.overview || 'No overview available.'}</p>
          </div>

          {/* Trailer */}
          {trailer && (
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4">Trailer</h3>
              <div className="relative aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movieDetail.title} trailer`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Cast */}
          {movieDetail.credits?.cast && movieDetail.credits.cast.length > 0 && (
            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-4">Cast</h3>
              <div className="flex overflow-x-auto gap-3 pb-3 -mx-2 px-2 scrollbar-none">
                {movieDetail.credits.cast.slice(0, 10).map(actor => (
                  <div key={actor.id} className="flex-shrink-0 w-24">
                    <div className="w-full aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                      {actor.profile_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}w200${actor.profile_path}`}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium truncate">{actor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
