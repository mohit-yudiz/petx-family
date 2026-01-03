import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PawPrint, Heart, Shield, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About PetXfamily</h1>
          <p className="text-xl text-gray-600">
            Connecting pet owners with loving hosts for stress-free pet care
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-8">
            At PetXfamily, we believe that every pet deserves a comfortable, loving home environment when their owners travel.
            We connect responsible pet owners with verified hosts who provide cage-free, home-based pet care.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why PetXfamily?</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Heart className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Home-Like Care</h3>
              <p className="text-gray-600">
                Your pets stay in a comfortable home environment, not in cages or kennels.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Shield className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Verified Hosts</h3>
              <p className="text-gray-600">
                All hosts are verified and reviewed by the community for your peace of mind.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Users className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Join thousands of pet lovers who trust each other with their furry friends.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <PawPrint className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-xl font-semibold mb-2">Daily Updates</h3>
              <p className="text-gray-600">
                Stay connected with photos and updates about your pet's stay.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <p className="text-gray-600 mb-8">
            PetXfamily was founded by pet lovers who experienced the stress of finding reliable, loving care for their pets
            while traveling. We created a platform that brings together a community of responsible pet owners and caring hosts
            who understand the importance of providing a safe, comfortable environment for pets.
          </p>

          <div className="bg-orange-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join PetXfamily?</h3>
            <p className="text-gray-600 mb-6">
              Whether you're looking for a host or want to become one, we'd love to have you in our community.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
