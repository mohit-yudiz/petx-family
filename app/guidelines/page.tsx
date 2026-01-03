import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, AlertCircle } from 'lucide-react';

export default function GuidelinesPage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Community Guidelines</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-12">
            PetXfamily is built on trust, respect, and love for pets. These guidelines help ensure a safe
            and positive experience for everyone in our community.
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Treat Pets with Love and Care</h2>
            </div>
            <ul>
              <li>Always provide a safe, clean, and comfortable environment</li>
              <li>Follow the owner's instructions for feeding, medication, and exercise</li>
              <li>Never use physical punishment or harsh treatment</li>
              <li>Provide attention, affection, and mental stimulation</li>
              <li>Monitor pets for any signs of stress or illness</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Respect Each Other</h2>
            </div>
            <ul>
              <li>Communicate clearly and honestly about expectations</li>
              <li>Be responsive to messages and booking requests</li>
              <li>Respect property and personal boundaries</li>
              <li>Provide accurate information in profiles and listings</li>
              <li>Be professional and courteous in all interactions</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Ensure Safety and Security</h2>
            </div>

            <h3>For Pet Owners:</h3>
            <ul>
              <li>Ensure pets are up-to-date on vaccinations</li>
              <li>Disclose all relevant health and behavioral information</li>
              <li>Provide emergency contact information</li>
              <li>Never leave aggressive or unsafe pets with hosts</li>
            </ul>

            <h3>For Hosts:</h3>
            <ul>
              <li>Secure your home to prevent escapes</li>
              <li>Keep pets separated if they don't get along</li>
              <li>Store harmful substances out of reach</li>
              <li>Have a plan for emergencies</li>
              <li>Never accept more pets than you can safely care for</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 m-0">Prohibited Behaviors</h2>
            </div>
            <p>The following behaviors are strictly prohibited:</p>
            <ul>
              <li>Misrepresenting yourself, your pets, or your hosting capabilities</li>
              <li>Discrimination based on breed, species, or other factors</li>
              <li>Harassment, threats, or abusive behavior</li>
              <li>Neglect or mistreatment of animals</li>
              <li>Using the platform for breeding or selling pets</li>
              <li>Sharing personal information publicly</li>
              <li>Attempting to conduct transactions outside the platform</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reporting Issues</h2>
            <p>
              If you experience or witness any violations of these guidelines:
            </p>
            <ul>
              <li>Use the incident report feature in your profile</li>
              <li>Provide detailed information and evidence</li>
              <li>Contact support for urgent matters</li>
            </ul>
            <p>
              We take all reports seriously and will investigate promptly. Users who violate
              these guidelines may face warnings, suspension, or permanent removal from the platform.
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              By following these guidelines, you help create a safe, welcoming community
              where pets receive the best possible care.
            </p>
            <Link href="/register">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Join Our Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
