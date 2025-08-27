-- Phase 1: Enhanced Database Structure - Core Tables and Relationships

-- Create authors table with rich metadata
CREATE TABLE public.authors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    bio TEXT,
    birth_year INTEGER,
    death_year INTEGER,
    nationality TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create categories table for high-level organization
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table with popularity tracking
CREATE TABLE public.tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#8b5cf6',
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_tags junction table for many-to-many relationships
CREATE TABLE public.quote_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_id UUID NOT NULL,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(quote_id, tag_id)
);

-- Add new columns to quotes table
ALTER TABLE public.quotes 
ADD COLUMN author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN word_count INTEGER,
ADD COLUMN reading_time_seconds INTEGER,
ADD COLUMN source_url TEXT,
ADD COLUMN page_number INTEGER,
ADD COLUMN chapter TEXT,
ADD COLUMN mood TEXT CHECK (mood IN ('inspirational', 'reflective', 'motivational', 'philosophical', 'humorous', 'melancholic')),
ADD COLUMN difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5) DEFAULT 1,
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN view_count INTEGER DEFAULT 0,
ADD COLUMN share_count INTEGER DEFAULT 0;

-- Enable Row Level Security on new tables
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authors table
CREATE POLICY "Everyone can view authors" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create authors" ON public.authors FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update authors they created" ON public.authors FOR UPDATE USING (auth.uid() = created_by OR created_by IS NULL);

-- RLS Policies for categories table (admin-manageable, everyone can view)
CREATE POLICY "Everyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update categories" ON public.categories FOR UPDATE TO authenticated USING (true);

-- RLS Policies for tags table
CREATE POLICY "Everyone can view tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update tags they created" ON public.tags FOR UPDATE USING (auth.uid() = created_by OR created_by IS NULL);

-- RLS Policies for quote_tags table
CREATE POLICY "Users can view quote_tags for their quotes" ON public.quote_tags FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_tags.quote_id AND quotes.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_tags.quote_id AND quotes.is_public = true)
);
CREATE POLICY "Users can manage quote_tags for their quotes" ON public.quote_tags FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_tags.quote_id AND quotes.user_id = auth.uid())
);
CREATE POLICY "Users can delete quote_tags for their quotes" ON public.quote_tags FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_tags.quote_id AND quotes.user_id = auth.uid())
);

-- Add foreign key constraint for quote_tags.quote_id (after RLS policies)
ALTER TABLE public.quote_tags ADD CONSTRAINT fk_quote_tags_quote_id FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_authors_name ON public.authors(name);
CREATE INDEX idx_categories_name ON public.categories(name);
CREATE INDEX idx_tags_name ON public.tags(name);
CREATE INDEX idx_tags_usage_count ON public.tags(usage_count DESC);
CREATE INDEX idx_quote_tags_quote_id ON public.quote_tags(quote_id);
CREATE INDEX idx_quote_tags_tag_id ON public.quote_tags(tag_id);
CREATE INDEX idx_quotes_author_id ON public.quotes(author_id);
CREATE INDEX idx_quotes_category_id ON public.quotes(category_id);
CREATE INDEX idx_quotes_mood ON public.quotes(mood);
CREATE INDEX idx_quotes_is_public ON public.quotes(is_public);
CREATE INDEX idx_quotes_view_count ON public.quotes(view_count DESC);

-- Add triggers for updated_at columns
CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON public.authors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON public.tags
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.categories (name, description, color, icon) VALUES
('Philosophy', 'Deep thoughts about life, existence, and meaning', '#8b5cf6', 'brain'),
('Literature', 'Quotes from novels, poetry, and literary works', '#06b6d4', 'book-open'),
('Motivation', 'Inspiring quotes to drive action and success', '#f59e0b', 'zap'),
('Life Wisdom', 'Practical advice and life lessons', '#10b981', 'lightbulb'),
('Love & Relationships', 'Quotes about love, friendship, and human connections', '#ec4899', 'heart'),
('Success & Business', 'Entrepreneurship, leadership, and professional growth', '#6366f1', 'trending-up'),
('Spirituality', 'Religious, spiritual, and mindfulness quotes', '#7c3aed', 'sun'),
('Science & Knowledge', 'Quotes about learning, discovery, and understanding', '#0ea5e9', 'microscope');

-- Function to automatically calculate word count and reading time
CREATE OR REPLACE FUNCTION calculate_quote_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate word count (approximate)
    NEW.word_count = array_length(string_to_array(trim(NEW.quote_text), ' '), 1);
    
    -- Calculate reading time in seconds (average 200 words per minute)
    NEW.reading_time_seconds = GREATEST(1, ROUND((NEW.word_count::float / 200) * 60));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate metrics on insert/update
CREATE TRIGGER calculate_quote_metrics_trigger
    BEFORE INSERT OR UPDATE OF quote_text ON public.quotes
    FOR EACH ROW
    EXECUTE FUNCTION calculate_quote_metrics();

-- Function to increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags SET usage_count = GREATEST(0, usage_count - 1) WHERE id = OLD.tag_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update tag usage count
CREATE TRIGGER update_tag_usage_trigger
    AFTER INSERT OR DELETE ON public.quote_tags
    FOR EACH ROW
    EXECUTE FUNCTION increment_tag_usage();