import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ClothingItem {
  type: string;
  gender: string;
  season: string;
  quantity: number;
  condition: string;
}

interface DonationCenter {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  needs_gender: string[];
  needs_types: string[];
  needs_season: string[];
  priority: string;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, userLatitude, userLongitude } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch all active donation centers
    const { data: centers, error: centersError } = await supabase
      .from("donation_centers")
      .select("*")
      .eq("is_active", true);

    if (centersError) throw centersError;

    // Calculate distances if user location provided
    const centersWithDistance = (centers || []).map((center: DonationCenter) => {
      let distance = null;
      if (userLatitude && userLongitude) {
        distance = calculateDistance(userLatitude, userLongitude, center.latitude, center.longitude);
      }
      return { ...center, distance };
    });

    // Sort by distance
    if (userLatitude && userLongitude) {
      centersWithDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }

    // Build context for AI
    const itemsSummary = (items as ClothingItem[])
      .map((item) => `${item.quantity}x ${item.gender} ${item.type} (${item.season}, ${item.condition} condition)`)
      .join(", ");

    const centersContext = centersWithDistance
      .map((c) => {
        const distanceText = c.distance ? `${c.distance.toFixed(1)}km away` : "distance unknown";
        return `- ${c.name} (${c.type}, ${c.priority} priority, ${distanceText}): Needs ${c.needs_gender.join("/")} ${c.needs_types.join(", ")} for ${c.needs_season.join("/")} seasons. Located at ${c.address}`;
      })
      .join("\n");

    const systemPrompt = `You are an AI assistant for ClothShare, a clothing donation matching platform. Your job is to analyze donated clothing items and recommend the best donation centers based on:

1. NEED MATCH: How well the donated items match what the center needs (gender, type, season)
2. PRIORITY: Centers with "urgent" or "high" priority should be preferred
3. PROXIMITY: Closer centers are better if the user's location is available
4. IMPACT: Consider where the donation will have the most impact

You must respond with a JSON array of recommendations. Each recommendation must have:
- centerId: the center's ID
- score: match score 0-100
- reason: 1-2 sentence explanation why this center is a good match

Be specific about why items match the center's needs. Mention the types of items and who will benefit.`;

    const userPrompt = `User is donating: ${itemsSummary}

Available donation centers:
${centersContext}

Centers data (use these IDs):
${JSON.stringify(centersWithDistance.map(c => ({ id: c.id, name: c.name })))}

Analyze and return the top 3-5 best matching centers as a JSON array.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "recommend_centers",
              description: "Return donation center recommendations",
              parameters: {
                type: "object",
                properties: {
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        centerId: { type: "string" },
                        score: { type: "number" },
                        reason: { type: "string" },
                      },
                      required: ["centerId", "score", "reason"],
                    },
                  },
                },
                required: ["recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "recommend_centers" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    
    // Extract recommendations from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let recommendations = [];
    
    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      recommendations = args.recommendations || [];
    }

    // Enrich recommendations with center data
    const enrichedResults = recommendations.map((rec: any) => {
      const center = centersWithDistance.find((c) => c.id === rec.centerId);
      return {
        center,
        score: rec.score,
        aiReason: rec.reason,
      };
    }).filter((r: any) => r.center);

    return new Response(JSON.stringify({ matches: enrichedResults }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI match error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
