import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const requestedFrequency = url.searchParams.get("frequency");
    
    // If no frequency specified, send to all users regardless of frequency
    const frequencies = requestedFrequency ? [requestedFrequency] : ["daily", "weekly"];
    
    console.log(`Newsletter scheduler triggered for frequencies: ${frequencies.join(", ")}`);

    const results = [];

    // Send newsletters for each frequency
    for (const frequency of frequencies) {
      console.log(`Processing ${frequency} newsletters...`);
      
      const response = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify({ frequency }),
      });

      const result = await response.json();
      results.push({ frequency, result });
      
      console.log(`${frequency} newsletter result:`, result);
    }

    const totalSent = results.reduce((sum, r) => sum + (r.result.sent || 0), 0);
    const totalFailed = results.reduce((sum, r) => sum + (r.result.failed || 0), 0);

    console.log(`Newsletter scheduler complete: ${totalSent} sent, ${totalFailed} failed across all frequencies`);

    return new Response(
      JSON.stringify({
        message: "Newsletter batch complete",
        sent: totalSent,
        failed: totalFailed,
        total: totalSent + totalFailed,
        details: results
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in newsletter-scheduler:", error);
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