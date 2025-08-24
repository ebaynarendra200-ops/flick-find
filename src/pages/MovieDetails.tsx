import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MovieDetails as MovieDetailsType, Credits, getMovieDetails, getMovieCredits, getBackdropUrl, getPosterUrl, formatRating, formatRuntime } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Calendar, Clock, DollarSign } from "lucide-react";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(parseInt(id)),
          getMovieCredits(parseInt(id))
        ]);
        
        setMovie(movieData);
        setCredits(creditsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative h-96">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const mainCast = credits?.cast.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-96 lg:h-[500px] bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button
            onClick={() => navigate("/")}
            variant="secondary"
            size="sm"
            className="bg-cinema-dark/80 hover:bg-cinema-dark border-cinema-surface backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="flex justify-center lg:justify-start">
            <Card className="overflow-hidden bg-gradient-card border-cinema-surface/20 shadow-movie-card">
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="w-80 h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Card>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg text-cinema-gold italic mb-4">
                  "{movie.tagline}"
                </p>
              )}
              
              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <Badge variant="secondary" className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold/30">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  {formatRating(movie.vote_average)} ({movie.vote_count.toLocaleString()} votes)
                </Badge>
                <Badge variant="outline" className="border-cinema-surface">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(movie.release_date).getFullYear()}
                </Badge>
                {movie.runtime > 0 && (
                  <Badge variant="outline" className="border-cinema-surface">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatRuntime(movie.runtime)}
                  </Badge>
                )}
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <Badge 
                    key={genre.id} 
                    variant="secondary"
                    className="bg-cinema-surface text-foreground"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>

            {/* Additional Info */}
            {(movie.budget > 0 || movie.revenue > 0) && (
              <div className="grid md:grid-cols-2 gap-4">
                {movie.budget > 0 && (
                  <Card className="p-4 bg-cinema-card border-cinema-surface/20">
                    <div className="flex items-center gap-2 text-cinema-gold mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Budget</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      ${movie.budget.toLocaleString()}
                    </p>
                  </Card>
                )}
                {movie.revenue > 0 && (
                  <Card className="p-4 bg-cinema-card border-cinema-surface/20">
                    <div className="flex items-center gap-2 text-cinema-gold mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Revenue</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">
                      ${movie.revenue.toLocaleString()}
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {mainCast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-semibold text-foreground mb-6">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mainCast.map((actor) => (
                <Card key={actor.id} className="bg-cinema-card border-cinema-surface/20 overflow-hidden">
                  <div className="aspect-[2/3] overflow-hidden">
                    <img
                      src={actor.profile_path ? getPosterUrl(actor.profile_path) : '/placeholder.svg'}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {actor.character}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};