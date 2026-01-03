'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Calendar, MapPin, PawPrint, MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase, Booking, Profile, Pet } from '@/lib/supabase';

type BookingWithDetails = Booking & {
  owner?: Profile;
  host?: Profile;
  pets?: Pet[];
};

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}

function BookingsContent() {
  const { profile } = useAuth();
  const router = useRouter();
  const [ownerBookings, setOwnerBookings] = useState<BookingWithDetails[]>([]);
  const [hostBookings, setHostBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [profile]);

  const fetchBookings = async () => {
    try {
      const [ownerData, hostData] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, host:host_id(*)').eq('owner_id', profile!.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('bookings')
          .select('*, owner:owner_id(*)')
          .eq('host_id', profile!.id)
          .order('created_at', { ascending: false }),
      ]);

      if (ownerData.data) {
        const bookingsWithPets = await Promise.all(
          ownerData.data.map(async (booking: any) => {
            const { data: pets } = await supabase
              .from('pets')
              .select('*')
              .in('id', booking.pet_ids);

            return {
              ...booking,
              host: booking.host,
              pets: pets || [],
            };
          })
        );
        setOwnerBookings(bookingsWithPets);
      }

      if (hostData.data) {
        const bookingsWithPets = await Promise.all(
          hostData.data.map(async (booking: any) => {
            const { data: pets } = await supabase
              .from('pets')
              .select('*')
              .in('id', booking.pet_ids);

            return {
              ...booking,
              owner: booking.owner,
              pets: pets || [],
            };
          })
        );
        setHostBookings(bookingsWithPets);
      }
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (booking: BookingWithDetails, action: 'accept' | 'reject') => {
    setSelectedBooking(booking);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedBooking || !actionType) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const updates: any = {
        status: actionType === 'accept' ? 'accepted' : 'cancelled',
      };

      if (actionType === 'reject') {
        updates.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', selectedBooking.id);

      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: selectedBooking.owner_id,
        type: actionType === 'accept' ? 'request_accepted' : 'request_rejected',
        title: actionType === 'accept' ? 'Booking Accepted' : 'Booking Rejected',
        message: actionType === 'accept'
          ? `${profile?.first_name} has accepted your booking request`
          : `${profile?.first_name} has rejected your booking request`,
        booking_id: selectedBooking.id,
      });

      toast.success(actionType === 'accept' ? 'Booking accepted!' : 'Booking rejected');
      setShowActionDialog(false);
      setRejectionReason('');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, field?: string) => {
    try {
      const updates: any = { status };
      if (field) {
        updates[field] = true;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId);

      if (error) throw error;
      toast.success('Status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const BookingCard = ({ booking, isHost }: { booking: BookingWithDetails; isHost: boolean }) => {
    const otherUser = isHost ? booking.owner : booking.host;

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Booking #{booking.booking_number}</p>
              <h3 className="font-semibold text-lg">
                {isHost ? 'Hosting for' : 'Hosted by'} {otherUser?.first_name} {otherUser?.last_name}
              </h3>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span>{otherUser?.area}, {otherUser?.city}</span>
            </div>
            <div className="flex items-center text-sm">
              <PawPrint className="w-4 h-4 mr-2 text-gray-400" />
              <span>{booking.pets?.map(p => p.name).join(', ')}</span>
            </div>
          </div>

          {booking.status === 'requested' && isHost && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => handleAction(booking, 'accept')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-red-500"
                onClick={() => handleAction(booking, 'reject')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          )}

          {booking.status === 'accepted' && !isHost && (
            <Button
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
            >
              Confirm Booking
            </Button>
          )}

          {booking.status === 'confirmed' && (
            <div className="space-y-2">
              {!booking.owner_confirmed_dropoff && !isHost && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => updateBookingStatus(booking.id, 'in_progress', 'owner_confirmed_dropoff')}
                >
                  Confirm Drop-off
                </Button>
              )}
              {!booking.host_confirmed_receiving && isHost && booking.owner_confirmed_dropoff && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => updateBookingStatus(booking.id, 'in_progress', 'host_confirmed_receiving')}
                >
                  Confirm Receiving Pet
                </Button>
              )}
            </div>
          )}

          {booking.status === 'in_progress' && (
            <div className="space-y-2">
              {!booking.host_confirmed_completion && isHost && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => updateBookingStatus(booking.id, 'in_progress', 'host_confirmed_completion')}
                >
                  Confirm Completion
                </Button>
              )}
              {!booking.owner_confirmed_pickup && !isHost && booking.host_confirmed_completion && (
                <Button
                  size="sm"
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => updateBookingStatus(booking.id, 'completed', 'owner_confirmed_pickup')}
                >
                  Confirm Pickup
                </Button>
              )}
            </div>
          )}

          {booking.status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/bookings/${booking.id}/review`)}
            >
              Leave a Review
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={() => router.push(`/messages?booking=${booking.id}`)}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Message
          </Button>

          {booking.status === 'cancelled' && booking.rejection_reason && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Reason:</strong> {booking.rejection_reason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your pet stays and hosting</p>
        </div>

        <Tabs defaultValue="owner" className="space-y-4">
          <TabsList>
            {profile?.is_owner && <TabsTrigger value="owner">As Pet Owner</TabsTrigger>}
            {profile?.is_host && <TabsTrigger value="host">As Host</TabsTrigger>}
          </TabsList>

          {profile?.is_owner && (
            <TabsContent value="owner" className="space-y-4">
              {ownerBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start by finding a host for your pets</p>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => router.push('/hosts')}
                    >
                      Find Hosts
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {ownerBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isHost={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {profile?.is_host && (
            <TabsContent value="host" className="space-y-4">
              {hostBookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">Waiting for booking requests...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {hostBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isHost={true} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'accept' ? 'Accept Booking' : 'Reject Booking'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'accept'
                  ? 'Confirm that you want to accept this booking request'
                  : 'Please provide a reason for rejecting this booking'}
              </DialogDescription>
            </DialogHeader>

            {actionType === 'reject' && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Already booked for these dates"
                  rows={4}
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={confirmAction}
                className={`flex-1 ${actionType === 'accept' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {actionType === 'accept' ? 'Accept Booking' : 'Reject Booking'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowActionDialog(false);
                  setRejectionReason('');
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
