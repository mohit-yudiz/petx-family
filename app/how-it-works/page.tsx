import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MessageCircle, Calendar, Home, Star } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/icon.png" alt="PetXfamily" width={40} height={40} className="w-10 h-10" />
              <span className="text-2xl font-bold text-gray-900">PetXfamily</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/"><Button variant="ghost">Home</Button></Link>
              <Link href="/login"><Button variant="outline">Sign In</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">How PetXfamily Works</h1>
          <p className="text-xl text-gray-600">
            Simple, safe, and stress-free pet care in three easy steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center border-0 shadow-xl">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <Search className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Find Your Perfect Host</h3>
              <p className="text-gray-600">
                Browse verified hosts in your area. Read reviews, check their experience, and find the perfect match for your pet's needs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-xl">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <MessageCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Book with Confidence</h3>
              <p className="text-gray-600">
                Send a booking request with your pet's details. Chat with the host to answer questions and confirm arrangements.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-xl">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <Home className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
              <p className="text-gray-600">
                Drop off your pet and receive daily updates with photos. Your pet enjoys a loving home environment while you travel.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For Pet Owners</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image src="/icon.png" alt="Pet" width={48} height={48} className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Create Pet Profiles</h4>
                <p className="text-gray-600">Add detailed information about your pets including their needs, behaviors, and medical requirements.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Select Your Dates</h4>
                <p className="text-gray-600">Choose your travel dates and find hosts available during that period in your preferred location.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Leave Reviews</h4>
                <p className="text-gray-600">After your pet's stay, share your experience to help other pet owners make informed decisions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">For Pet Hosts</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Set Up Your Host Profile</h4>
                <p className="text-gray-600">Share information about your home, experience with pets, and what makes you a great host.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Manage Your Availability</h4>
                <p className="text-gray-600">Set your available dates and specify how many pets you can host at once.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Accept Bookings</h4>
                <p className="text-gray-600">Review booking requests, chat with pet owners, and accept bookings that work for you.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join our community of pet lovers today
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
