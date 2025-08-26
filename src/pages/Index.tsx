import React, { useState, useEffect } from "react";
import { Movie, getTrendingMovies, searchMovies, getPopularMovies } from "@/lib/tmdb";
import { MovieCard } from "@/components/MovieCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Film, TrendingUp, Star } from "lucide-react";

const Index = () => {
  console.log("Index component rendering...");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState<"trending" | "popular">("trending");
  const { toast } = useToast();

  // Load movies on component mount
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const data = currentCategory === "trending" 
        ? await getTrendingMovies()
        : await getPopularMovies();
      setMovies(data.results);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load movies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      loadMovies();
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchMovies(query);
      setMovies(data.results);
    } catch (error) {
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "Failed to search movies",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: "trending" | "popular") => {
    setCurrentCategory(category);
    setSearchQuery("");
  };

  // Reload movies when category changes
  useEffect(() => {
    if (!searchQuery) {
      loadMovies();
    }
  }, [currentCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero border-b border-cinema-surface/20">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Film className="w-12 h-12 text-cinema-gold" />
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-cinema-primary to-cinema-gold bg-clip-text text-transparent">
                FlickFind
              </h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Discover the world of cinema with real-time movie data, ratings, and detailed information
            </p>
            
            <div className="pt-8">
              <SearchBar 
                onSearch={handleSearch}
                isLoading={isLoading}
                placeholder="Search for movies, actors, directors..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Button
              variant={currentCategory === "trending" ? "default" : "outline"}
              onClick={() => handleCategoryChange("trending")}
              className={currentCategory === "trending" 
                ? "bg-cinema-primary hover:bg-cinema-primary/80 text-cinema-dark" 
                : "border-cinema-surface hover:bg-cinema-surface"
              }
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button
              variant={currentCategory === "popular" ? "default" : "outline"}
              onClick={() => handleCategoryChange("popular")}
              className={currentCategory === "popular" 
                ? "bg-cinema-primary hover:bg-cinema-primary/80 text-cinema-dark" 
                : "border-cinema-surface hover:bg-cinema-surface"
              }
            >
              <Star className="w-4 h-4 mr-2" />
              Popular
            </Button>
          </div>
        )}

        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <Badge variant="secondary" className="bg-cinema-surface text-foreground">
              {movies.length} movies found
            </Badge>
          </div>
        )}

        {/* Section Title */}
        {!searchQuery && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {currentCategory === "trending" ? "Trending Movies" : "Popular Movies"}
            </h2>
            <p className="text-muted-foreground">
              {currentCategory === "trending" 
                ? "What's hot right now in cinema" 
                : "The most popular movies of all time"
              }
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && movies.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && movies.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No movies found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords or browse our trending movies
            </p>
            <Button 
              onClick={() => handleSearch("")}
              variant="outline"
              className="border-cinema-surface hover:bg-cinema-surface"
            >
              Clear Search
            </Button>
          </div>
        )}

      </main>
    </div>
  );
};

export default Index;