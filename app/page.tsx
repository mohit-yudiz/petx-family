import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home as HomeIcon, Search, MessageCircle, Star, Shield, Heart, PawPrint } from 'lucide-react';

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Image src="/icon.png" alt="PetXfamily" width={40} height={40} className="w-10 h-10" />
              <span className="text-2xl font-bold text-gray-900">PetXfamily</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/about">
                <Button variant="ghost">About</Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="ghost">How It Works</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-orange-500 hover:bg-orange-600">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            A Safe, Loving Home for Your Pet
            <br />
            <span className="text-orange-500">While You're Away</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified pet hosts who provide a comfortable, cage-free home environment
            for your furry friends when you travel.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Find a Pet Host
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">
                Become a Host
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                  <feature.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PetXfamily Works</h2>
            <p className="text-xl text-gray-600">Simple, safe, and stress-free pet care</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full text-white text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Perfect Host</h3>
              <p className="text-gray-600">
                Browse verified hosts in your area. Read reviews and find the perfect match for your pet.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full text-white text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book with Confidence</h3>
              <p className="text-gray-600">
                Send a booking request with your pet's details. Chat with the host to answer any questions.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full text-white text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay Connected</h3>
              <p className="text-gray-600">
                Receive daily updates and photos. Your pet gets love and care in a comfortable home.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of pet owners and hosts in our trusted community
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100">
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
