// Database types that match our Supabase schema
export interface Author {
  id: string;
  name: string;
  bio?: string;
  nationality?: string;
  birth_year?: number;
  death_year?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface Quote {
  id: string;
  quote_text: string;
  author: string;
  book?: string;
  chapter?: string;
  page_number?: number;
  source_url?: string;
  is_favorite: boolean;
  is_public: boolean;
  view_count: number;
  share_count: number;
  word_count?: number;
  reading_time_seconds?: number;
  difficulty_level: number;
  mood?: string;
  tags: string[];
  user_id: string;
  author_id?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteTag {
  id: string;
  quote_id: string;
  tag_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name?: string;
  newsletter_frequency: string;
  created_at: string;
  updated_at: string;
}

// Form types for creating/editing
export interface QuoteFormData {
  quote_text: string;
  author: string;
  book?: string;
  chapter?: string;
  page_number?: number;
  source_url?: string;
  tags: string[];
  category_id?: string;
  difficulty_level?: number;
  mood?: string;
}

export interface AuthorFormData {
  name: string;
  bio?: string;
  nationality?: string;
  birth_year?: number;
  death_year?: number;
  image_url?: string;
}

export interface TagFormData {
  name: string;
  color?: string;
}