'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, MessageCircle, PawPrint, Star, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { profile } = useAuth();

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
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">No active bookings</p>
            </CardContent>
          </Card>

          {profile?.is_owner && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Pets</CardTitle>
                <PawPrint className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <Link href="/pets">
                  <Button variant="link" className="text-orange-500 px-0 mt-1">
                    Add your first pet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageCircle className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">All caught up!</p>
            </CardContent>
          </Card>

          {profile?.is_host && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="w-4 h-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-gray-500 mt-1">No reviews yet</p>
              </CardContent>
            </Card>
          )}
        </div>

        {profile?.is_owner && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with PetStay</CardDescription>
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
                    <p className="text-sm text-gray-500">0 requests awaiting response</p>
                  </div>
                  <Badge variant="secondary">0</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Upcoming Bookings</p>
                    <p className="text-sm text-gray-500">Pets arriving soon</p>
                  </div>
                  <Badge variant="secondary">0</Badge>
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
