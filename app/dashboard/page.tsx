'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, MessageCircle, PawPrint, Star, TrendingUp, Users } from 'lucide-react';
import { database } from '@/lib/database';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    activeBookings: 0,
    petsCount: 0,
    unreadMessages: 0,
    averageRating: null as number | null,
    pendingRequests: 0,
    upcomingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      const newStats = {
        activeBookings: 0,
        petsCount: 0,
        unreadMessages: 0,
        averageRating: null as number | null,
        pendingRequests: 0,
        upcomingBookings: 0,
      };

      // Fetch active bookings (confirmed or in_progress)
      const activeStatuses = ['confirmed', 'in_progress'];
      
      if (profile.is_owner && profile.is_host) {
        // If both, count bookings where user is either owner or host
        const [ownerBookings, hostBookings] = await Promise.all([
          database
            .from('bookings')
            .select('id')
            .in('status', activeStatuses)
            .eq('owner_id', profile.id),
          database
            .from('bookings')
            .select('id')
            .in('status', activeStatuses)
            .eq('host_id', profile.id),
        ]);
        const uniqueBookings = new Set([
          ...(ownerBookings.data?.map(b => b.id) || []),
          ...(hostBookings.data?.map(b => b.id) || []),
        ]);
        newStats.activeBookings = uniqueBookings.size;
      } else if (profile.is_owner) {
        const { data } = await database
          .from('bookings')
          .select('id')
          .in('status', activeStatuses)
          .eq('owner_id', profile.id);
        newStats.activeBookings = data?.length || 0;
      } else if (profile.is_host) {
        const { data } = await database
          .from('bookings')
          .select('id')
          .in('status', activeStatuses)
          .eq('host_id', profile.id);
        newStats.activeBookings = data?.length || 0;
      }

      // Fetch pets count (only for owners)
      if (profile.is_owner) {
        const { data, error } = await database
          .from('pets')
          .select('id')
          .eq('owner_id', profile.id);

        if (!error) {
          newStats.petsCount = data?.length || 0;
        }
      }

      // Fetch unread messages
      const { data: messages, error: messagesError } = await database
        .from('messages')
        .select('id')
        .eq('receiver_id', profile.id)
        .is('read_at', null);

      if (!messagesError) {
        newStats.unreadMessages = messages?.length || 0;
      }

      // Fetch average rating (only for hosts)
      if (profile.is_host) {
        const { data: reviews, error: reviewsError } = await database
          .from('reviews')
          .select('rating')
          .eq('reviewee_id', profile.id);

        if (!reviewsError && reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          newStats.averageRating = Number((totalRating / reviews.length).toFixed(1));
        }
      }

      // Fetch pending requests and upcoming bookings (only for hosts)
      if (profile.is_host) {
        // Pending requests (status = 'requested')
        const { data: pending, error: pendingError } = await database
          .from('bookings')
          .select('id')
          .eq('host_id', profile.id)
          .eq('status', 'requested');

        if (!pendingError) {
          newStats.pendingRequests = pending?.length || 0;
        }

        // Upcoming bookings (confirmed or accepted, check_in_date in future)
        const today = new Date().toISOString().split('T')[0];
        const { data: upcoming, error: upcomingError } = await database
          .from('bookings')
          .select('id')
          .eq('host_id', profile.id)
          .in('status', ['accepted', 'confirmed'])
          .gte('check_in_date', today);

        if (!upcomingError) {
          newStats.upcomingBookings = upcoming?.length || 0;
        }
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.is_owner, profile?.is_host]);

  useEffect(() => {
    if (profile?.id) {
      fetchDashboardStats();
    }
  }, [profile?.id, fetchDashboardStats]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {profile?.active_role === 'owner' && "Manage your pets and find trusted hosts"}
            {profile?.active_role === 'host' && "View your bookings and manage availability"}
            {profile?.active_role === 'both' && "Manage your pets, bookings, and hosting"}
          </p>
        </div>

        {!profile?.profile_photo && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a profile photo to build trust with the community
                  </p>
                </div>
                <Link href="/profile">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold">...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeBookings}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeBookings === 0 ? 'No active bookings' : `${stats.activeBookings} active ${stats.activeBookings === 1 ? 'booking' : 'bookings'}`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {profile?.is_owner && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Pets</CardTitle>
                <PawPrint className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-2xl font-bold">...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stats.petsCount}</div>
                    {stats.petsCount === 0 ? (
                      <Link href="/pets">
                        <Button variant="link" className="text-orange-500 px-0 mt-1">
                          Add your first pet
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/pets">
                        <Button variant="link" className="text-orange-500 px-0 mt-1">
                          View all pets
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-2xl font-bold">...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.unreadMessages === 0 ? 'All caught up!' : `${stats.unreadMessages} unread ${stats.unreadMessages === 1 ? 'message' : 'messages'}`}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {profile?.is_host && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-2xl font-bold">...</div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.averageRating !== null ? stats.averageRating : '--'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.averageRating !== null ? 'Based on reviews' : 'No reviews yet'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {profile?.is_owner && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with PetXfamily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/pets">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <PawPrint className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Add Your Pets</p>
                        <p className="text-sm text-gray-500">
                          Create profiles for your furry friends
                        </p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/hosts">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">Find a Host</p>
                        <p className="text-sm text-gray-500">
                          Browse verified hosts in your area
                        </p>
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {profile?.is_host && (
          <Card>
            <CardHeader>
              <CardTitle>Host Dashboard</CardTitle>
              <CardDescription>Manage your hosting activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Pending Requests</p>
                    <p className="text-sm text-gray-500">
                      {loading ? 'Loading...' : `${stats.pendingRequests} ${stats.pendingRequests === 1 ? 'request' : 'requests'} awaiting response`}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {loading ? '...' : stats.pendingRequests}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Upcoming Bookings</p>
                    <p className="text-sm text-gray-500">
                      {loading ? 'Loading...' : stats.upcomingBookings === 0 ? 'No upcoming bookings' : 'Pets arriving soon'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {loading ? '...' : stats.upcomingBookings}
                  </Badge>
                </div>

                <Link href="/availability">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">
                    Manage Availability
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {!profile?.is_host && profile?.is_owner && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Become a Pet Host
                </h3>
                <p className="text-gray-600 mb-4">
                  Share your love for pets and earn by hosting pets in your home
                </p>
                <Link href="/profile">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    Enable Host Mode
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
