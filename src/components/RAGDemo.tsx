import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { ragService } from '@/services/ragService';
import { motion } from 'framer-motion';

interface RAGStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  data?: any;
}

export function RAGDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<RAGStep[]>([]);
  const [finalRecommendations, setFinalRecommendations] = useState<any[]>([]);

  const demoClothingItems = [
    {
      type: 't-shirt',
      gender: 'children',
      season: 'summer',
      condition: 'good',
      quantity: 5
    },
    {
      type: 'pants',
      gender: 'children', 
      season: 'all-season',
      condition: 'new',
      quantity: 3
    }
  ];

  const runRAGDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setSteps([]);
    setFinalRecommendations([]);

    // Step 1: Input Analysis
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSteps([{
      title: "1. Input Analysis",
      description: "AI analyzes your donation items: 5x children's t-shirts (summer, good condition) + 3x children's pants (new condition)",
      icon: <Search className="w-5 h-5" />,
      data: demoClothingItems
    }]);
    setCurrentStep(1);

    // Step 2: Retrieval Phase
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const relevantCenters = await ragService.retrieveRelevantCenters(demoClothingItems);
      setSteps(prev => [...prev, {
        title: "2. Retrieval Phase (RAG)",
        description: `Retrieved ${relevantCenters.length} donation centers from database that match children's clothing needs`,
        icon: <Target className="w-5 h-5" />,
        data: relevantCenters.slice(0, 3) // Show first 3 for demo
      }]);
      setCurrentStep(2);

      // Step 3: AI Matching & Scoring
      await new Promise(resolve => setTimeout(resolve, 1500));
      const recommendations = await ragService.generateRecommendation(demoClothingItems, relevantCenters);
      setSteps(prev => [...prev, {
        title: "3. AI Matching & Scoring",
        description: "AI calculates match scores based on item type (40%), gender (30%), season (20%), and priority (10%)",
        icon: <Brain className="w-5 h-5" />,
        data: recommendations.slice(0, 3)
      }]);
      setCurrentStep(3);

      // Step 4: Final Recommendations
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSteps(prev => [...prev, {
        title: "4. AI-Generated Recommendations",
        description: "Final recommendations with reasoning and match scores, ranked by relevance",
        icon: <Lightbulb className="w-5 h-5" />,
      }]);
      setFinalRecommendations(recommendations.slice(0, 3));
      setCurrentStep(4);

    } catch (error) {
      console.error('RAG Demo error:', error);
    }

    setIsRunning(false);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Matching</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How RAG Works in ClothShare
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how our Retrieval-Augmented Generation (RAG) system finds the perfect donation centers for your clothes
          </p>
        </div>

        {/* Demo Trigger */}
        <div className="text-center mb-8">
          <Button
            onClick={runRAGDemo}
            disabled={isRunning}
            size="lg"
            className="gradient-warm text-primary-foreground px-8 py-4"
          >
            <Brain className="w-5 h-5 mr-2" />
            {isRunning ? 'Running AI Demo...' : 'See How RAG AI Works'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Watch our AI analyze clothing items and find perfect donation matches
          </p>
        </div>

        {/* Steps Visualization */}
        {steps.length > 0 && (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className={`shadow-card ${currentStep > index ? 'border-primary' : ''}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${currentStep > index ? 'bg-primary text-white' : 'bg-muted'}`}>
                        {step.icon}
                      </div>
                      {step.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardHeader>
                  
                  {step.data && (
                    <CardContent>
                      {index === 0 && (
                        // Input data
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {step.data.map((item: any, i: number) => (
                            <div key={i} className="bg-muted/50 p-3 rounded-lg">
                              <div className="font-medium">{item.quantity}x {item.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.gender} • {item.season} • {item.condition}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {index === 1 && (
                        // Retrieved centers
                        <div className="space-y-3">
                          {step.data.map((center: any, i: number) => (
                            <div key={i} className="bg-muted/50 p-3 rounded-lg">
                              <div className="font-medium">{center.name}</div>
                              <div className="text-sm text-muted-foreground">{center.type}</div>
                              <div className="flex gap-1 mt-2">
                                {center.needs_types.slice(0, 3).map((type: string) => (
                                  <Badge key={type} variant="secondary" className="text-xs">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {index === 2 && (
                        // Match scores
                        <div className="space-y-3">
                          {step.data.map((rec: any, i: number) => (
                            <div key={i} className="bg-muted/50 p-3 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <div className="font-medium">{rec.center.name}</div>
                                <Badge className="bg-primary text-white">
                                  {rec.matchScore.toFixed(0)}% match
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Score calculation: Type match + Gender match + Season match + Priority bonus
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Final Recommendations */}
        {finalRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="shadow-elevated border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary text-white">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  AI-Generated Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {finalRecommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{rec.center.name}</h4>
                          <p className="text-sm text-muted-foreground">{rec.center.address}</p>
                        </div>
                        <Badge className="bg-green-500 text-white text-lg px-3 py-1">
                          {rec.matchScore.toFixed(0)}% Match
                        </Badge>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <h5 className="font-medium text-sm mb-1">AI Reasoning:</h5>
                        <p className="text-sm">{rec.reasoning}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {rec.center.type}
                        </Badge>
                        <Badge variant="outline">
                          {rec.center.priority} priority
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* RAG Explanation */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">What is RAG?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Retrieval-Augmented Generation</h4>
                <p className="text-sm text-muted-foreground">
                  RAG combines information retrieval with AI generation. First, it retrieves relevant donation centers 
                  from our database based on your clothing items. Then, AI generates personalized recommendations 
                  with detailed reasoning.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Why RAG for ClothShare?</h4>
                <p className="text-sm text-muted-foreground">
                  RAG ensures recommendations are based on real, up-to-date donation center data while providing 
                  intelligent matching and clear explanations for why each center is suitable for your specific donation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}