import { useState } from 'react';
import { Plus, Trash2, Shirt, Sparkles, MapPin, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLocation } from '@/hooks/useLocation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DonationFormData {
  id: string;
  clothesType: string;
  gender: string;
  season: string;
  quantity: number;
  condition: string;
  pickupOrDrop: 'pickup' | 'drop';
  location: string;
  images: string[];
  notes: string;
}

interface EnhancedClothingFormProps {
  onSubmit: (data: DonationFormData[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const emptyItem: Omit<DonationFormData, 'id'> = {
  clothesType: 't-shirt',
  gender: 'men',
  season: 'all-season',
  quantity: 1,
  condition: 'good',
  pickupOrDrop: 'pickup',
  location: '',
  images: [],
  notes: '',
};

export function EnhancedClothingForm({ onSubmit }: EnhancedClothingFormProps) {
  const [items, setItems] = useState<DonationFormData[]>([
    { ...emptyItem, id: generateId() },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const addItem = () => {
    setItems([...items, { ...emptyItem, id: generateId() }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof DonationFormData, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleImageUpload = async (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const imageUrls: string[] = [];
    const maxFiles = Math.min(files.length, 5);
    
    for (let i = 0; i < maxFiles; i++) {
      const file = files[i];
      
      try {
        const reader = new FileReader();
        reader.onload = () => {
          imageUrls.push(reader.result as string);
          if (imageUrls.length === maxFiles) {
            updateItem(id, 'images', imageUrls);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to submit donation');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Just call onSubmit with the items - no database save here
      toast.success('Donation submitted successfully!');
      onSubmit(items);
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast.error('Failed to submit donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="donate-form" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
              <Shirt className="w-4 h-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Donate Clothes</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What Would You Like to Donate?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill in the details below. Our AI will find the best donation centers for your items.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {items.map((item, index) => (
                <Card key={item.id} className="shadow-card border-0">
                  <CardHeader className="bg-muted/50 pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        Clothing Item
                      </CardTitle>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Clothes Type</Label>
                        <Select value={item.clothesType} onValueChange={(value) => updateItem(item.id, 'clothesType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="t-shirt">T-Shirt</SelectItem>
                            <SelectItem value="shirt">Shirt</SelectItem>
                            <SelectItem value="pants">Pants</SelectItem>
                            <SelectItem value="dress">Dress</SelectItem>
                            <SelectItem value="jacket">Jacket</SelectItem>
                            <SelectItem value="sweater">Sweater</SelectItem>
                            <SelectItem value="shoes">Shoes</SelectItem>
                            <SelectItem value="uniform">Uniform</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={item.gender} onValueChange={(value) => updateItem(item.id, 'gender', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="children">Kids</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Season</Label>
                        <Select value={item.season} onValueChange={(value) => updateItem(item.id, 'season', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summer">Summer</SelectItem>
                            <SelectItem value="winter">Winter</SelectItem>
                            <SelectItem value="all-season">All Season</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Quantity and Condition */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min={1}
                          max={50}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select value={item.condition} onValueChange={(value) => updateItem(item.id, 'condition', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Pickup or Drop */}
                    <div className="space-y-3">
                      <Label>Pickup or Drop</Label>
                      <RadioGroup
                        value={item.pickupOrDrop}
                        onValueChange={(value: 'pickup' | 'drop') => updateItem(item.id, 'pickupOrDrop', value)}
                        className="flex gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id={`pickup-${item.id}`} />
                          <Label htmlFor={`pickup-${item.id}`}>Pickup from my location</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="drop" id={`drop-${item.id}`} />
                          <Label htmlFor={`drop-${item.id}`}>I'll drop off</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder={location.address || "Enter your location"}
                          value={item.location}
                          onChange={(e) => updateItem(item.id, 'location', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                      <Label>Images (Optional - Max 5)</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(item.id, e.target.files)}
                          className="hidden"
                          id={`images-${item.id}`}
                        />
                        <label htmlFor={`images-${item.id}`} className="cursor-pointer flex flex-col items-center gap-2">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Click to upload up to 5 images</span>
                          <span className="text-xs text-muted-foreground">JPG, PNG, GIF up to 10MB each</span>
                        </label>
                        {item.images.length > 0 && (
                          <div className="mt-3">
                            <div className="text-sm text-green-600 mb-2">
                              {item.images.length} image(s) uploaded
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {item.images.slice(0, 3).map((img, idx) => (
                                <img key={idx} src={img} alt={`Upload ${idx + 1}`} className="w-full h-16 object-cover rounded" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label>Notes (Optional)</Label>
                      <Textarea
                        placeholder="e.g., Includes blankets, winter wear, etc."
                        value={item.notes}
                        onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="border-dashed border-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Item
              </Button>
            </div>

            <div className="mt-10 flex justify-center">
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="gradient-warm text-primary-foreground px-12 py-6 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Find Best Match with AI'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}