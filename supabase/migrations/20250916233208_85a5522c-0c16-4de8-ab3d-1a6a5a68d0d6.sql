-- Add email verification and first login tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN first_login_completed BOOLEAN DEFAULT false,
ADD COLUMN welcome_email_sent BOOLEAN DEFAULT false;

-- Create index for faster lookups
CREATE INDEX idx_profiles_email_verified ON public.profiles(email_verified_at);
CREATE INDEX idx_profiles_first_login ON public.profiles(first_login_completed);