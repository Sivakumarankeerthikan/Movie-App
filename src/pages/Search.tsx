
import React, { useEffect, useState } from 'react';
import { useMovies } from '@/context/MovieContext';
import MovieGrid from '@/components/MovieGrid';
import FilterBar from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Search = () => {
  const { searchResults, searchQuery, isLoading, searchMovies } = useMovies();
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    // If we have a search query in context but no results, re-run the search
    if (searchQuery && (searchResults.length === 0 && !isLoading)) {
      searchMovies(searchQuery);
    }
    
    // Reset filtered results when search results change
    setFilteredResults([]);
    setIsFiltered(false);
  }, [searchQuery, searchResults.length, isLoading, searchMovies]);

  const handleApplyFilters = (results: any[]) => {
    setFilteredResults(results);
    setIsFiltered(true);
  };

  const resetFilters = () => {
    setFilteredResults([]);
    setIsFiltered(false);
  };

  const displayMovies = isFiltered ? filteredResults : searchResults;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">
          {searchQuery ? (
            <>Search Results for "{searchQuery}"</>
          ) : (
            <>Search Movies</>
          )}
        </h1>
        
        <div className="flex items-center gap-2">
          {isFiltered && (
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> 
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Movies</SheetTitle>
                <SheetDescription>
                  Apply filters to narrow down your search results.
                </SheetDescription>
              </SheetHeader>
              <FilterBar onApplyFilters={handleApplyFilters} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-md bg-muted h-64"></div>
          ))}
        </div>
      ) : (
        <MovieGrid 
          movies={displayMovies} 
          emptyMessage={
            searchQuery 
              ? `No results found for "${searchQuery}". Try a different search term.` 
              : "Type in the search bar to find movies."
          }
        />
      )}
    </div>
  );
};

export default Search;
