/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Star, TrendingUp, Award, MessageSquare, Mail, Phone, Home, PawPrint, Globe, Users } from 'lucide-react';
import { supabase, Profile } from '@/lib/supabase';

type ReviewWithUser = {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  reviewer?: Profile;
};

type RatingStats = {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export default function ReviewsPage() {
  return (
    <ProtectedRoute>
      <ReviewsContent />
    </ProtectedRoute>
  );
}

function ReviewsContent() {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const fetchReviews = async () => {
    try {
      // Fetch all reviews where the current user is the reviewee
      const { data, error } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewer_id(*)')
        .eq('reviewee_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviewsData = (data as any[]) || [];
      setReviews(reviewsData);

      // Calculate statistics
      if (reviewsData.length > 0) {
        const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviewsData.length;

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsData.forEach((review) => {
          breakdown[review.rating as keyof typeof breakdown]++;
        });

        setStats({
          averageRating: avgRating,
          totalReviews: reviewsData.length,
          ratingBreakdown: breakdown,
        });
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-8 h-8',
    };

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return { text: 'Excellent', color: 'text-green-600' };
    if (rating >= 4.0) return { text: 'Very Good', color: 'text-green-500' };
    if (rating >= 3.5) return { text: 'Good', color: 'text-blue-600' };
    if (rating >= 3.0) return { text: 'Average', color: 'text-yellow-600' };
    return { text: 'Below Average', color: 'text-orange-600' };
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

  const ratingLabel = getRatingLabel(stats.averageRating);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600 mt-2">See what others are saying about you</p>
        </div>

        {/* Profile Details Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Photo */}
              <Avatar className="w-24 h-24 flex-shrink-0">
                <AvatarImage src={profile?.profile_photo || ''} />
                <AvatarFallback className="bg-orange-500 text-white text-2xl font-bold">
                  {profile?.first_name?.[0]}
                  {profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 w-full">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h2>
                  
                  {/* Role Badges */}
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    {profile?.is_owner && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Pet Owner
                      </Badge>
                    )}
                    {profile?.is_host && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Pet Host
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {profile?.bio && (
                    <p className="text-gray-700 mt-4 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-orange-500" />
                        Contact Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{profile?.email}</span>
                        </div>
                        {profile?.phone && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile?.city && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Home className="w-4 h-4 text-gray-400" />
                            <span>{profile?.area}, {profile?.city}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pet Information */}
                    {profile?.is_owner && profile?.num_of_pets > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <PawPrint className="w-4 h-4 text-orange-500" />
                          Pet Owner Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          {profile?.num_of_pets > 0 && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <PawPrint className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Has {profile.num_of_pets} {profile.num_of_pets === 1 ? 'pet' : 'pets'}</span>
                            </div>
                          )}
                          {profile?.types_of_pets && profile.types_of_pets.length > 0 && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <PawPrint className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Pet types: {profile.types_of_pets.join(', ')}</span>
                            </div>
                          )}
                          {profile?.travel_frequency && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Travels: {profile.travel_frequency}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {profile?.languages_spoken && profile.languages_spoken.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-orange-500" />
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages_spoken.map((lang, index) => (
                            <Badge key={index} variant="outline" className="text-gray-700">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Host Information */}
                  {profile?.is_host && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Home className="w-4 h-4 text-orange-500" />
                          Hosting Information
                        </h3>
                        <div className="space-y-2 text-sm">
                          {profile?.home_type && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Home Type: {profile.home_type}</span>
                            </div>
                          )}
                          {profile?.max_pets_can_host > 0 && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <PawPrint className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Can host up to {profile.max_pets_can_host} pets</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2 text-gray-700">
                            <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{profile?.has_open_space ? 'Has open space' : 'No open space'}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-700">
                            <Users className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{profile?.has_children ? 'Has children' : 'No children'}</span>
                          </div>
                          {profile?.pet_experience_years && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <Star className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>{profile.pet_experience_years} years of pet experience</span>
                            </div>
                          )}
                          {profile?.provides_daily_updates && (
                            <div className="flex items-start gap-2 text-gray-700">
                              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span>Provides daily updates</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {stats.totalReviews === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">
                Complete bookings to start receiving reviews from other users
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Rating Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Overall Rating Card */}
              <Card className="md:col-span-1 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mb-4">
                      <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-5xl font-bold text-gray-900">
                        {stats.averageRating.toFixed(1)}
                      </div>
                      <div className={`text-lg font-semibold ${ratingLabel.color}`}>
                        {ratingLabel.text}
                      </div>
                      {renderStars(Math.round(stats.averageRating), 'md')}
                      <p className="text-sm text-gray-600 mt-3">
                        Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rating Breakdown */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Rating Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = stats.ratingBreakdown[rating as keyof typeof stats.ratingBreakdown];
                    const percentage = (count / stats.totalReviews) * 100;

                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-medium text-gray-700">{rating}</span>
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress value={percentage} className="flex-1 h-3" />
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Top Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No reviews available</p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b last:border-b-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        {/* Reviewer Avatar */}
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={review.reviewer?.profile_photo || ''} />
                          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                            {review.reviewer?.first_name?.[0]}
                            {review.reviewer?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>

                        {/* Review Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.reviewer?.first_name} {review.reviewer?.last_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <Badge
                              className={`flex-shrink-0 ${
                                review.rating >= 4
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : review.rating >= 3
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                  : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                              }`}
                            >
                              {review.rating} ⭐
                            </Badge>
                          </div>

                          {/* Star Rating */}
                          <div className="mb-3">{renderStars(review.rating, 'sm')}</div>

                          {/* Review Text */}
                          {review.review_text && (
                            <p className="text-gray-700 leading-relaxed">
                              {review.review_text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
