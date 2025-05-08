
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useMovies } from '@/context/MovieContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const SearchBar: React.FC = () => {
  const { searchQuery, searchMovies } = useMovies();
  const [query, setQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        await searchMovies(query);
        navigate('/search');
      } catch (error) {
        toast({
          title: "Search Error",
          description: "Failed to search movies. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Empty Search",
        description: "Please enter a movie title to search",
        variant: "destructive",
      });
    }
  };

  // Reset the local query state when searchQuery in context changes
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
      <Input
        type="text"
        placeholder="Search for movies..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="flex gap-2 items-center">
        <Search className="h-4 w-4" /> 
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};

export default SearchBar;
