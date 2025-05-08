
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useMovies } from '@/context/MovieContext';
import { tmdbAPI } from '@/lib/api';

type FilterProps = {
  onApplyFilters: (movies: any[]) => void;
};

const FilterBar: React.FC<FilterProps> = ({ onApplyFilters }) => {
  const { genres } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [ratingRange, setRatingRange] = useState<number[]>([0, 10]);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyFilters = async () => {
    setIsLoading(true);
    try {
      // Prepare filter parameters
      const params: any = {
        with_genres: selectedGenre || undefined,
        'vote_average.gte': ratingRange[0],
        'vote_average.lte': ratingRange[1],
      };

      if (releaseYear) {
        params.primary_release_year = releaseYear;
      }

      const data = await tmdbAPI.discoverMovies(params);
      onApplyFilters(data.results || []);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-card border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Filter Movies</h3>
      <div className="space-y-4">
        <div>
          <Label>Genre</Label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              {genres.map(genre => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Release Year: {releaseYear}</Label>
          <Select 
            value={releaseYear.toString()} 
            onValueChange={value => setReleaseYear(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>
            Rating: {ratingRange[0].toFixed(1)} - {ratingRange[1].toFixed(1)}
          </Label>
          <Slider
            defaultValue={[0, 10]}
            max={10}
            step={0.5}
            value={ratingRange}
            onValueChange={setRatingRange}
            className="py-4"
          />
        </div>

        <Button 
          onClick={handleApplyFilters} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Applying...' : 'Apply Filters'}
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
