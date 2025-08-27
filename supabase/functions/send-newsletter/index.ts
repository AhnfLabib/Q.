import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import * as brevo from "npm:@getbrevo/brevo@2.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  frequency?: 'daily' | 'weekly' | 'monthly';
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Newsletter Function Started ===");
    console.log("Timestamp:", new Date().toISOString());
    
    // Validate environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");

    console.log("Environment variables check:");
    console.log("SUPABASE_URL:", supabaseUrl ? "✓ Present" : "✗ Missing");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✓ Present" : "✗ Missing");
    console.log("BREVO_API_KEY:", brevoApiKey ? `✓ Present (${brevoApiKey.substring(0, 6)}...)` : "✗ Missing");
    
    // Log all available environment variables for debugging
    console.log("All environment variables:");
    for (const [key, value] of Object.entries(Deno.env.toObject())) {
      if (key.includes('BREVO') || key.includes('SUPABASE')) {
        console.log(`${key}: ${value ? `${value.substring(0, 6)}...` : 'undefined'}`);
      }
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing required Supabase environment variables");
    }

    if (!brevoApiKey) {
      throw new Error("Missing BREVO_API_KEY environment variable");
    }

    console.log("✓ API key validation passed");

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Initialize Brevo client
    let brevoApi: brevo.TransactionalEmailsApi;
    try {
      brevoApi = new brevo.TransactionalEmailsApi();
      brevoApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoApiKey);
      console.log("✓ Brevo client initialized successfully");
    } catch (brevoError: any) {
      console.error("✗ Failed to initialize Brevo client:", brevoError);
      throw new Error(`Brevo initialization failed: ${brevoError.message}`);
    }

    console.log("✓ Brevo API key configured and ready");

    let body: NewsletterRequest = {};
    if (req.method === "POST") {
      body = await req.json();
    }

    const { frequency, userId } = body;

    // Get users to send newsletter to
    let query = supabase
      .from("profiles")
      .select(`
        user_id,
        name,
        newsletter_frequency
      `)
      .neq("newsletter_frequency", "never");

    // Filter by frequency if specified
    if (frequency) {
      query = query.eq("newsletter_frequency", frequency);
    }

    // Filter by user ID if specified (for testing)
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data: profiles, error: profilesError } = await query;

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users found for newsletter", count: 0 }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Found ${profiles.length} users for newsletter`);

    const results = await Promise.allSettled(
      profiles.map(async (profile: any) => {
        try {
          // Get user's quotes for personalization
          const { data: userQuotes, error: quotesError } = await supabase
            .from("quotes")
            .select("*")
            .eq("user_id", profile.user_id)
            .eq("is_favorite", true)
            .limit(5);

          let selectedQuotes = userQuotes || [];

          // If user has no favorites, get random popular quotes
          if (selectedQuotes.length === 0) {
            const { data: popularQuotes, error: popularError } = await supabase
              .from("quotes")
              .select("*")
              .eq("is_public", true)
              .order("view_count", { ascending: false })
              .limit(3);

            if (!popularError && popularQuotes) {
              selectedQuotes = popularQuotes;
            }
          }

          // If still no quotes, create a default inspirational quote
          if (selectedQuotes.length === 0) {
            selectedQuotes = [{
              quote_text: "The only way to do great work is to love what you do.",
              author: "Steve Jobs",
              id: "default"
            }];
          }

          const userName = profile.name || "Reader";
          
          // Get user email from auth.users using service role key
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.user_id);
          
          if (userError || !userData?.user?.email) {
            console.error(`No email found for user ${profile.user_id}:`, userError);
            return { success: false, error: "No email found" };
          }
          
          const userEmail = userData.user.email;

          // Create email content
          const quotesHtml = selectedQuotes.map(quote => `
            <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #6366f1; border-radius: 8px;">
              <blockquote style="margin: 0; font-size: 18px; font-style: italic; color: #333;">
                "${quote.quote_text}"
              </blockquote>
              <cite style="display: block; margin-top: 10px; font-size: 14px; color: #666;">
                — ${quote.author}${quote.book ? `, ${quote.book}` : ''}
              </cite>
            </div>
          `).join('');

          const emailHtml = `
            <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="text-align: center; padding: 40px 20px;">
                <h1 style="font-size: 48px; font-weight: bold; margin: 0; color: #333;">
                  Q<span style="color: #6366f1;">.</span>
                </h1>
                <p style="color: #666; margin: 10px 0 30px;">Your Daily Inspiration</p>
              </div>
              
              <div style="padding: 0 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">
                  Good morning, ${userName}! ☀️
                </h2>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                  Here are some inspiring quotes to brighten your day. These are ${selectedQuotes.length > 1 && userQuotes && userQuotes.length > 0 ? 'selected from your personal favorites' : 'carefully curated'} just for you.
                </p>
                
                ${quotesHtml}
                
                <div style="margin: 40px 0; text-align: center;">
                  <a href="${Deno.env.get("SUPABASE_URL")?.replace('https://', 'https://') || 'https://app.example.com'}/dashboard" 
                     style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500;">
                    View Your Quote Library
                  </a>
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    You're receiving this because you're subscribed to ${profile.newsletter_frequency} newsletters from Q.
                    <br>
                    <a href="${Deno.env.get("SUPABASE_URL")?.replace('https://', 'https://') || 'https://app.example.com'}/settings" style="color: #6366f1;">Update your preferences</a>
                  </p>
                </div>
              </div>
            </div>
          `;

          // Send email using Brevo
          const sendSmtpEmail = new brevo.SendSmtpEmail();
          sendSmtpEmail.sender = { name: "Q. Daily Inspiration", email: "yommslrb@gmail.com" };
          sendSmtpEmail.to = [{ email: userEmail, name: userName }];
          sendSmtpEmail.subject = `Your ${profile.newsletter_frequency} inspiration from Q.`;
          sendSmtpEmail.htmlContent = emailHtml;
          
          const emailResponse = await brevoApi.sendTransacEmail(sendSmtpEmail);

          // Log the newsletter send
          const { error: logError } = await supabase
            .from("newsletter_logs")
            .insert({
              user_id: profile.user_id,
              frequency: profile.newsletter_frequency,
              content: {
                quotes: selectedQuotes.map(q => ({ id: q.id, quote_text: q.quote_text, author: q.author })),
                email_id: emailResponse.messageId
              },
              status: "sent"
            });

          if (logError) {
            console.error("Error logging newsletter:", logError);
          }

          console.log(`Newsletter sent to ${userEmail}`);
          return { success: true, email: userEmail, emailId: emailResponse.messageId };
        } catch (error: any) {
          console.error(`Error sending newsletter to user ${profile.user_id}:`, error);
          
          // Log failed send
          await supabase
            .from("newsletter_logs")
            .insert({
              user_id: profile.user_id,
              frequency: profile.newsletter_frequency,
              content: { error: error.message },
              status: "failed"
            });

          return { success: false, error: error.message };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    const failed = results.length - successful;

    console.log(`Newsletter batch complete: ${successful} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: "Newsletter batch complete",
        sent: successful,
        failed: failed,
        total: results.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);