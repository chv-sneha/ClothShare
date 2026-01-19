import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Truck, Package, MapPin, Phone } from 'lucide-react';
import { donationStorage } from '@/services/donationStorage';
import { motion } from 'framer-motion';

interface Donation {
  id: string;
  clothesType: string;
  gender: string;
  quantity: number;
  condition: string;
  status: string;
  location: string;
  notes: string;
  createdAt: string;
  pickupDate?: string;
  deliveredDate?: string;
  matchedCenter?: {
    name: string;
    phone: string;
    address: string;
  };
}

const statusSteps = [
  { key: 'submitted', label: 'Submitted', icon: Package },
  { key: 'matched', label: 'Matched', icon: CheckCircle },
  { key: 'pickup_scheduled', label: 'Pickup Scheduled', icon: Clock },
  { key: 'picked', label: 'Picked Up', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted': return 'bg-blue-500';
    case 'matched': return 'bg-green-500';
    case 'pickup_scheduled': return 'bg-yellow-500';
    case 'picked': return 'bg-orange-500';
    case 'delivered': return 'bg-green-600';
    default: return 'bg-gray-500';
  }
};

export function DonationTracking() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = () => {
    try {
      const storedDonations = donationStorage.getDonations();
      setDonations(storedDonations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.key === status);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading your donations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Track Your Donations
          </h1>
          <p className="text-muted-foreground">
            Follow the journey of your donated clothes from submission to delivery
          </p>
        </div>

        {donations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-4">Start your first donation to see tracking here</p>
              <Button onClick={() => window.location.href = '/#donate-form'}>
                Donate Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {donations.map((donation) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-card border-0 overflow-hidden"
              >
                <Card>
                  <CardHeader className="bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {donation.quantity}x {donation.clothesType} ({donation.gender})
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(donation.status)} text-white`}>
                        {donation.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    {/* Status Timeline */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between relative">
                        {statusSteps.map((step, index) => {
                          const Icon = step.icon;
                          const isCompleted = getStatusIndex(donation.status) >= index;
                          const isCurrent = getStatusIndex(donation.status) === index;
                          
                          return (
                            <div key={step.key} className="flex flex-col items-center relative z-10">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCompleted ? 'bg-primary text-white' : 
                                isCurrent ? 'bg-primary/20 text-primary border-2 border-primary' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <span className={`text-xs mt-2 text-center ${
                                isCompleted || isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                              }`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                        
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ 
                              width: `${(getStatusIndex(donation.status) / (statusSteps.length - 1)) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Donation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{donation.location}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Condition:</span> {donation.condition}
                        </div>
                        {donation.notes && (
                          <div className="text-sm">
                            <span className="font-medium">Notes:</span> {donation.notes}
                          </div>
                        )}
                      </div>
                      
                      {donation.matchedCenter && (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Matched Center:</span>
                            <div>{donation.matchedCenter.name}</div>
                            <div className="text-muted-foreground">{donation.matchedCenter.address}</div>
                          </div>
                          {donation.matchedCenter.phone && (
                            <Button variant="outline" size="sm" className="w-full">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Center
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status-specific information */}
                    {donation.pickupDate && (
                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                        <strong>Pickup scheduled:</strong> {new Date(donation.pickupDate).toLocaleString()}
                      </div>
                    )}
                    
                    {donation.deliveredDate && (
                      <div className="bg-green-50 p-3 rounded-lg text-sm">
                        <strong>Delivered:</strong> {new Date(donation.deliveredDate).toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}