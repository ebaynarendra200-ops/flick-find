import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SearchBar = ({ 
  onSearch, 
  isLoading = false, 
  placeholder = "Search movies..." 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-20 h-12 bg-cinema-surface/50 border-cinema-surface backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:ring-cinema-primary focus:border-cinema-primary transition-all"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-cinema-surface"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isLoading || !query.trim()}
            className="h-8 bg-cinema-primary hover:bg-cinema-primary/80 text-cinema-dark"
          >
            {isLoading ? "..." : "Search"}
          </Button>
        </div>
      </div>
    </form>
  );
};