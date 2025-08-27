import { useState } from "react";
import { Header } from "@/components/Header";
import { QuoteCard } from "@/components/QuoteCard";
import { GlassCard } from "@/components/GlassCard";
import { QuoteDialog } from "@/components/QuoteDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { BookOpen, Users, Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Sample data - will be replaced with Supabase data
const sampleQuotes = [
  {
    id: "1",
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    book: "Stanford Commencement Address",
    tags: ["motivation", "work", "passion"],
    favorite: true
  },
  {
    id: "2", 
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    book: "Attributed",
    tags: ["opportunity", "challenge", "wisdom"],
    favorite: false
  },
  {
    id: "3",
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    book: "Attributed",
    tags: ["dreams", "future", "belief"],
    favorite: true
  },
  {
    id: "4",
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    book: "Attributed", 
    tags: ["hope", "perseverance", "wisdom"],
    favorite: false
  },
  {
    id: "5",
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    book: "Attributed",
    tags: ["success", "failure", "courage"],
    favorite: true
  }
];

interface Quote {
  id: string;
  text: string;
  author: string;
  book?: string;
  tags: string[];
  favorite: boolean;
}

const Dashboard = () => {
  const [quotes, setQuotes] = useState<Quote[]>(sampleQuotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAuthRequired, setShowAuthRequired] = useState(false);
  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; quote?: Quote | null }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; quote?: Quote | null }>({ open: false });

  // Placeholder username - will be replaced with actual user data
  const userName = "Alex";

  const filteredQuotes = quotes.filter((quote) => {
    if (searchQuery === "favorite:true") {
      return quote.favorite;
    }
    return quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quote.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quote.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleAddQuote = () => {
    setQuoteDialog({ open: true, quote: null });
  };

  const handleEditQuote = (quote: Quote) => {
    setQuoteDialog({ open: true, quote });
  };

  const handleDeleteQuote = (quote: Quote) => {
    setDeleteDialog({ open: true, quote });
  };

  const handleToggleFavorite = (id: string) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === id ? { ...quote, favorite: !quote.favorite } : quote
    ));
    
    const quote = quotes.find(q => q.id === id);
    if (quote) {
      toast({
        description: quote.favorite 
          ? "Quote removed from favorites" 
          : "Quote added to favorites",
      });
    }
  };

  const handleShareQuote = (quote: Quote) => {
    const shareText = `"${quote.text}" — ${quote.author}${quote.book ? ` (${quote.book})` : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Quote',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        description: "Quote copied to clipboard!",
      });
    }
  };

  const handleQuoteSubmit = (data: Omit<Quote, "id" | "favorite">) => {
    if (quoteDialog.quote) {
      // Edit existing quote
      setQuotes(prev => prev.map(quote => 
        quote.id === quoteDialog.quote!.id 
          ? { ...quote, ...data }
          : quote
      ));
      toast({
        description: "Quote updated successfully!",
      });
    } else {
      // Add new quote
      const newQuote: Quote = {
        id: Date.now().toString(),
        ...data,
        favorite: false,
      };
      setQuotes(prev => [newQuote, ...prev]);
      toast({
        description: "Quote added successfully!",
      });
    }
  };

  const confirmDelete = () => {
    if (deleteDialog.quote) {
      setQuotes(prev => prev.filter(quote => quote.id !== deleteDialog.quote!.id));
      toast({
        description: "Quote deleted successfully!",
      });
      setDeleteDialog({ open: false });
    }
  };

  const handleAuthAction = () => {
    setShowAuthRequired(true);
  };

  const stats = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Total Quotes",
      value: quotes.length
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Authors",
      value: new Set(quotes.map(q => q.author)).size
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Favorites",
      value: quotes.filter(q => q.favorite).length
    }
  ];

  return (
    <div className="min-h-screen">
      <Header 
        onSearch={setSearchQuery}
        onAddQuote={handleAddQuote}
        onSettings={handleAuthAction}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <main className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-glass bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
            Welcome back, {userName}
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto mb-8">
            {stats.map((stat, index) => (
              <GlassCard 
                key={index} 
                variant="subtle" 
                interactive 
                className="p-4 md:p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => {
                  if (stat.label === "Favorites") {
                    setSearchQuery("favorite:true");
                  } else if (stat.label === "Authors") {
                    // Could open authors modal or filter
                    console.log("Show authors");
                  } else {
                    // Show all quotes
                    setSearchQuery("");
                  }
                }}
              >
                <div className="flex items-center justify-center mb-2 text-accent">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          {showAuthRequired && (
            <GlassCard variant="accent" className="p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-sm">
                🔒 Connect to Supabase to save quotes and enable full functionality
              </p>
            </GlassCard>
          )}
        </div>

        {/* Quotes Section */}
        <div className="pb-12">
          {searchQuery && (
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredQuotes.length} result{filteredQuotes.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
            </div>
          )}

          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No quotes found matching your search." : "No quotes in your library yet."}
              </p>
              {!searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Add your first quote to get started!
                </p>
              )}
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
                : "space-y-4"
            }>
              {filteredQuotes.map((quote) => (
                <QuoteCard 
                  key={quote.id} 
                  quote={quote} 
                  viewMode={viewMode}
                  onFavorite={handleToggleFavorite}
                  onShare={handleShareQuote}
                  onEdit={handleEditQuote}
                  onDelete={handleDeleteQuote}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
      <QuoteDialog
        open={quoteDialog.open}
        onOpenChange={(open) => setQuoteDialog({ open, quote: null })}
        quote={quoteDialog.quote}
        onSubmit={handleQuoteSubmit}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
        onConfirm={confirmDelete}
        quoteText={deleteDialog.quote?.text || ""}
      />
    </div>
  );
};

export default Dashboard;