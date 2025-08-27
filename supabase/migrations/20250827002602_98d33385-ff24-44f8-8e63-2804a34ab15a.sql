-- Fix security warnings: Set search_path for all functions to prevent security vulnerabilities

-- Fix calculate_quote_metrics function
CREATE OR REPLACE FUNCTION public.calculate_quote_metrics()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Calculate word count (approximate)
    NEW.word_count = array_length(string_to_array(trim(NEW.quote_text), ' '), 1);
    
    -- Calculate reading time in seconds (average 200 words per minute)
    NEW.reading_time_seconds = GREATEST(1, ROUND((NEW.word_count::float / 200) * 60));
    
    RETURN NEW;
END;
$$;

-- Fix increment_tag_usage function
CREATE OR REPLACE FUNCTION public.increment_tag_usage()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
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
$$;

-- Fix existing update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix existing handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'name');
  RETURN NEW;
END;
$$;