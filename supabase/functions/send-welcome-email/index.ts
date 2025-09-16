import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId }: WelcomeEmailRequest = await req.json();

    console.log("Sending welcome email for user:", userId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw new Error("Failed to fetch user profile");
    }

    // Check if welcome email already sent
    if (profile.welcome_email_sent) {
      return new Response(JSON.stringify({ message: "Welcome email already sent" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get user email from auth
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      throw new Error("Failed to fetch user");
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    if (!brevoApiKey) {
      throw new Error("BREVO_API_KEY not found");
    }

    const emailData = {
      sender: {
        name: "Q. - Quote Collector",
        email: "noreply@yourdomain.com"
      },
      to: [
        {
          email: user.email!,
          name: profile.name || user.email!.split('@')[0]
        }
      ],
      subject: "Welcome to Q. - Your journey begins here!",
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Q.</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { max-width: 600px; margin: 0 auto; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
            .logo { font-size: 48px; font-weight: bold; margin-bottom: 10px; }
            .accent { color: #fbbf24; }
            .content { padding: 40px 30px; }
            .step { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 16px 0; border-left: 4px solid #667eea; }
            .step-number { background: #667eea; color: white; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; margin-right: 12px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); }
            .footer { padding: 30px; background: #f8fafc; text-align: center; color: #64748b; font-size: 14px; }
            h1 { color: #1e293b; margin-bottom: 16px; }
            h3 { color: #1e293b; margin-bottom: 8px; }
            p { color: #475569; line-height: 1.6; margin-bottom: 16px; }
            ul { color: #475569; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div style="padding: 40px 20px;">
            <div class="container">
              <div class="header">
                <div class="logo">Q<span class="accent">.</span></div>
                <p style="margin: 0; opacity: 0.9;">Your personal quote collection</p>
              </div>
              
              <div class="content">
                <h1>Welcome to Q., ${profile.name || 'there'}! 🎉</h1>
                <p>Congratulations on joining our community of quote collectors! You're now ready to build your personal library of inspiring words.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${supabaseUrl.replace('supabase.co', 'lovableproject.com')}/dashboard" class="button">Start Collecting Quotes</a>
                </div>
                
                <h3>Here's how to get started:</h3>
                
                <div class="step">
                  <span class="step-number">1</span>
                  <strong>Add your first quote</strong><br>
                  Click the "+" button in your dashboard to add a quote. Include the author, source, and any tags to organize your collection.
                </div>
                
                <div class="step">
                  <span class="step-number">2</span>
                  <strong>Organize with favorites</strong><br>
                  Star your most meaningful quotes to create a curated favorites collection for quick access.
                </div>
                
                <div class="step">
                  <span class="step-number">3</span>
                  <strong>Set up your newsletter</strong><br>
                  Get personalized quote deliveries in your inbox. Choose your frequency in Settings.
                </div>
                
                <div class="step">
                  <span class="step-number">4</span>
                  <strong>Share the inspiration</strong><br>
                  Use the share feature to spread meaningful quotes with friends and family.
                </div>
                
                <h3>Pro Tips:</h3>
                <ul>
                  <li><strong>Use tags</strong> to categorize quotes by theme, mood, or topic</li>
                  <li><strong>Include sources</strong> like book titles and page numbers for reference</li>
                  <li><strong>Add context</strong> with the chapter or situation where you found the quote</li>
                  <li><strong>Set difficulty levels</strong> to track complex vs. simple quotes</li>
                </ul>
                
                <p style="margin-top: 30px;">We're excited to see your quote collection grow! If you have any questions, just reply to this email.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${supabaseUrl.replace('supabase.co', 'lovableproject.com')}/dashboard" class="button">Get Started Now</a>
                </div>
              </div>
              
              <div class="footer">
                <p><strong>Happy collecting!</strong><br>The Q. Team</p>
                <p style="margin-top: 20px; font-size: 12px;">
                  You received this email because you created an account with Q. 
                  You can manage your email preferences in your account settings.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", errorData);
      throw new Error(`Email sending failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Welcome email sent successfully:", result);

    // Mark welcome email as sent
    await supabase
      .from('profiles')
      .update({ welcome_email_sent: true })
      .eq('user_id', userId);

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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