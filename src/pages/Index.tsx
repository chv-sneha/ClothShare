import { useState, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { EnhancedClothingForm } from '@/components/EnhancedClothingForm';
import { MatchResults } from '@/components/MatchResults';
import { Footer } from '@/components/Footer';
import { ClothingItem, MatchResult } from '@/types/donation';
import { findBestMatches } from '@/utils/matchingAlgorithm';
import { donationStorage } from '@/services/donationStorage';

const Index = () => {
  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (items: any[]) => {
    // Save donations to local storage
    donationStorage.saveDonations(items);
    
    // Convert enhanced form data to ClothingItem format
    const clothingItems: ClothingItem[] = items.map(item => ({
      id: item.id,
      type: item.clothesType,
      gender: item.gender as any,
      season: item.season as any,
      quantity: item.quantity,
      condition: item.condition as any
    }));
    
    const results = await findBestMatches(clothingItems);
    
    // Match donations to centers
    if (results.length > 0) {
      items.forEach((item, index) => {
        if (results[index]) {
          donationStorage.matchDonationToCenter(item.id, results[index].center);
        }
      });
    }
    
    setMatchResults(results);
    
    // Scroll to results after a short delay
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setMatchResults(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero onGetStarted={handleGetStarted} />
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        <div ref={formRef}>
          <EnhancedClothingForm onSubmit={handleFormSubmit} />
        </div>
        
        {matchResults && (
          <div ref={resultsRef}>
            <MatchResults results={matchResults} onReset={handleReset} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
