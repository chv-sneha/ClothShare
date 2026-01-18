import { useState } from 'react';
import { Plus, Trash2, Shirt, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClothingItem, Gender, Season, Condition } from '@/types/donation';
import { clothingTypes } from '@/data/donationCenters';

interface ClothingFormProps {
  onSubmit: (items: ClothingItem[]) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const emptyItem: Omit<ClothingItem, 'id'> = {
  gender: 'men',
  type: 't-shirt',
  season: 'all-season',
  quantity: 1,
  condition: 'good',
};

export function ClothingForm({ onSubmit }: ClothingFormProps) {
  const [items, setItems] = useState<ClothingItem[]>([
    { ...emptyItem, id: generateId() },
  ]);

  const addItem = () => {
    setItems([...items, { ...emptyItem, id: generateId() }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ClothingItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(items);
  };

  return (
    <section id="donate-form" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
              <Shirt className="w-4 h-4 text-secondary-foreground" />
              <span className="text-sm font-medium text-secondary-foreground">Step 1</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What Would You Like to Donate?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Add details about each clothing item. The more accurate the information, 
              the better we can match your donation.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {items.map((item, index) => (
                <Card key={item.id} className="shadow-card border-0 animate-scale-in overflow-hidden">
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
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Gender */}
                      <div className="space-y-2">
                        <Label htmlFor={`gender-${item.id}`} className="text-sm font-medium">
                          For Whom
                        </Label>
                        <Select
                          value={item.gender}
                          onValueChange={(value: Gender) => updateItem(item.id, 'gender', value)}
                        >
                          <SelectTrigger id={`gender-${item.id}`} className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="children">Children</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Type */}
                      <div className="space-y-2">
                        <Label htmlFor={`type-${item.id}`} className="text-sm font-medium">
                          Clothing Type
                        </Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => updateItem(item.id, 'type', value)}
                        >
                          <SelectTrigger id={`type-${item.id}`} className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {clothingTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Season */}
                      <div className="space-y-2">
                        <Label htmlFor={`season-${item.id}`} className="text-sm font-medium">
                          Season
                        </Label>
                        <Select
                          value={item.season}
                          onValueChange={(value: Season) => updateItem(item.id, 'season', value)}
                        >
                          <SelectTrigger id={`season-${item.id}`} className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="summer">Summer</SelectItem>
                            <SelectItem value="winter">Winter</SelectItem>
                            <SelectItem value="all-season">All Season</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quantity */}
                      <div className="space-y-2">
                        <Label htmlFor={`quantity-${item.id}`} className="text-sm font-medium">
                          Quantity
                        </Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="number"
                          min={1}
                          max={50}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="h-12"
                        />
                      </div>

                      {/* Condition */}
                      <div className="space-y-2 md:col-span-2 lg:col-span-2">
                        <Label htmlFor={`condition-${item.id}`} className="text-sm font-medium">
                          Condition
                        </Label>
                        <Select
                          value={item.condition}
                          onValueChange={(value: Condition) => updateItem(item.id, 'condition', value)}
                        >
                          <SelectTrigger id={`condition-${item.id}`} className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New (with tags)</SelectItem>
                            <SelectItem value="like-new">Like New (worn 1-2 times)</SelectItem>
                            <SelectItem value="good">Good (gently used)</SelectItem>
                            <SelectItem value="fair">Fair (visible wear but usable)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add more button */}
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Item
              </Button>
            </div>

            {/* Submit button */}
            <div className="mt-10 flex justify-center">
              <Button 
                type="submit" 
                size="lg"
                className="gradient-warm text-primary-foreground px-12 py-6 text-lg font-semibold shadow-elevated hover:shadow-card transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Find Best Match
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
