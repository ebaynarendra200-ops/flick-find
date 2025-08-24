import { Movie, getPosterUrl, formatRating } from "@/lib/tmdb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-movie-card bg-gradient-card border-cinema-surface/20 animate-fade-in"
      onClick={handleClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-cinema-dark/80 text-cinema-gold border-cinema-gold/30 backdrop-blur-sm"
        >
          <Star className="w-3 h-3 mr-1 fill-current" />
          {formatRating(movie.vote_average)}
        </Badge>
        
        {/* Hover Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-3">
              {movie.overview}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(movie.release_date).getFullYear()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Title (always visible) */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-cinema-gold transition-colors">
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(movie.release_date).getFullYear()}
        </p>
      </div>
    </Card>
  );
};