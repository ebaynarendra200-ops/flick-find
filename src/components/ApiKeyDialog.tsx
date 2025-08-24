import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExternalLink, Key } from "lucide-react";
import { setApiKey } from "@/lib/tmdb";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySet: () => void;
}

export const ApiKeyDialog = ({ open, onOpenChange, onApiKeySet }: ApiKeyDialogProps) => {
  const [apiKey, setApiKeyState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsLoading(true);
    try {
      // Test the API key by making a request
      const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
      
      if (response.ok) {
        setApiKey(apiKey);
        onApiKeySet();
        onOpenChange(false);
        setApiKeyState("");
      } else {
        throw new Error("Invalid API key");
      }
    } catch (error) {
      alert("Invalid API key. Please check your key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-cinema-surface">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Key className="w-5 h-5 text-cinema-gold" />
            TMDB API Key Required
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            To access movie data, you need a free TMDB API key. This key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm font-medium text-foreground">
              API Key
            </Label>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your TMDB API key"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="bg-cinema-surface border-cinema-surface text-foreground"
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!apiKey.trim() || isLoading}
                  className="flex-1 bg-cinema-primary hover:bg-cinema-primary/80 text-cinema-dark"
                >
                  {isLoading ? "Validating..." : "Save API Key"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open("https://www.themoviedb.org/settings/api", "_blank")}
                  className="border-cinema-surface hover:bg-cinema-surface"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Don't have an API key?</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Create a free account at themoviedb.org</li>
              <li>Go to Settings {'>'} API</li>
              <li>Create a new API key</li>
              <li>Copy and paste it above</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};