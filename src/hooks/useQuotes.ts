import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote, QuoteFormData } from "@/types/database";
import { toast } from "@/hooks/use-toast";

export const useQuotes = (userId?: string) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setQuotes(data || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching quotes:", err);
      setError(err.message);
      toast({
        title: "Error loading quotes",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async (quoteData: QuoteFormData) => {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      const { data, error } = await supabase
        .from("quotes")
        .insert([
          {
            ...quoteData,
            user_id: userId,
            is_favorite: false,
            is_public: false,
            view_count: 0,
            share_count: 0,
            difficulty_level: quoteData.difficulty_level || 1,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setQuotes(prev => [data, ...prev]);
      toast({
        title: "Quote added",
        description: "Your quote has been saved successfully.",
      });

      return data;
    } catch (err: any) {
      console.error("Error adding quote:", err);
      toast({
        title: "Error adding quote",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateQuote = async (id: string, updates: Partial<QuoteFormData>) => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, ...data } : quote
      ));

      toast({
        title: "Quote updated",
        description: "Your quote has been updated successfully.",
      });

      return data;
    } catch (err: any) {
      console.error("Error updating quote:", err);
      toast({
        title: "Error updating quote",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) throw error;

      setQuotes(prev => prev.filter(quote => quote.id !== id));
      toast({
        title: "Quote deleted",
        description: "Your quote has been deleted successfully.",
      });
    } catch (err: any) {
      console.error("Error deleting quote:", err);
      toast({
        title: "Error deleting quote",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const quote = quotes.find(q => q.id === id);
      if (!quote) throw new Error("Quote not found");

      const { data, error } = await supabase
        .from("quotes")
        .update({ is_favorite: !quote.is_favorite })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      setQuotes(prev => prev.map(q => 
        q.id === id ? { ...q, is_favorite: data.is_favorite } : q
      ));

      toast({
        description: data.is_favorite 
          ? "Quote added to favorites" 
          : "Quote removed from favorites",
      });

      return data;
    } catch (err: any) {
      console.error("Error toggling favorite:", err);
      toast({
        title: "Error updating favorite",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const incrementShareCount = async (id: string) => {
    try {
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;

      const { error } = await supabase
        .from("quotes")
        .update({ share_count: quote.share_count + 1 })
        .eq("id", id);

      if (error) throw error;

      setQuotes(prev => prev.map(q => 
        q.id === id ? { ...q, share_count: q.share_count + 1 } : q
      ));
    } catch (err: any) {
      console.error("Error incrementing share count:", err);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [userId]);

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    addQuote,
    updateQuote,
    deleteQuote,
    toggleFavorite,
    incrementShareCount,
  };
};