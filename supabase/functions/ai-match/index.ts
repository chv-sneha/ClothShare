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

function calculateMatchScore(items: ClothingItem[], center: DonationCenter): number {
  let score = 0;
  let totalItems = 0;

  for (const item of items) {
    totalItems += item.quantity;
    
    // Gender match
    if (center.needs_gender.includes(item.gender) || center.needs_gender.includes('unisex')) {
      score += 30;
    }
    
    // Type match
    if (center.needs_types.includes(item.type)) {
      score += 40;
    }
    
    // Season match
    if (center.needs_season.includes(item.season) || center.needs_season.includes('all-season')) {
      score += 20;
    }
    
    // Condition bonus
    if (item.condition === 'excellent' || item.condition === 'good') {
      score += 10;
    }
  }

  // Priority bonus
  const priorityBonus = {
    'urgent': 20,
    'high': 15,
    'medium': 10,
    'low': 5
  }[center.priority] || 0;
  
  score += priorityBonus;
  
  return Math.min(100, Math.round(score / totalItems));
}

function generateMatchReason(items: ClothingItem[], center: DonationCenter, score: number): string {
  const itemTypes = [...new Set(items.map(item => item.type))].join(', ');
  const genders = [...new Set(items.map(item => item.gender))].join('/');
  
  let reason = `Good match for ${genders} ${itemTypes}.`;
  
  if (center.priority === 'urgent' || center.priority === 'high') {
    reason += ` This ${center.type} has ${center.priority} priority needs.`;
  }
  
  return reason;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, userLatitude, userLongitude } = await req.json();
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch all active donation centers
    const { data: centers, error: centersError } = await supabase
      .from("donation_centers")
      .select("*")
      .eq("is_active", true);

    if (centersError) throw centersError;

    // Calculate distances and match scores
    const centersWithScores = (centers || []).map((center: DonationCenter) => {
      let distance = null;
      if (userLatitude && userLongitude) {
        distance = calculateDistance(userLatitude, userLongitude, center.latitude, center.longitude);
      }
      
      const score = calculateMatchScore(items as ClothingItem[], center);
      const reason = generateMatchReason(items as ClothingItem[], center, score);
      
      return { 
        center, 
        distance, 
        score, 
        aiReason: reason 
      };
    });

    // Sort by score (descending) and then by distance (ascending)
    centersWithScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

    // Return top 5 matches
    const topMatches = centersWithScores.slice(0, 5);

    return new Response(JSON.stringify({ matches: topMatches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Match error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
