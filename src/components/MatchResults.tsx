import { MapPin, Phone, Star, ChevronRight, Heart, CheckCircle2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchResult } from '@/types/donation';

interface MatchResultsProps {
  results: MatchResult[];
  onReset: () => void;
}

export function MatchResults({ results, onReset }: MatchResultsProps) {
  const topMatch = results[0];
  const otherMatches = results.slice(1, 4);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getCenterTypeLabel = (type: string) => {
    switch (type) {
      case 'orphanage':
        return 'Children\'s Home';
      case 'old-age-home':
        return 'Senior Care';
      case 'shelter':
        return 'Shelter';
      case 'ngo':
        return 'NGO';
      default:
        return type;
    }
  };

  if (results.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">No Matches Found</h3>
            <p className="text-muted-foreground mb-8">
              We couldn't find a suitable donation center for your items. 
              Please try with different items or contact us for assistance.
            </p>
            <Button onClick={onReset} variant="outline" size="lg">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Match Found!</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Your Perfect Donation Matches
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Based on your clothing items, we've found the best places where your donation 
              will make the biggest impact.
            </p>
          </div>

          {/* Top match - highlighted */}
          <Card className="shadow-elevated border-0 overflow-hidden mb-8 animate-scale-in">
            <div className="relative">
              {/* Best match badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-primary text-primary-foreground px-3 py-1 font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Best Match
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img 
                    src={topMatch.center.image} 
                    alt={topMatch.center.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content */}
                <CardContent className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {getCenterTypeLabel(topMatch.center.type)}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(topMatch.center.needs.priority)}`}>
                      {topMatch.center.needs.priority === 'high' ? 'Urgent Need' : 'Accepting'}
                    </Badge>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                    {topMatch.center.name}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {topMatch.center.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      {topMatch.matchScore} Match Score
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {topMatch.center.description}
                  </p>

                  {/* AI Recommendation */}
                  <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-secondary-foreground italic">
                      "{topMatch.reason}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="gradient-warm text-primary-foreground flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Here
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {topMatch.center.contact}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>

          {/* Other matches */}
          {otherMatches.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-foreground">Other Suitable Options</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {otherMatches.map((match, index) => (
                  <Card 
                    key={match.center.id} 
                    className="shadow-card border-0 overflow-hidden hover:shadow-elevated transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-40">
                      <img 
                        src={match.center.image} 
                        alt={match.center.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge variant="outline" className="bg-background/80 text-xs">
                          {getCenterTypeLabel(match.center.type)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h4 className="font-semibold text-foreground mb-2">
                        {match.center.name}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {match.center.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-primary fill-primary" />
                          {match.matchScore}
                        </span>
                      </div>
                      <Button variant="ghost" className="w-full justify-between text-primary hover:text-primary hover:bg-primary/5">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Reset button */}
          <div className="mt-12 text-center">
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="lg"
              className="border-2"
            >
              Donate More Items
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
