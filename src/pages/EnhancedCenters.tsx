import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, MessageCircle, Navigation, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, calculateDistance } from '@/hooks/useLocation';
import { motion } from 'framer-motion';

interface DonationCenter {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp_number: string;
  description: string;
  needs_types: string[];
  needs_gender: string[];
  needs_season: string[];
  priority: string;
  pickup_available: boolean;
  distance?: number;
}

export function EnhancedCenters() {
  const [centers, setCenters] = useState<DonationCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<DonationCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const location = useLocation();

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      // Calculate distances and sort by nearest
      const centersWithDistance = centers.map(center => ({
        ...center,
        distance: calculateDistance(
          location.latitude!,
          location.longitude!,
          center.latitude,
          center.longitude
        )
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setCenters(centersWithDistance);
    }
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    filterCenters();
  }, [centers, searchTerm, typeFilter]);

  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('donation_centers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCenters = () => {
    let filtered = centers;

    if (searchTerm) {
      filtered = filtered.filter(center =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(center => center.type === typeFilter);
    }

    setFilteredCenters(filtered);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'orphanage': return '🏠';
      case 'old-age-home': return '👴';
      case 'shelter': return '🏘️';
      case 'ngo': return '🤝';
      default: return '📍';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading donation centers...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Donation Centers Near You
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find nearby NGOs, ashrams, and donation centers. Contact them directly or get directions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search centers by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={typeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={typeFilter === 'orphanage' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('orphanage')}
              size="sm"
            >
              Orphanages
            </Button>
            <Button
              variant={typeFilter === 'old-age-home' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('old-age-home')}
              size="sm"
            >
              Elder Care
            </Button>
            <Button
              variant={typeFilter === 'shelter' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('shelter')}
              size="sm"
            >
              Shelters
            </Button>
            <Button
              variant={typeFilter === 'ngo' ? 'default' : 'outline'}
              onClick={() => setTypeFilter('ngo')}
              size="sm"
            >
              NGOs
            </Button>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full shadow-card hover:shadow-elevated transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTypeIcon(center.type)}</span>
                      <Badge className={`${getPriorityColor(center.priority)} text-white`}>
                        {center.priority} priority
                      </Badge>
                    </div>
                    {center.distance && (
                      <div className="text-sm text-muted-foreground">
                        {center.distance.toFixed(1)} km away
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">
                    {center.name}
                  </CardTitle>
                  
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{center.address}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {center.description}
                  </p>
                  
                  {/* Accepted Items */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Accepted Items:</h4>
                    <div className="flex flex-wrap gap-1">
                      {center.needs_types.slice(0, 3).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {center.needs_types.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{center.needs_types.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Pickup Available */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Pickup Available:</span>
                    <Badge variant={center.pickup_available ? 'default' : 'secondary'}>
                      {center.pickup_available ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCall(center.phone)}
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                    
                    {center.whatsapp_number ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsApp(center.whatsapp_number)}
                        className="w-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsApp(center.phone)}
                        className="w-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </Button>
                    )}
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDirections(center.address)}
                      className="w-full col-span-2"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No centers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}