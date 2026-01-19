import { ClothingItem, DonationCenter, MatchResult } from '@/types/donation';
import { ragService } from '@/services/ragService';

export async function findBestMatches(items: ClothingItem[]): Promise<MatchResult[]> {
  try {
    // Use RAG service to get AI-powered recommendations
    const ragRecommendations = await ragService.getRecommendations(items);
    
    // Convert RAG recommendations to MatchResult format
    const results: MatchResult[] = ragRecommendations.map(rec => ({
      center: {
        id: rec.center.id,
        name: rec.center.name,
        type: rec.center.type as any,
        address: rec.center.address,
        description: rec.center.description,
        phone: rec.center.phone,
        email: rec.center.email,
        needs: {
          types: rec.center.needs_types,
          genders: rec.center.needs_gender,
          seasons: rec.center.needs_season,
          priority: rec.center.priority as any
        }
      },
      matchScore: Math.round(rec.matchScore),
      matchedItems: items, // All items are considered for RAG matching
      reason: rec.reasoning
    }));

    return results;
  } catch (error) {
    console.error('Error in RAG matching:', error);
    // Fallback to original algorithm if RAG fails
    return fallbackMatching(items);
  }
}

// Fallback matching algorithm
function fallbackMatching(items: ClothingItem[]): MatchResult[] {
  // Simple fallback - return empty array or basic matching
  return [];
}
