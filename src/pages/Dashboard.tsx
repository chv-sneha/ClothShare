import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, Clock, CheckCircle, Truck, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { format } from 'date-fns';

interface Donation {
  id: string;
  items: unknown;
  status: string;
  scheduled_date: string | null;
  ai_match_reason: string | null;
  match_score: number | null;
  created_at: string;
  donation_centers: {
    name: string;
    address: string;
    type: string;
  } | null;
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-600', label: 'Pending' },
  scheduled: { icon: Calendar, color: 'bg-blue-500/10 text-blue-600', label: 'Scheduled' },
  'in-transit': { icon: Truck, color: 'bg-purple-500/10 text-purple-600', label: 'In Transit' },
  delivered: { icon: CheckCircle, color: 'bg-green-500/10 text-green-600', label: 'Delivered' },
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select(`
          *,
          donation_centers (
            name,
            address,
            type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Donations
            </h1>
            <p className="text-muted-foreground">
              Track all your clothing donations and their journey to those in need.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Total Donations', value: donations.length, icon: Package },
              { label: 'Pending', value: donations.filter(d => d.status === 'pending').length, icon: Clock },
              { label: 'In Transit', value: donations.filter(d => d.status === 'in-transit').length, icon: Truck },
              { label: 'Delivered', value: donations.filter(d => d.status === 'delivered').length, icon: CheckCircle },
            ].map((stat, i) => (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-card transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Donations List */}
          {donations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your giving journey by donating your first clothes!
              </p>
              <Button onClick={() => navigate('/')} className="gradient-warm text-primary-foreground">
                Donate Now
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {donations.map((donation) => {
                const status = statusConfig[donation.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const rawItems = donation.items;
                const items: any[] = Array.isArray(rawItems) ? rawItems : [];

                return (
                  <motion.div key={donation.id} variants={itemVariants}>
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-card transition-all overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {donation.donation_centers?.name || 'Donation Center'}
                              </CardTitle>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3" />
                                {donation.donation_centers?.address || 'Address not available'}
                              </div>
                            </div>
                          </div>
                          <Badge className={`${status.color} font-medium`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Items */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {items.slice(0, 5).map((item: any, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {item.quantity}x {item.type} ({item.gender})
                            </Badge>
                          ))}
                          {items.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{items.length - 5} more
                            </Badge>
                          )}
                        </div>

                        {/* AI Match Reason */}
                        {donation.ai_match_reason && (
                          <div className="p-3 rounded-lg bg-secondary/30 border border-secondary/50 mb-3">
                            <p className="text-sm text-secondary-foreground">
                              <span className="font-medium">AI Recommendation:</span> {donation.ai_match_reason}
                            </p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>
                            Donated on {format(new Date(donation.created_at), 'MMM d, yyyy')}
                          </span>
                          {donation.match_score && (
                            <span className="text-primary font-medium">
                              {Math.round(donation.match_score)}% match
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
