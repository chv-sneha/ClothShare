import { supabase } from '@/integrations/supabase/client';

export interface ClothingItem {
  type: string;
  gender: string;
  season: string;
  condition: string;
  quantity: number;
}

export interface DonationCenter {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  needs_types: string[];
  needs_gender: string[];
  needs_season: string[];
  priority: string;
  phone?: string;
  email?: string;
}

export interface RAGRecommendation {
  center: DonationCenter;
  matchScore: number;
  reasoning: string;
}

class RAGService {
  // Retrieve relevant donation centers based on clothing items
  async retrieveRelevantCenters(clothingItems: ClothingItem[]): Promise<DonationCenter[]> {
    const { data: centers, error } = await supabase
      .from('donation_centers')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    // Filter centers based on clothing needs
    const relevantCenters = centers?.filter(center => {
      return clothingItems.some(item => 
        center.needs_types?.includes(item.type) &&
        (center.needs_gender?.includes(item.gender) || center.needs_gender?.includes('unisex')) &&
        (center.needs_season?.includes(item.season) || center.needs_season?.includes('all-season'))
      );
    }) || [];

    return relevantCenters;
  }

  // Generate AI recommendation using retrieved centers and user input
  async generateRecommendation(
    clothingItems: ClothingItem[], 
    retrievedCenters: DonationCenter[]
  ): Promise<RAGRecommendation[]> {
    const recommendations: RAGRecommendation[] = [];

    for (const center of retrievedCenters) {
      const matchScore = this.calculateMatchScore(clothingItems, center);
      const reasoning = this.generateReasoning(clothingItems, center, matchScore);
      
      recommendations.push({
        center,
        matchScore,
        reasoning
      });
    }

    // Sort by match score (highest first)
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Calculate match score between clothing items and center needs
  private calculateMatchScore(clothingItems: ClothingItem[], center: DonationCenter): number {
    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const item of clothingItems) {
      maxPossibleScore += 100;
      
      // Type match (40 points)
      if (center.needs_types?.includes(item.type)) {
        totalScore += 40;
      }
      
      // Gender match (30 points)
      if (center.needs_gender?.includes(item.gender) || center.needs_gender?.includes('unisex')) {
        totalScore += 30;
      }
      
      // Season match (20 points)
      if (center.needs_season?.includes(item.season) || center.needs_season?.includes('all-season')) {
        totalScore += 20;
      }
      
      // Priority bonus (10 points)
      if (center.priority === 'high') {
        totalScore += 10;
      } else if (center.priority === 'medium') {
        totalScore += 5;
      }
    }

    return maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  }

  // Generate reasoning for the recommendation
  private generateReasoning(
    clothingItems: ClothingItem[], 
    center: DonationCenter, 
    matchScore: number
  ): string {
    const matchedTypes = clothingItems
      .filter(item => center.needs_types?.includes(item.type))
      .map(item => item.type);
    
    const totalQuantity = clothingItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let reasoning = `${center.name} is a ${matchScore.toFixed(0)}% match for your donation. `;
    
    if (matchedTypes.length > 0) {
      reasoning += `They specifically need ${matchedTypes.join(', ')} which matches your donation. `;
    }
    
    if (center.priority === 'high') {
      reasoning += `This center has high priority needs and serves vulnerable populations. `;
    }
    
    reasoning += `Your ${totalQuantity} items can make a meaningful impact at this ${center.type}.`;
    
    return reasoning;
  }

  // Main RAG pipeline
  async getRecommendations(clothingItems: ClothingItem[]): Promise<RAGRecommendation[]> {
    try {
      // Step 1: Retrieve relevant centers
      const relevantCenters = await this.retrieveRelevantCenters(clothingItems);
      
      if (relevantCenters.length === 0) {
        return [];
      }
      
      // Step 2: Generate AI recommendations
      const recommendations = await this.generateRecommendation(clothingItems, relevantCenters);
      
      // Return top 5 recommendations
      return recommendations.slice(0, 5);
    } catch (error) {
      console.error('RAG Service Error:', error);
      throw error;
    }
  }
}

export const ragService = new RAGService();