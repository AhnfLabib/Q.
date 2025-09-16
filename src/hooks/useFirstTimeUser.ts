import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useFirstTimeUser = () => {
  const { user, isAuthenticated } = useAuth();
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // Get user profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_login_completed, welcome_email_sent')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking first-time user status:', error);
          setLoading(false);
          return;
        }

        const isFirstTime = !profile.first_login_completed;
        setIsFirstTimeUser(isFirstTime);

        // If this is their first time, mark it as completed and send welcome email
        if (isFirstTime) {
          // Mark first login as completed
          await supabase
            .from('profiles')
            .update({ first_login_completed: true })
            .eq('user_id', user.id);

          // Send welcome email if not already sent
          if (!profile.welcome_email_sent) {
            try {
              await supabase.functions.invoke('send-welcome-email', {
                body: { userId: user.id }
              });
            } catch (emailError) {
              console.error('Error sending welcome email:', emailError);
              // Don't block the user experience if email fails
            }
          }
        }
      } catch (error) {
        console.error('Error in first-time user check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFirstTimeUser();
  }, [isAuthenticated, user]);

  return { isFirstTimeUser, loading };
};