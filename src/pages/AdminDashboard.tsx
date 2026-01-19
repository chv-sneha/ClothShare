import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, Truck, Package, Phone, MapPin, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AdminDonation {
  id: string;
  clothes_type: string;
  gender: string;
  quantity: number;
  condition: string;
  status: string;
  location: string;
  notes: string;
  images: string[];
  created_at: string;
  pickup_date: string;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const statusOptions = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'matched', label: 'Matched' },
  { value: 'pickup_scheduled', label: 'Pickup Scheduled' },
  { value: 'picked', label: 'Picked Up' },
  { value: 'delivered', label: 'Delivered' },
];

export function AdminDashboard() {
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user, selectedStatus]);

  const fetchDonations = async () => {
    try {
      let query = supabase
        .from('donations')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDonations(data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  const updateDonationStatus = async (donationId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'pickup_scheduled') {
        updateData.pickup_date = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updateData.delivered_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('donations')
        .update(updateData)
        .eq('id', donationId);

      if (error) throw error;

      toast.success('Status updated successfully');
      fetchDonations();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading donations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage incoming donations</p>
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Donations</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {donations.filter(d => d.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-muted-foreground">New Submissions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {donations.filter(d => d.status === 'pickup_scheduled').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Scheduled Pickups</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {donations.filter(d => d.status === 'picked').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Transit</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {donations.filter(d => d.status === 'delivered').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Delivered</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <div className="space-y-4">
          {donations.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No donations found</h3>
                <p className="text-muted-foreground">
                  {selectedStatus === 'all' ? 'No donations yet' : `No donations with status: ${selectedStatus}`}
                </p>
              </CardContent>
            </Card>
          ) : (
            donations.map((donation) => (
              <Card key={donation.id} className="shadow-card">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {donation.quantity}x {donation.clothes_type} ({donation.gender})
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        From: {donation.profiles?.full_name || donation.profiles?.email || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(donation.status)} text-white`}>
                      {donation.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
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
                    
                    <div className="space-y-2">
                      {donation.images && donation.images.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Images:</span> {donation.images.length} uploaded
                        </div>
                      )}
                      {donation.pickup_date && (
                        <div className="text-sm">
                          <span className="font-medium">Pickup:</span> {new Date(donation.pickup_date).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={donation.status}
                      onValueChange={(value) => updateDonationStatus(donation.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Donor
                    </Button>
                    
                    {donation.images && donation.images.length > 0 && (
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Images
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}