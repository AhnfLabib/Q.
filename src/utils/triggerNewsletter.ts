import { supabase } from "@/integrations/supabase/client";

export const triggerNewsletter = async (userId?: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('newsletter-scheduler', {
      body: { 
        frequency: 'daily',
        userId: userId // Optional: target specific user
      }
    });

    if (error) {
      console.error('Error triggering newsletter:', error);
      return { success: false, error: error.message };
    }

    console.log('Newsletter triggered successfully:', data);
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to trigger newsletter:', err);
    return { success: false, error: err.message };
  }
};

// Auto-trigger for Ahnaf (for testing)
if (typeof window !== 'undefined') {
  console.log('Triggering newsletter for Ahnaf...');
  triggerNewsletter('68e9c281-c459-459c-bd07-2d524fe6127b')
    .then(result => console.log('Newsletter result:', result));
}