// TMDB API integration utilities

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: { id: number; name: string; logo_path: string; origin_country: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface Credits {
  cast: Cast[];
  crew: { id: number; name: string; job: string; profile_path: string }[];
}

export interface SearchResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  results: Video[];
}

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// TMDB API key configuration
const API_KEY = 'YOUR_TMDB_API_KEY_HERE'; // Replace with your actual TMDB API key

// Get API key - uses configured key as fallback
const getApiKey = (): string => {
  // Try localStorage first, then fall back to configured key
  const storedKey = localStorage.getItem('tmdb_api_key');
  if (storedKey) return storedKey;
  
  if (!API_KEY || API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
    throw new Error('TMDB API key not found. Please add your API key in the settings.');
  }
  return API_KEY;
};

// Helper function to make API requests
const apiRequest = async <T>(endpoint: string): Promise<T> => {
  const apiKey = getApiKey();
  const separator = endpoint.includes('?') ? '&' : '?';
  const response = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${apiKey}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Get popular movies
export const getPopularMovies = async (page = 1): Promise<SearchResults> => {
  return apiRequest<SearchResults>(`/movie/popular?page=${page}`);
};

// Get trending movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<SearchResults> => {
  return apiRequest<SearchResults>(`/trending/movie/${timeWindow}`);
};

// Search movies
export const searchMovies = async (query: string, page = 1): Promise<SearchResults> => {
  const encodedQuery = encodeURIComponent(query);
  return apiRequest<SearchResults>(`/search/movie?query=${encodedQuery}&page=${page}`);
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  return apiRequest<MovieDetails>(`/movie/${movieId}`);
};

// Get movie credits
export const getMovieCredits = async (movieId: number): Promise<Credits> => {
  return apiRequest<Credits>(`/movie/${movieId}/credits`);
};

// Get movie videos/trailers
export const getMovieVideos = async (movieId: number): Promise<VideosResponse> => {
  return apiRequest<VideosResponse>(`/movie/${movieId}/videos`);
};

// Get now playing movies
export const getNowPlayingMovies = async (page = 1): Promise<SearchResults> => {
  return apiRequest<SearchResults>(`/movie/now_playing?page=${page}`);
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1): Promise<SearchResults> => {
  return apiRequest<SearchResults>(`/movie/upcoming?page=${page}`);
};

// Image URL helpers
export const getImageUrl = (path: string, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string): string => getImageUrl(path, 'w500');
export const getBackdropUrl = (path: string): string => getImageUrl(path, 'w780');

// Format rating
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Format runtime
export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Check if API key is set
export const isApiKeySet = (): boolean => {
  return !!localStorage.getItem('tmdb_api_key') || (API_KEY && API_KEY !== 'YOUR_TMDB_API_KEY_HERE');
};

// Set API key
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('tmdb_api_key', apiKey);
};