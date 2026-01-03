/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { database, HostAvailability } from '@/lib/database';

export default function AvailabilityPage() {
  return (
    <ProtectedRoute>
      <AvailabilityContent />
    </ProtectedRoute>
  );
}

function AvailabilityContent() {
  const { profile } = useAuth();
  const [availabilities, setAvailabilities] = useState<HostAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    availableFrom: '',
    availableTo: '',
    maxPets: 1,
  });

  useEffect(() => {
    if (profile?.is_host) {
      fetchAvailabilities();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const fetchAvailabilities = async () => {
    try {
      const { data, error } = await database
        .from('host_availability')
        .select('*')
        .eq('host_id', profile!.id)
        .order('available_from', { ascending: true });

      if (error) throw error;
      setAvailabilities(data || []);
    } catch (error) {
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.availableFrom || !formData.availableTo) {
      toast.error('Please fill in all fields');
      return;
    }

    if (new Date(formData.availableFrom) > new Date(formData.availableTo)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const { error } = await database.from('host_availability').insert({
        host_id: profile!.id,
        available_from: formData.availableFrom,
        available_to: formData.availableTo,
        max_pets: formData.maxPets,
      });

      if (error) throw error;
      toast.success('Availability added successfully');
      setShowDialog(false);
      setFormData({ availableFrom: '', availableTo: '', maxPets: 1 });
      fetchAvailabilities();
    } catch (error) {
      toast.error('Failed to add availability');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this availability?')) return;

    try {
      const { error } = await database
        .from('host_availability')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Availability removed');
      fetchAvailabilities();
    } catch (error) {
      toast.error('Failed to remove availability');
    }
  };

  if (!profile?.is_host) {
    return (
      <DashboardLayout>
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Host Mode Required</h2>
          <p className="text-gray-600">Enable host mode in your profile to manage availability</p>
        </Card>
      </DashboardLayout>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">My Availability</h1>
            <p className="text-gray-600 mt-2">Manage when you're available to host pets</p>
          </div>
          <Button onClick={() => setShowDialog(true)} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Availability
          </Button>
        </div>

        {availabilities.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-12 pb-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No availability set</h3>
              <p className="text-gray-600 mb-6">Add your available dates to start receiving booking requests</p>
              <Button onClick={() => setShowDialog(true)} className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Availability
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilities.map((availability) => (
              <Card key={availability.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Available Period</p>
                      <p className="font-semibold">
                        {new Date(availability.available_from).toLocaleDateString()} -{' '}
                        {new Date(availability.available_to).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Max {availability.max_pets} pet{availability.max_pets !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(availability.id)}
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

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>Set the dates when you're available to host pets</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From *</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableTo">Available To *</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                  min={formData.availableFrom || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPets">Maximum Pets During This Period *</Label>
                <Input
                  id="maxPets"
                  type="number"
                  min="1"
                  value={formData.maxPets}
                  onChange={(e) => setFormData({ ...formData, maxPets: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Add Availability
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
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
