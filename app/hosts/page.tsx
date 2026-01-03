'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Search, MapPin, Star, Home, PawPrint, Calendar } from 'lucide-react';
import { supabase, Profile, Pet } from '@/lib/supabase';

export default function HostsPage() {
  return (
    <ProtectedRoute>
      <HostsContent />
    </ProtectedRoute>
  );
}

function HostsContent() {
  const { profile } = useAuth();
  const router = useRouter();
  const [hosts, setHosts] = useState<Profile[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHasPets, setFilterHasPets] = useState('all');
  const [filterDistance, setFilterDistance] = useState('all');
  const [selectedHost, setSelectedHost] = useState<Profile | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookingData, setBookingData] = useState({
    petIds: [] as string[],
    checkInDate: '',
    checkOutDate: '',
    dropOffTime: '09:00',
    pickUpTime: '18:00',
    specialInstructions: '',
    emergencyPermission: false,
  });

  useEffect(() => {
    if (profile?.id) {
      fetchHosts();
    }
    fetchPets();
  }, [profile?.id]);

  useEffect(() => {
    filterHosts();
  }, [hosts, searchQuery, filterHasPets, filterDistance]);

  const fetchHosts = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_host', true)
        .neq('id', profile?.id);

      if (error) throw error;
      setHosts(data || []);
      setFilteredHosts(data || []);
    } catch (error) {
      toast.error('Failed to load hosts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', profile!.id);

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Failed to load pets');
    }
  };

  const filterHosts = () => {
    let filtered = hosts;

    if (searchQuery) {
      filtered = filtered.filter(
        (host) =>
          host.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          host.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          `${host.first_name} ${host.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterHasPets !== 'all') {
      filtered = filtered.filter((host) =>
        filterHasPets === 'yes' ? host.has_own_pets : !host.has_own_pets
      );
    }

    // Distance/Location filter
    if (filterDistance !== 'all' && profile) {
      filtered = filtered.filter((host) => {
        if (filterDistance === 'same_area') {
          return host.city === profile.city && host.area === profile.area;
        } else if (filterDistance === 'same_city') {
          return host.city === profile.city;
        }
        return true;
      });
    }

    setFilteredHosts(filtered);
  };

  const handleBookingRequest = (host: Profile) => {
    if (pets.length === 0) {
      toast.error('Please add at least one pet before booking');
      router.push('/pets');
      return;
    }

    setSelectedHost(host);
    setShowBookingDialog(true);
  };

  const submitBooking = async () => {
    if (bookingData.petIds.length === 0) {
      toast.error('Please select at least one pet');
      return;
    }

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const bookingNumber = `BK${Date.now()}`;

      const { error } = await supabase.from('bookings').insert({
        booking_number: bookingNumber,
        owner_id: profile!.id,
        host_id: selectedHost!.id,
        pet_ids: bookingData.petIds,
        check_in_date: bookingData.checkInDate,
        check_out_date: bookingData.checkOutDate,
        drop_off_time: bookingData.dropOffTime,
        pick_up_time: bookingData.pickUpTime,
        special_instructions: bookingData.specialInstructions,
        emergency_permission: bookingData.emergencyPermission,
        status: 'requested',
      });

      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: selectedHost!.id,
        type: 'new_request',
        title: 'New Booking Request',
        message: `${profile?.first_name} ${profile?.last_name} has sent you a booking request`,
      });

      toast.success('Booking request sent successfully!');
      setShowBookingDialog(false);
      router.push('/bookings');
    } catch (error) {
      toast.error('Failed to send booking request');
    }
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Pet Hosts</h1>
          <p className="text-gray-600 mt-2">Browse verified hosts in your area</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by location or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterHasPets} onValueChange={setFilterHasPets}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Has Pets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hosts</SelectItem>
                  <SelectItem value="yes">Has Pets</SelectItem>
                  <SelectItem value="no">No Pets</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDistance} onValueChange={setFilterDistance}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="same_city">Same City</SelectItem>
                  <SelectItem value="same_area">Same Area</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredHosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No hosts found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <Card 
                key={host.id} 
                className="hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/profile/${host.id}`)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={host.profile_photo || ''} />
                      <AvatarFallback>
                        {host.first_name?.[0]}{host.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {host.first_name} {host.last_name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {host.area}, {host.city}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{host.pet_experience_years || 0} years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Home Type:</span>
                      <span className="font-medium capitalize">{host.home_type || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Pets:</span>
                      <span className="font-medium">{host.max_pets_can_host}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {host.has_own_pets && (
                      <Badge variant="secondary">
                        <PawPrint className="w-3 h-3 mr-1" />
                        Has Pets
                      </Badge>
                    )}
                    {host.has_open_space && (
                      <Badge variant="secondary">
                        <Home className="w-3 h-3 mr-1" />
                        Open Space
                      </Badge>
                    )}
                    {host.provides_daily_updates && (
                      <Badge variant="secondary">Daily Updates</Badge>
                    )}
                  </div>

                  {host.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{host.bio}</p>
                  )}

                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookingRequest(host);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Request Booking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Booking</DialogTitle>
              <DialogDescription>
                Send a booking request to {selectedHost?.first_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Pet(s) *</Label>
                <div className="space-y-2">
                  {pets.map((pet) => (
                    <label key={pet.id} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={bookingData.petIds.includes(pet.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBookingData({
                              ...bookingData,
                              petIds: [...bookingData.petIds, pet.id],
                            });
                          } else {
                            setBookingData({
                              ...bookingData,
                              petIds: bookingData.petIds.filter((id) => id !== pet.id),
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <PawPrint className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{pet.name}</span>
                      <span className="text-sm text-gray-500">({pet.species})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInDate">Check-in Date *</Label>
                  <Input
                    id="checkInDate"
                    type="date"
                    value={bookingData.checkInDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, checkInDate: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutDate">Check-out Date *</Label>
                  <Input
                    id="checkOutDate"
                    type="date"
                    value={bookingData.checkOutDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, checkOutDate: e.target.value })
                    }
                    min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dropOffTime">Drop-off Time</Label>
                  <Input
                    id="dropOffTime"
                    type="time"
                    value={bookingData.dropOffTime}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, dropOffTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickUpTime">Pick-up Time</Label>
                  <Input
                    id="pickUpTime"
                    type="time"
                    value={bookingData.pickUpTime}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, pickUpTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Input
                  id="specialInstructions"
                  value={bookingData.specialInstructions}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, specialInstructions: e.target.value })
                  }
                  placeholder="Any special requests or instructions..."
                />
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={bookingData.emergencyPermission}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, emergencyPermission: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm">
                  I give permission for emergency veterinary care if needed
                </span>
              </label>

              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={submitBooking}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Send Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBookingDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
