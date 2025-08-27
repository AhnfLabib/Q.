import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { QuoteCard } from "@/components/QuoteCard";
import { GlassCard } from "@/components/GlassCard";
import { QuoteDialog } from "@/components/QuoteDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import QuoteShareDialog from "@/components/QuoteShareDialog";
import { BookOpen, Users, Heart, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuotes } from "@/hooks/useQuotes";
import { Quote, QuoteFormData } from "@/types/database";
import { triggerNewsletterForUser } from "@/utils/triggerNewsletter";

// Legacy interface for backward compatibility with UI components
interface LegacyQuote {
  id: string;
  text: string;
  author: string;
  book?: string;
  tags: string[];
  favorite: boolean;
}

// Convert database Quote to legacy format for UI components
const convertQuoteToLegacy = (quote: Quote): LegacyQuote => ({
  id: quote.id,
  text: quote.quote_text,
  author: quote.author,
  book: quote.book,
  tags: quote.tags,
  favorite: quote.is_favorite,
});

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { quotes, loading: quotesLoading, addQuote, updateQuote, deleteQuote, toggleFavorite, incrementShareCount } = useQuotes(user?.id);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; quote?: LegacyQuote | null }>({ open: false });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; quote?: LegacyQuote | null }>({ open: false });
  const [shareDialog, setShareDialog] = useState<{ open: boolean; quote?: LegacyQuote | null }>({ open: false });

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Convert quotes to legacy format for UI
  const legacyQuotes = quotes.map(convertQuoteToLegacy);
  const fullName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userName = fullName.split(" ")[0]; // Extract first name only

  const filteredQuotes = legacyQuotes.filter((quote) => {
    if (searchQuery === "favorite:true") {
      return quote.favorite;
    }
    return quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
           quote.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (quote.book?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
           quote.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleAddQuote = () => {
    setQuoteDialog({ open: true, quote: null });
  };

  const handleEditQuote = (quote: LegacyQuote) => {
    setQuoteDialog({ open: true, quote });
  };

  const handleDeleteQuote = (quote: LegacyQuote) => {
    setDeleteDialog({ open: true, quote });
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
    } catch (err) {
      // Error already handled in the hook
    }
  };

  const handleShareQuote = async (quote: LegacyQuote) => {
    // Increment share count
    try {
      await incrementShareCount(quote.id);
    } catch (err) {
      // Continue with sharing even if count increment fails
    }
    
    // Open the visual share dialog
    setShareDialog({ open: true, quote });
  };

  const handleQuoteSubmit = async (data: QuoteFormData) => {
    try {
      if (quoteDialog.quote) {
        // Edit existing quote
        await updateQuote(quoteDialog.quote.id, data);
      } else {
        // Add new quote
        await addQuote(data);
      }
      setQuoteDialog({ open: false, quote: null });
    } catch (err) {
      // Error already handled in the hook
    }
  };

  const confirmDelete = async () => {
    if (deleteDialog.quote) {
      try {
        await deleteQuote(deleteDialog.quote.id);
        setDeleteDialog({ open: false, quote: null });
      } catch (err) {
        // Error already handled in the hook
      }
    }
  };

  const stats = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "Total Quotes",
      value: legacyQuotes.length
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Authors",
      value: new Set(legacyQuotes.map(q => q.author)).size
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Favorites",
      value: legacyQuotes.filter(q => q.favorite).length
    }
  ];

  // Show loading state
  if (authLoading || quotesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        onSearch={setSearchQuery}
        onAddQuote={handleAddQuote}
        onSettings={() => {}}
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

          {/* Add Quote Button */}
          <div className="max-w-md mx-auto space-y-4">
            <GlassCard 
              variant="default" 
              interactive 
              className="p-6 text-center cursor-pointer transition-all duration-200 hover:scale-105 border border-accent/20"
              onClick={handleAddQuote}
            >
              <div className="text-accent text-2xl mb-2">+</div>
              <div className="text-lg font-semibold mb-1">Add New Quote</div>
              <div className="text-sm text-muted-foreground">Share your favorite quotes</div>
            </GlassCard>

            {/* Temporary Newsletter Test Button */}
            <GlassCard 
              variant="subtle" 
              interactive 
              className="p-4 text-center cursor-pointer transition-all duration-200 hover:scale-105 border border-blue-500/20"
              onClick={async () => {
                try {
                  await triggerNewsletterForUser(user?.id);
                  toast({
                    title: "Newsletter triggered!",
                    description: "Check your email for the newsletter."
                  });
                } catch (error) {
                  toast({
                    title: "Failed to trigger newsletter",
                    description: "Please try again.",
                    variant: "destructive"
                  });
                }
              }}
            >
              <div className="text-blue-400 text-lg mb-1">📧</div>
              <div className="text-sm font-semibold mb-1">Test Newsletter</div>
              <div className="text-xs text-muted-foreground">Send newsletter now</div>
            </GlassCard>
          </div>

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

      <QuoteShareDialog
        open={shareDialog.open}
        onOpenChange={(open) => setShareDialog({ open, quote: null })}
        quote={shareDialog.quote}
      />
    </div>
  );
};

export default Dashboard;