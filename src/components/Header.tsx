import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { Search, Plus, LogOut, Grid3X3, List, Settings, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onAddQuote?: () => void;
  onSettings?: () => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  stats?: {
    totalQuotes: number;
    authors: number;
    favorites: number;
  };
}

export function Header({ 
  onSearch, 
  onAddQuote, 
  onSettings, 
  viewMode = 'grid', 
  onViewModeChange,
  stats 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input when search expands
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchExpanded && searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchExpanded]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      navigate("/");
    } else {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <GlassCard variant="strong" className="mx-4 mt-4 mb-6 px-4 md:px-6 py-3 md:py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Search Icon */}
          <div className="flex items-center space-x-3 md:space-x-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Q<span className="text-accent text-3xl md:text-4xl">.</span>
            </h1>
            
            {/* Mobile Search Icon */}
            {isMobile && !searchExpanded && (
              <GlassButton
                variant="ghost"
                size="icon"
                onClick={() => setSearchExpanded(true)}
                className="h-8 w-8"
              >
                <Search className="h-4 w-4" />
              </GlassButton>
            )}
            
            {/* Desktop Search */}
            {!isMobile && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quotes, authors, books..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-80 pl-10 glass-surface border-glass-border bg-transparent placeholder:text-muted-foreground/60 shadow-none"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* View Toggle - Desktop Only */}
            {!isMobile && (
              <div className="hidden sm:flex items-center space-x-1 p-1 bg-muted/20 border border-border/50 rounded-xl">
                <GlassButton
                  variant={viewMode === 'grid' ? 'accent' : 'ghost'}
                  size="icon"
                  onClick={() => onViewModeChange?.('grid')}
                  className="h-8 w-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </GlassButton>
                <GlassButton
                  variant={viewMode === 'list' ? 'accent' : 'ghost'}
                  size="icon"
                  onClick={() => onViewModeChange?.('list')}
                  className="h-8 w-8"
                >
                  <List className="h-4 w-4" />
                </GlassButton>
              </div>
            )}

            {/* Add Quote - Desktop */}
            {!isMobile && (
              <GlassButton
                variant="accent"
                onClick={onAddQuote}
                className="font-semibold"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Quote
              </GlassButton>
            )}

            {/* Add Quote - Mobile Icon */}
            {isMobile && (
              <GlassButton
                variant="ghost"
                size="icon"
                onClick={onAddQuote}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </GlassButton>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu */}
            {isMobile ? (
              <MobileDrawer stats={stats} />
            ) : (
              <>
                {/* Settings - Desktop */}
                <GlassButton
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/settings")}
                  className="glass-interactive"
                >
                  <Settings className="h-4 w-4" />
                </GlassButton>

                {/* Sign Out - Desktop */}
                <GlassButton
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="glass-interactive"
                >
                  <LogOut className="h-4 w-4" />
                </GlassButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile Expandable Search */}
        {isMobile && searchExpanded && (
          <div className="mt-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchExpanded(false);
                    setSearchQuery('');
                  }
                }}
                className="w-full pl-10 pr-10 glass-surface border-glass-border bg-transparent placeholder:text-muted-foreground/60 shadow-none"
              />
              <button
                onClick={() => {
                  setSearchExpanded(false);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </header>
  );
}