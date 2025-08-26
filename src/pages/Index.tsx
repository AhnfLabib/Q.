import { useState } from "react";
import { Header } from "@/components/Header";
import { QuoteCard } from "@/components/QuoteCard";
import { GlassCard } from "@/components/GlassCard";
import { GlassButton } from "@/components/GlassButton";
import { BookOpen, Heart, Tag, Database, LogIn } from "lucide-react";

// Sample data - will be replaced with Supabase data
const sampleQuotes = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    book: "Stanford Commencement Speech",
    tags: ["motivation", "work", "passion"],
    isFavorite: true
  },
  {
    id: "2", 
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    book: "Apple Inc.",
    tags: ["innovation", "leadership"],
    isFavorite: false
  },
  {
    id: "3",
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    book: "New York Times Interview",
    tags: ["design", "philosophy", "functionality"],
    isFavorite: false
  }
];

const Index = () => {
  const [quotes] = useState(sampleQuotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  // Filter quotes based on search
  const filteredQuotes = quotes.filter(quote =>
    quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.book?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddQuote = () => {
    setShowAuthRequired(true);
  };

  const handleAuthAction = () => {
    setShowAuthRequired(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header 
        onSearch={setSearchQuery}
        onAddQuote={handleAddQuote}
        onSettings={handleAuthAction}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="mb-12">
          <GlassCard variant="strong" className="p-8 md:p-12">
            {/* Content */}
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
                Welcome to Q<span className="text-accent text-6xl md:text-8xl">.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium">
                Your personal library of meaningful quotes, beautifully organized and always accessible
              </p>
              
              {showAuthRequired ? (
                <GlassCard variant="accent" className="p-6 mb-12 max-w-md mx-auto">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Database className="h-6 w-6 text-accent-red" />
                    <h3 className="text-lg font-semibold text-foreground">Backend Required</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">
                    To save quotes, manage your library, and access newsletter features, connect to Supabase using our native integration.
                  </p>
                  <GlassButton variant="solid" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Connect Supabase
                  </GlassButton>
                </GlassCard>
              ) : null}
            </div>
          </GlassCard>

          {/* Stats Section - Clean Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
            <GlassCard variant="default" className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-accent-red/10">
                  <BookOpen className="h-8 w-8 text-accent-red" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">{quotes.length}</div>
              <div className="text-muted-foreground font-medium">Total Quotes</div>
            </GlassCard>
            
            <GlassCard variant="default" className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-accent-red/10">
                  <Tag className="h-8 w-8 text-accent-red" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">{new Set(quotes.map(q => q.author)).size}</div>
              <div className="text-muted-foreground font-medium">Authors</div>
            </GlassCard>
            
            <GlassCard variant="default" className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-2xl bg-accent-red/10">
                  <Heart className="h-8 w-8 text-accent-red" />
                </div>
              </div>
              <div className="text-4xl font-bold text-foreground mb-2">{quotes.filter(q => q.isFavorite).length}</div>
              <div className="text-muted-foreground font-medium">Favorites</div>
            </GlassCard>
          </div>
        </section>

        {/* Quotes Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {searchQuery ? `Search Results (${filteredQuotes.length})` : 'Your Quotes'}
            </h2>
          </div>

          {filteredQuotes.length === 0 ? (
            <GlassCard variant="subtle" className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery ? 'No quotes found' : 'No quotes yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start building your personal quote library'
                }
              </p>
              {!searchQuery && (
                <GlassButton variant="accent" onClick={handleAddQuote}>
                  Add Your First Quote
                </GlassButton>
              )}
            </GlassCard>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  viewMode={viewMode}
                  onFavorite={() => console.log('Favorite:', quote.id)}
                  onShare={() => console.log('Share:', quote)}
                  onEdit={() => handleAuthAction()}
                  onDelete={() => handleAuthAction()}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;