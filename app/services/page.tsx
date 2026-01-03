'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingBag, Scissors, Stethoscope, UtensilsCrossed, Home, Star, MapPin, Phone, ExternalLink } from 'lucide-react';

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  website?: string;
  features: string[];
  discount?: string;
};

// Mock data for partner services
const services: Service[] = [
  {
    id: '1',
    name: 'PawsomePets Food Store',
    category: 'food',
    description: 'Premium pet food and nutrition supplements for all breeds',
    image: '/pets-food.jpg',
    rating: 4.8,
    reviews: 245,
    location: 'Koramangala, Bangalore',
    phone: '+91 98765 43210',
    website: 'https://pawsomepets.com',
    features: ['Organic Food', 'Home Delivery', '24/7 Support', 'Vet Consultation'],
    discount: '15% Off'
  },
  {
    id: '2',
    name: 'Furry Styles Grooming',
    category: 'grooming',
    description: 'Professional pet grooming, spa, pedicure & manicure services',
    image: '/grooming.jpg',
    rating: 4.9,
    reviews: 189,
    location: 'Indiranagar, Bangalore',
    phone: '+91 98765 43211',
    features: ['Professional Groomers', 'Spa Services', 'Nail Care', 'Hair Styling'],
    discount: '20% Off First Visit'
  },
  {
    id: '3',
    name: 'PetCare Veterinary Clinic',
    category: 'veterinary',
    description: '24/7emergency vet care, vaccinations, and health check-ups',
    image: '/vet-care.jpg',
    rating: 4.7,
    reviews: 312,
    location: 'HSR Layout, Bangalore',
    phone: '+91 98765 43212',
    website: 'https://petcareclinic.com',
    features: ['24/7 Emergency', 'Expert Vets', 'Surgery', 'Vaccination'],
  },
  {
    id: '4',
    name: 'Happy Tails Pet Store',
    category: 'store',
    description: 'Complete pet supplies, toys, accessories, and essentials',
    image: '/pet-store.jpg',
    rating: 4.6,
    reviews: 428,
    location: 'Jayanagar, Bangalore',
    phone: '+91 98765 43213',
    features: ['Wide Range', 'Quality Products', 'Free Shipping', 'Easy Returns'],
    discount: '10% Off'
  },
  {
    id: '5',
    name: 'Organic Pet Foods Co.',
    category: 'food',
    description: 'Certified organic and natural pet food products',
    image: '/organic-food.jpg',
    rating: 4.9,
    reviews: 156,
    location: 'Whitefield, Bangalore',
    phone: '+91 98765 43214',
    website: 'https://organicpetfoods.com',
    features: ['100% Organic', 'No Preservatives', 'Grain-Free Options', 'Custom Diet Plans'],
    discount: '25% Off'
  },
  {
    id: '6',
    name: 'Pampered Paws Spa',
    category: 'grooming',
    description: 'Luxury spa and grooming services for your beloved pets',
    image: '/spa.jpg',
    rating: 5.0,
    reviews: 98,
    location: 'MG Road, Bangalore',
    phone: '+91 98765 43215',
    features: ['Luxury Spa', 'Aromatherapy', 'Massage', 'Premium Products'],
  },
];

export default function ServicesPage() {
  return (
    <ProtectedRoute>
      <ServicesContent />
    </ProtectedRoute>
  );
}

function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Services', icon: Home },
    { value: 'food', label: 'Pet Food', icon: UtensilsCrossed },
    { value: 'grooming', label: 'Grooming & Spa', icon: Scissors },
    { value: 'veterinary', label: 'Veterinary', icon: Stethoscope },
    { value: 'store', label: 'Pet Stores', icon: ShoppingBag },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Pet Store</h1>
          <p className="text-gray-600 mt-2 text-lg">Partner services for all your pet care needs</p>
          <Badge className="mt-3 bg-orange-500 hover:bg-orange-600">
            Exclusive discounts for PetXfamily members!
          </Badge>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search services, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-xl transition-shadow overflow-hidden flex flex-col h-full">
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">
                      {service.category === 'food' && '🍖'}
                      {service.category === 'grooming' && '✂️'}
                      {service.category === 'veterinary' && '🏥'}
                      {service.category === 'store' && '🏪'}
                    </div>
                  </div>
                  {service.discount && (
                    <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600">
                      {service.discount}
                    </Badge>
                  )}
                </div>

                <CardContent className="pt-4 flex-1 flex flex-col">
                  <div className="space-y-3 flex-1 flex flex-col">
                    {/* Title and Rating */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm">{service.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {service.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2 pt-2 mt-auto">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                        onClick={() => window.open(`tel:${service.phone}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      {service.website && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(service.website, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Partner Benefits Section */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Why Choose Our Partners?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">✅</div>
                <h4 className="font-semibold mb-1">Verified Partners</h4>
                <p className="text-sm text-gray-600">All services are thoroughly verified</p>
              </div>
              <div>
                <div className="text-4xl mb-2">💰</div>
                <h4 className="font-semibold mb-1">Exclusive Discounts</h4>
                <p className="text-sm text-gray-600">Special offers for our members</p>
              </div>
              <div>
                <div className="text-4xl mb-2">⭐</div>
                <h4 className="font-semibold mb-1">Quality Assured</h4>
                <p className="text-sm text-gray-600">Top-rated service providers</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🤝</div>
                <h4 className="font-semibold mb-1">Trusted Network</h4>
                <p className="text-sm text-gray-600">Partnerships you can rely on</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
