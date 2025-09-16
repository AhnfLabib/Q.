import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  confirmationUrl: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, name }: ConfirmationEmailRequest = await req.json();

    console.log("Sending confirmation email to:", email);

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
          email: email,
          name: name || email.split('@')[0]
        }
      ],
      subject: "Welcome to Q. - Verify your email",
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
            .content { padding: 40px 30px; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; margin: 20px 0; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; }
            .button:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4); }
            .footer { padding: 30px; background: #f8fafc; text-align: center; color: #64748b; font-size: 14px; }
            h1 { color: #1e293b; margin-bottom: 16px; }
            p { color: #475569; line-height: 1.6; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div style="padding: 40px 20px;">
            <div class="container">
              <div class="header">
                <div class="logo">Q<span class="accent">.</span></div>
                <p style="margin: 0; opacity: 0.9;">Welcome to your quote collection</p>
              </div>
              
              <div class="content">
                <h1>Verify your email address</h1>
                <p>Hi ${name || 'there'},</p>
                <p>Thank you for joining Q.! We're excited to help you build your personal quote library.</p>
                <p>To get started, please verify your email address by clicking the button below:</p>
                
                <a href="${confirmationUrl}" class="button">Verify Email Address</a>
                
                <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${confirmationUrl}" style="color: #667eea; word-break: break-all;">${confirmationUrl}</a>
                </p>
                
                <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
                  This link will expire in 24 hours for security reasons.
                </p>
              </div>
              
              <div class="footer">
                <p>Once verified, you'll be able to:</p>
                <p>📝 Collect and organize your favorite quotes<br>
                ⭐ Mark quotes as favorites<br>
                📧 Get personalized newsletters<br>
                🔗 Share quotes with others</p>
                <p style="margin-top: 20px;">
                  If you didn't create an account with Q., you can safely ignore this email.
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
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation-email function:", error);
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