import { GlassCard } from "./GlassCard";
import { GlassButton } from "./GlassButton";
import { Search, Plus, LogOut, Grid3X3, List, Settings } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onAddQuote?: () => void;
  onSettings?: () => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export function Header({ 
  onSearch, 
  onAddQuote, 
  onSettings, 
  viewMode = 'grid', 
  onViewModeChange 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
      <GlassCard variant="strong" className="mx-4 mt-4 mb-6 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Q<span className="text-accent text-4xl">.</span>
            </h1>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quotes, authors, books..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-80 pl-10 glass-surface border-glass-border bg-transparent placeholder:text-muted-foreground/60 shadow-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center space-x-1 p-1 glass-surface-subtle rounded-xl">
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

            {/* Add Quote */}
            <GlassButton
              variant="accent"
              onClick={onAddQuote}
              className="font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Quote
            </GlassButton>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Settings */}
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="glass-interactive"
            >
              <Settings className="h-4 w-4" />
            </GlassButton>

            {/* Sign Out */}
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="glass-interactive"
            >
              <LogOut className="h-4 w-4" />
            </GlassButton>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 glass-surface border-glass-border bg-transparent placeholder:text-muted-foreground/60 shadow-none"
            />
          </div>
        </div>
      </GlassCard>
    </header>
  );
}