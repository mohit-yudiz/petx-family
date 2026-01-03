import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Pricing Plans</h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your pet care needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Free</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Perfect for getting started
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Basic pet listing</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Connect with hosts</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Basic messaging</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Community support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Up to 2 pets</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Basic Plan */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900">Basic</CardTitle>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Popular</span>
              </div>
              <CardDescription className="text-gray-600 mt-2">
                Great for regular pet owners
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$15</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Everything in Free</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Up to 5 pets</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Photo updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Email support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Advanced search</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Booking calendar</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">Premium</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Best for frequent travelers
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Everything in Basic</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited pets</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Priority host matching</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Daily photo updates</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">24/7 support</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Insurance coverage</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Unlimited bookings</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

