'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home as HomeIcon, Search, MessageCircle, Star, Shield, Heart, PawPrint } from 'lucide-react';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: HomeIcon,
      title: 'Home-like Environment',
      description: 'Your pets stay in a comfortable home environment, not in cages',
    },
    {
      icon: Shield,
      title: 'Verified Hosts',
      description: 'All hosts are verified with reviews from other pet owners',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Updates',
      description: 'Get daily photos and updates about your pet during their stay',
    },
    {
      icon: Star,
      title: 'Trusted Community',
      description: 'Join a community of pet lovers who care about your furry friends',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[500px] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-float"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-orange-300 rounded-full opacity-20 animate-float-slow"></div>
        </div>

        <div className={`text-center max-w-3xl mx-auto relative z-10 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-slide-down">
            A Safe, Loving Home for Your Pet
            <br />
            <span className="text-orange-500 animate-pulse-slow">While You&apos;re Away</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-slide-up">
            Connect with verified pet hosts who provide a comfortable, cage-free home environment
            for your furry friends when you travel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up-delayed">
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Find a Pet Host
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="transform hover:scale-105 transition-all duration-300">
                Become a Host
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Animation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 animate-bounce-slow">
                  <feature.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-20 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'pattern-move 20s linear infinite'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PetXfamily Works</h2>
            <p className="text-xl text-gray-600">Simple, safe, and stress-free pet care</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: 1,
                title: 'Find Your Perfect Host',
                description: 'Browse verified hosts in your area. Read reviews and find the perfect match for your pet.',
              },
              {
                number: 2,
                title: 'Book with Confidence',
                description: 'Send a booking request with your pet&apos;s details. Chat with the host to answer any questions.',
              },
              {
                number: 3,
                title: 'Stay Connected',
                description: 'Receive daily updates and photos. Your pet gets love and care in a comfortable home.',
              },
            ].map((step, index) => (
              <div 
                key={index} 
                className="text-center transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full text-white text-2xl font-bold mb-4 animate-pulse-slow shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
        {/* Animated Background Waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-6 animate-slide-down">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-xl text-orange-100 mb-8 animate-slide-up">
            Join thousands of pet owners and hosts in our trusted community
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl animate-bounce-slow">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/icon.png" alt="PetXfamily" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold">PetXfamily</span>
              </div>
              <p className="text-gray-400">
                Safe, loving pet care in a home environment
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
                <li><Link href="/guidelines" className="hover:text-white">Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PetXfamily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
