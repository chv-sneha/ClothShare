export type Gender = 'men' | 'women' | 'children' | 'unisex';
export type Season = 'summer' | 'winter' | 'all-season';
export type Condition = 'new' | 'like-new' | 'good' | 'fair';

export interface ClothingItem {
  id: string;
  gender: Gender;
  type: string;
  season: Season;
  quantity: number;
  condition: Condition;
}

export interface DonationCenter {
  id: string;
  name: string;
  type: 'orphanage' | 'old-age-home' | 'shelter' | 'ngo';
  location: string;
  distance: string;
  needs: {
    genders: Gender[];
    types: string[];
    seasons: Season[];
    priority: 'high' | 'medium' | 'low';
  };
  description: string;
  image: string;
  contact: string;
}

export interface MatchResult {
  center: DonationCenter;
  matchScore: number;
  matchedItems: ClothingItem[];
  reason: string;
}
