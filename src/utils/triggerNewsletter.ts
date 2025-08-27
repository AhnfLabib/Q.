import { supabase } from "@/integrations/supabase/client";

export const triggerNewsletterForUser = async (userId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('newsletter-scheduler', {
      body: { 
        frequency: 'daily',
        userId: userId
      }
    });

    if (error) {
      console.error('Newsletter trigger error:', error);
      throw error;
    }

    console.log('Newsletter triggered successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to trigger newsletter:', error);
    throw error;
  }
};