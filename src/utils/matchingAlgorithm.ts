import { ClothingItem, DonationCenter, MatchResult } from '@/types/donation';
import { donationCenters } from '@/data/donationCenters';

export function findBestMatches(items: ClothingItem[]): MatchResult[] {
  const results: MatchResult[] = [];

  for (const center of donationCenters) {
    let score = 0;
    const matchedItems: ClothingItem[] = [];
    const reasons: string[] = [];

    for (const item of items) {
      let itemScore = 0;

      // Gender match
      if (center.needs.genders.includes(item.gender) || center.needs.genders.includes('unisex')) {
        itemScore += 30;
      }

      // Type match
      if (center.needs.types.includes('all') || center.needs.types.includes(item.type)) {
        itemScore += 25;
      }

      // Season match
      if (center.needs.seasons.includes(item.season) || center.needs.seasons.includes('all-season')) {
        itemScore += 20;
      }

      // Condition bonus
      if (item.condition === 'new' || item.condition === 'like-new') {
        itemScore += 15;
      } else if (item.condition === 'good') {
        itemScore += 10;
      }

      // Priority bonus
      if (center.needs.priority === 'high') {
        itemScore *= 1.3;
      } else if (center.needs.priority === 'medium') {
        itemScore *= 1.1;
      }

      if (itemScore > 30) {
        matchedItems.push(item);
        score += itemScore * item.quantity;
      }
    }

    if (matchedItems.length > 0) {
      // Generate reason
      const genderText = getGenderText(matchedItems);
      const seasonText = getSeasonText(matchedItems);
      const centerTypeText = getCenterTypeText(center.type);

      let reason = `Your ${genderText} clothing donation is a great match! `;
      
      if (center.needs.priority === 'high') {
        reason += `${center.name} has an urgent need for these items. `;
      }
      
      if (seasonText) {
        reason += `Your ${seasonText} items are especially needed. `;
      }

      reason += `As ${centerTypeText}, they will ensure your clothes reach those who need them most.`;

      results.push({
        center,
        matchScore: Math.round(score),
        matchedItems,
        reason,
      });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.matchScore - a.matchScore);
}

function getGenderText(items: ClothingItem[]): string {
  const genders = [...new Set(items.map(i => i.gender))];
  if (genders.length === 1) {
    return genders[0] === 'children' ? "children's" : `${genders[0]}'s`;
  }
  return 'mixed';
}

function getSeasonText(items: ClothingItem[]): string {
  const seasons = [...new Set(items.map(i => i.season))];
  if (seasons.includes('winter')) return 'winter';
  if (seasons.includes('summer')) return 'summer';
  return '';
}

function getCenterTypeText(type: string): string {
  switch (type) {
    case 'orphanage':
      return 'a children\'s home';
    case 'old-age-home':
      return 'an elderly care facility';
    case 'shelter':
      return 'a homeless shelter';
    case 'ngo':
      return 'a community organization';
    default:
      return 'a donation center';
  }
}
