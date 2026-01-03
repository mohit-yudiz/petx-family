'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, PawPrint } from 'lucide-react';
import { database, Pet } from '@/lib/database';

export default function PetsPage() {
  return (
    <ProtectedRoute>
      <PetsContent />
    </ProtectedRoute>
  );
}

function PetsContent() {
  const { profile } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState<Partial<Pet>>({
    name: '',
    species: '',
    breed: '',
    age_years: 0,
    age_months: 0,
    gender: '',
    weight_kg: 0,
    is_vaccinated: false,
    is_neutered: false,
    friendly_with_pets: true,
    friendly_with_humans: true,
    food_type: '',
    feeding_schedule: '',
    walking_schedule: '',
  });

  useEffect(() => {
    if (profile?.id) {
      fetchPets();
    }
  }, [profile]);

  const fetchPets = async () => {
    try {
      const { data, error } = await database
        .from('pets')
        .select('*')
        .eq('owner_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      toast.error('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.species) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      if (editingPet) {
        const { error } = await database
          .from('pets')
          .update(formData)
          .eq('id', editingPet.id);

        if (error) throw error;
        toast.success('Pet updated successfully');
      } else {
        const { error } = await database
          .from('pets')
          .insert({ ...formData, owner_id: profile!.id });

        if (error) throw error;
        toast.success('Pet added successfully');
      }

      fetchPets();
      closeDialog();
    } catch (error) {
      toast.error('Failed to save pet');
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet?')) return;

    try {
      const { error } = await database
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;
      toast.success('Pet deleted successfully');
      fetchPets();
    } catch (error) {
      toast.error('Failed to delete pet');
    }
  };

  const openDialog = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet);
      setFormData(pet);
    } else {
      setEditingPet(null);
      setFormData({
        name: '',
        species: '',
        breed: '',
        age_years: 0,
        age_months: 0,
        gender: '',
        weight_kg: 0,
        is_vaccinated: false,
        is_neutered: false,
        friendly_with_pets: true,
        friendly_with_humans: true,
        food_type: '',
        feeding_schedule: '',
        walking_schedule: '',
      });
    }
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingPet(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
            <p className="text-gray-600 mt-2">Manage your pet profiles</p>
          </div>
          <Button onClick={() => openDialog()} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <PawPrint className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pets added yet</h3>
              <p className="text-gray-600 mb-6">Add your first pet to start finding hosts</p>
              <Button onClick={() => openDialog()} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Pet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <PawPrint className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{pet.name}</h3>
                        <p className="text-sm text-gray-500">{pet.species} {pet.breed && `• ${pet.breed}`}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">
                        {pet.age_years}y {pet.age_months}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{pet.weight_kg} kg</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">{pet.gender}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pet.is_vaccinated && <Badge variant="secondary">Vaccinated</Badge>}
                    {pet.is_neutered && <Badge variant="secondary">Neutered</Badge>}
                    {pet.friendly_with_pets && <Badge variant="secondary">Pet Friendly</Badge>}
                    {pet.friendly_with_humans && <Badge variant="secondary">People Friendly</Badge>}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openDialog(pet)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pet.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showDialog} onOpenChange={closeDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
              <DialogDescription>
                {editingPet ? 'Update your pet information' : 'Add your pet details'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value) => setFormData({ ...formData, species: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Rabbit">Rabbit</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={formData.breed || ''}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender || ''}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age_years">Age (Years)</Label>
                  <Input
                    id="age_years"
                    type="number"
                    min="0"
                    value={formData.age_years || 0}
                    onChange={(e) => setFormData({ ...formData, age_years: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age_months">Age (Months)</Label>
                  <Input
                    id="age_months"
                    type="number"
                    min="0"
                    max="11"
                    value={formData.age_months || 0}
                    onChange={(e) => setFormData({ ...formData, age_months: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.weight_kg || 0}
                    onChange={(e) => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="is_vaccinated">Vaccinated</Label>
                  <Switch
                    id="is_vaccinated"
                    checked={formData.is_vaccinated}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_vaccinated: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="is_neutered">Neutered/Spayed</Label>
                  <Switch
                    id="is_neutered"
                    checked={formData.is_neutered}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_neutered: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="friendly_with_pets">Friendly with other pets</Label>
                  <Switch
                    id="friendly_with_pets"
                    checked={formData.friendly_with_pets}
                    onCheckedChange={(checked) => setFormData({ ...formData, friendly_with_pets: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="friendly_with_humans">Friendly with humans</Label>
                  <Switch
                    id="friendly_with_humans"
                    checked={formData.friendly_with_humans}
                    onCheckedChange={(checked) => setFormData({ ...formData, friendly_with_humans: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical_conditions">Medical Conditions</Label>
                <Textarea
                  id="medical_conditions"
                  value={formData.medical_conditions || ''}
                  onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                  placeholder="Any medical conditions or allergies..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicines">Medicines</Label>
                <Textarea
                  id="medicines"
                  value={formData.medicines || ''}
                  onChange={(e) => setFormData({ ...formData, medicines: e.target.value })}
                  placeholder="List any medications and dosage..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="food_type">Food Type</Label>
                <Input
                  id="food_type"
                  value={formData.food_type || ''}
                  onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                  placeholder="e.g., Dry kibble, Wet food, Home-cooked"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feeding_schedule">Feeding Schedule</Label>
                <Textarea
                  id="feeding_schedule"
                  value={formData.feeding_schedule || ''}
                  onChange={(e) => setFormData({ ...formData, feeding_schedule: e.target.value })}
                  placeholder="e.g., Morning 8AM - 1 cup, Evening 6PM - 1 cup"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="walking_schedule">Walking Schedule</Label>
                <Textarea
                  id="walking_schedule"
                  value={formData.walking_schedule || ''}
                  onChange={(e) => setFormData({ ...formData, walking_schedule: e.target.value })}
                  placeholder="e.g., Morning 7AM - 30 mins, Evening 7PM - 30 mins"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_instructions">Special Instructions</Label>
                <Textarea
                  id="special_instructions"
                  value={formData.special_instructions || ''}
                  onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                  placeholder="Any other important information for the host..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                  {editingPet ? 'Update Pet' : 'Add Pet'}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
