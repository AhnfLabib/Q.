import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { Heart, Share2, Edit, Trash2, BookOpen } from "lucide-react";
import { Badge } from "./ui/badge";

interface Quote {
  id: string;
  text: string;
  author: string;
  book?: string;
  tags: string[];
  favorite: boolean;
}

interface QuoteCardProps {
  quote: Quote;
  onFavorite?: (id: string) => void;
  onShare?: (quote: Quote) => void;
  onEdit?: (quote: Quote) => void;
  onDelete?: (quote: Quote) => void;
  viewMode?: 'grid' | 'list';
}

export function QuoteCard({ 
  quote, 
  onFavorite, 
  onShare, 
  onEdit, 
  onDelete, 
  viewMode = 'grid' 
}: QuoteCardProps) {
  const isGridView = viewMode === 'grid';

  return (
    <GlassCard 
      variant={quote.favorite ? "accent" : "default"}
      interactive
      refraction
      className={`group p-6 h-full ${isGridView ? 'min-h-[280px]' : 'min-h-[200px]'} flex flex-col`}
    >
      {/* Quote Text */}
      <div className="flex-1 mb-4">
        <blockquote className={`text-foreground leading-relaxed ${isGridView ? 'text-lg' : 'text-base'} font-medium`}>
          "{quote.text}"
        </blockquote>
      </div>

      {/* Attribution */}
      <div className="mb-4 space-y-1">
        <div className="flex items-center justify-between">
          <cite className="text-muted-foreground font-medium not-italic">
            — {quote.author}
          </cite>
        {quote.favorite && (
            <Heart className="h-4 w-4 text-accent-red fill-current" />
          )}
        </div>
        
        {quote.book && (
          <div className="flex items-center text-sm text-muted-foreground/70">
            <BookOpen className="h-3 w-3 mr-1" />
            {quote.book}
          </div>
        )}
      </div>

      {/* Tags */}
      {quote.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {quote.tags.slice(0, isGridView ? 3 : 5).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs glass-surface-subtle border-glass-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {quote.tags.length > (isGridView ? 3 : 5) && (
            <Badge 
              variant="secondary" 
              className="text-xs glass-surface-subtle border-glass-border text-muted-foreground"
            >
              +{quote.tags.length - (isGridView ? 3 : 5)}
            </Badge>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex items-center space-x-1">
          <GlassButton
            variant="ghost"
            size="icon"
            onClick={() => onFavorite?.(quote.id)}
            className="h-8 w-8"
          >
            <Heart className={`h-4 w-4 ${quote.favorite ? 'text-accent-red fill-current' : ''}`} />
          </GlassButton>
          
          <GlassButton
            variant="ghost"
            size="icon"
            onClick={() => onShare?.(quote)}
            className="h-8 w-8"
          >
            <Share2 className="h-4 w-4" />
          </GlassButton>
        </div>

        <div className="flex items-center space-x-1">
          <GlassButton
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(quote)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </GlassButton>
          
          <GlassButton
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(quote)}
            className="h-8 w-8 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  );
}