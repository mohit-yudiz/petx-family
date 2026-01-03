'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Ticket, Copy, Check, ShoppingBag, UtensilsCrossed, Gift, Calendar, Sparkles, Scissors, Heart } from 'lucide-react';
import { database, Booking } from '@/lib/database';

type Coupon = {
  id: string;
  code: string;
  type: 'pet_food' | 'accessories' | 'general';
  discount: number;
  description: string;
  bookingId: string;
  bookingNumber: string;
  earnedDate: string;
  expiresDate: string;
  isUsed: boolean;
  icon: React.ReactNode;
};

export default function CouponsPage() {
  return (
    <ProtectedRoute>
      <CouponsContent />
    </ProtectedRoute>
  );
}

function CouponsContent() {
  const { profile } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const generateCouponCode = (bookingId: string, type: string): string => {
    const prefix = type === 'pet_food' ? 'PF' : type === 'accessories' ? 'ACC' : 'GEN';
    const shortId = bookingId.substring(0, 8).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${shortId}-${random}`;
  };

  const getCouponType = (index: number): 'pet_food' | 'accessories' | 'general' => {
    const types: ('pet_food' | 'accessories' | 'general')[] = ['pet_food', 'accessories', 'general'];
    return types[index % types.length];
  };

  const getCouponDetails = (type: 'pet_food' | 'accessories' | 'general') => {
    switch (type) {
      case 'pet_food':
        return {
          description: 'Get 15% off on premium pet food',
          discount: 15,
          icon: <UtensilsCrossed className="w-6 h-6" />,
        };
      case 'accessories':
        return {
          description: 'Get 20% off on pet accessories',
          discount: 20,
          icon: <ShoppingBag className="w-6 h-6" />,
        };
      default:
        return {
          description: 'Get 10% off on all pet products',
          discount: 10,
          icon: <Gift className="w-6 h-6" />,
        };
    }
  };

  // Fake dog-related coupons
  const getFakeCoupons = (): Coupon[] => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setMonth(futureDate.getMonth() + 3);

    return [
      {
        id: 'fake-1',
        code: 'PATSPEDICURE25',
        type: 'general',
        discount: 25,
        description: 'Pats Pedicure - 25% off on dog nail trimming & grooming',
        bookingId: 'fake-booking-1',
        bookingNumber: 'FAKE-001',
        earnedDate: now.toISOString(),
        expiresDate: futureDate.toISOString(),
        isUsed: false,
        icon: <Scissors className="w-6 h-6" />,
      },
      {
        id: 'fake-2',
        code: 'PATSSPA30',
        type: 'general',
        discount: 30,
        description: 'Pats Spa - 30% off on full dog spa & wellness services',
        bookingId: 'fake-booking-2',
        bookingNumber: 'FAKE-002',
        earnedDate: now.toISOString(),
        expiresDate: futureDate.toISOString(),
        isUsed: false,
        icon: <Sparkles className="w-6 h-6" />,
      },
      {
        id: 'fake-3',
        code: 'DOGFOOD20',
        type: 'pet_food',
        discount: 20,
        description: 'Premium Dog Food - 20% off on all dog food products',
        bookingId: 'fake-booking-3',
        bookingNumber: 'FAKE-003',
        earnedDate: now.toISOString(),
        expiresDate: futureDate.toISOString(),
        isUsed: false,
        icon: <UtensilsCrossed className="w-6 h-6" />,
      },
      {
        id: 'fake-4',
        code: 'DOGTOYS15',
        type: 'accessories',
        discount: 15,
        description: 'Dog Toys & Accessories - 15% off on all dog toys',
        bookingId: 'fake-booking-4',
        bookingNumber: 'FAKE-004',
        earnedDate: now.toISOString(),
        expiresDate: futureDate.toISOString(),
        isUsed: false,
        icon: <ShoppingBag className="w-6 h-6" />,
      },
      {
        id: 'fake-5',
        code: 'DOGCARE25',
        type: 'general',
        discount: 25,
        description: 'Dog Care Essentials - 25% off on dog care products',
        bookingId: 'fake-booking-5',
        bookingNumber: 'FAKE-005',
        earnedDate: now.toISOString(),
        expiresDate: futureDate.toISOString(),
        isUsed: false,
        icon: <Heart className="w-6 h-6" />,
      },
      {
        id: 'fake-6',
        code: 'DOGGROOMING20',
        type: 'general',
        discount: 20,
        description: 'Dog Grooming Services - 20% off on professional grooming',
        bookingId: 'fake-booking-6',
        bookingNumber: 'FAKE-006',
        earnedDate: now.toISOString(),
        expiresDate: futureDate.toISOString(),
        isUsed: false,
        icon: <Scissors className="w-6 h-6" />,
      },
    ];
  };

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);

      // Start with fake coupons
      const fakeCoupons = getFakeCoupons();
      let generatedCoupons: Coupon[] = [...fakeCoupons];

      // If user is a host, also fetch coupons from completed bookings
      if (profile?.id && profile?.is_host) {
        const { data: completedBookings, error } = await database
          .from('bookings')
          .select('*')
          .eq('host_id', profile.id)
          .eq('status', 'completed')
          .order('updated_at', { ascending: false });

        if (!error && completedBookings) {
          // Generate coupons from completed bookings
          const bookingCoupons: Coupon[] = completedBookings.map((booking: Booking, index: number) => {
            const type = getCouponType(index);
            const details = getCouponDetails(type);
            const earnedDate = new Date(booking.updated_at);
            const expiresDate = new Date(earnedDate);
            expiresDate.setMonth(expiresDate.getMonth() + 3); // Coupons expire in 3 months

            return {
              id: booking.id,
              code: generateCouponCode(booking.id, type),
              type,
              discount: details.discount,
              description: details.description,
              bookingId: booking.id,
              bookingNumber: booking.booking_number,
              earnedDate: earnedDate.toISOString(),
              expiresDate: expiresDate.toISOString(),
              isUsed: false,
              icon: details.icon,
            };
          });

          generatedCoupons = [...fakeCoupons, ...bookingCoupons];
        }
      }

      setCoupons(generatedCoupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
      // Still show fake coupons even if there's an error
      setCoupons(getFakeCoupons());
    } finally {
      setLoading(false);
    }
  }, [profile?.id, profile?.is_host]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCouponColor = (type: 'pet_food' | 'accessories' | 'general') => {
    switch (type) {
      case 'pet_food':
        return 'bg-green-50 border-green-200';
      case 'accessories':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const getCouponIconColor = (type: 'pet_food' | 'accessories' | 'general') => {
    switch (type) {
      case 'pet_food':
        return 'bg-green-100 text-green-600';
      case 'accessories':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-purple-100 text-purple-600';
    }
  };

  const isExpired = (expiresDate: string) => {
    return new Date(expiresDate) < new Date();
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


  const activeCoupons = coupons.filter(c => !isExpired(c.expiresDate) && !c.isUsed);
  const expiredCoupons = coupons.filter(c => isExpired(c.expiresDate) || c.isUsed);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Coupons</h1>
          <p className="text-gray-600 mt-2">
            Earned from hosting pets - Use these codes for discounts on pet food, accessories, and more!
          </p>
        </div>

        {coupons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coupons Yet</h3>
              <p className="text-gray-600 mb-4">
                Complete your first pet hosting to earn your first coupon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {activeCoupons.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Active Coupons</h2>
                  <Badge className="bg-green-500">{activeCoupons.length} Available</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCoupons.map((coupon) => (
                    <Card
                      key={coupon.id}
                      className={`${getCouponColor(coupon.type)} hover:shadow-lg transition-shadow`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-full ${getCouponIconColor(coupon.type)}`}>
                            {coupon.icon}
                          </div>
                          <Badge className="bg-orange-500">
                            {coupon.discount}% OFF
                          </Badge>
                        </div>
                        <CardTitle className="mt-4 text-lg">{coupon.description}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-dashed">
                          <div className="flex items-center justify-between">
                            <code className="text-lg font-mono font-bold text-gray-900">
                              {coupon.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(coupon.code)}
                              className="h-8 w-8"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Expires: {new Date(coupon.expiresDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Ticket className="w-4 h-4 mr-2" />
                            <span>Booking: {coupon.bookingNumber}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          Copy Code
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {expiredCoupons.length > 0 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Expired / Used Coupons</h2>
                  <Badge variant="secondary">{expiredCoupons.length}</Badge>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {expiredCoupons.map((coupon) => (
                    <Card
                      key={coupon.id}
                      className="bg-gray-50 border-gray-200 opacity-60"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="p-3 rounded-full bg-gray-200 text-gray-500">
                            {coupon.icon}
                          </div>
                          <Badge variant="secondary">
                            {coupon.discount}% OFF
                          </Badge>
                        </div>
                        <CardTitle className="mt-4 text-lg">{coupon.description}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-dashed">
                          <code className="text-lg font-mono font-bold text-gray-500">
                            {coupon.code}
                          </code>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Expired: {new Date(coupon.expiresDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Ticket className="w-4 h-4 mr-2" />
                            <span>Booking: {coupon.bookingNumber}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="w-full justify-center">
                          {isExpired(coupon.expiresDate) ? 'Expired' : 'Used'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">How to Earn More Coupons</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete pet hosting bookings to earn coupons</li>
                  <li>• Each completed booking earns you one coupon</li>
                  <li>• Coupons are valid for 3 months from the booking completion date</li>
                  <li>• Use coupon codes at checkout for instant discounts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

