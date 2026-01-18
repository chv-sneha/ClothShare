import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Heart, Star, ArrowLeft, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, calculateDistance } from '@/hooks/useLocation';
import { useNavigate } from 'react-router-dom';

interface DonationCenter {
  id: string;
  name: string;
  type: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  needs_gender: string[];
  needs_types: string[];
  needs_season: string[];
  priority: string;
}

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-600 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const typeIcons: Record<string, string> = {
  orphanage: '👶',
  'old-age-home': '👴',
  shelter: '🏠',
  ngo: '🤝',
};

export default function Centers() {
  const [centers, setCenters] = useState<(DonationCenter & { distance?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCenters();
  }, [location.latitude, location.longitude]);

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('donation_centers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      let centersWithDistance: (DonationCenter & { distance?: number })[] = (data || []) as DonationCenter[];

      // Calculate distance if user location is available
      if (location.latitude && location.longitude) {
        centersWithDistance = centersWithDistance.map((center) => ({
          ...center,
          distance: calculateDistance(
            location.latitude!,
            location.longitude!,
            center.latitude,
            center.longitude
          ),
        }));

        // Sort by distance
        centersWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      setCenters(centersWithDistance);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Donation Centers
            </h1>
            <p className="text-muted-foreground">
              Find donation centers near you and see what they need most.
            </p>

            {/* Location Status */}
            <div className="mt-4 flex items-center gap-2">
              {location.loading ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Detecting location...
                </Badge>
              ) : location.error ? (
                <Badge variant="destructive">Location unavailable</Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {location.address?.split(',').slice(0, 2).join(',')}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Centers Grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
              />
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2"
            >
              {centers.map((center, index) => (
                <motion.div
                  key={center.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-card transition-all overflow-hidden">
                    {/* Priority Banner */}
                    {center.priority === 'urgent' && (
                      <div className="bg-red-500 text-white text-xs font-medium py-1 px-3 text-center">
                        🚨 Urgent Need
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{typeIcons[center.type] || '🏢'}</div>
                          <div>
                            <CardTitle className="text-lg">{center.name}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize">
                              {center.type.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <Badge className={priorityColors[center.priority]}>
                          {center.priority}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{center.description}</p>

                      {/* Location */}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm">{center.address}</p>
                          {center.distance !== undefined && (
                            <p className="text-xs text-primary font-medium mt-0.5">
                              {center.distance < 1
                                ? `${Math.round(center.distance * 1000)}m away`
                                : `${center.distance.toFixed(1)} km away`}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contact */}
                      {center.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <a
                            href={`tel:${center.phone}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {center.phone}
                          </a>
                        </div>
                      )}

                      {/* Needs */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          Currently Needs:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {center.needs_types.slice(0, 6).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {center.needs_types.length > 6 && (
                            <Badge variant="outline" className="text-xs">
                              +{center.needs_types.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`,
                              '_blank'
                            )
                          }
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Directions
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 gradient-warm text-primary-foreground"
                          onClick={() => navigate('/#donate-form')}
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          Donate Here
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
