import { useState, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { ClothingForm } from '@/components/ClothingForm';
import { MatchResults } from '@/components/MatchResults';
import { Footer } from '@/components/Footer';
import { ClothingItem, MatchResult } from '@/types/donation';
import { findBestMatches } from '@/utils/matchingAlgorithm';

const Index = () => {
  const [matchResults, setMatchResults] = useState<MatchResult[] | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (items: ClothingItem[]) => {
    const results = await findBestMatches(items);
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
          <ClothingForm onSubmit={handleFormSubmit} />
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
