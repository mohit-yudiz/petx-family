import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PawPrint } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">PetStay</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/"><Button variant="ghost">Home</Button></Link>
              <Link href="/login"><Button variant="outline">Sign In</Button></Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-lg p-12">
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Profile photos and bio</li>
            <li>Location information (city and area)</li>
            <li>Pet information and photos</li>
          </ul>

          <h3>Usage Information</h3>
          <ul>
            <li>Booking history and preferences</li>
            <li>Messages and communications</li>
            <li>Reviews and ratings</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Connect pet owners with suitable hosts</li>
            <li>Facilitate bookings and communications</li>
            <li>Improve our platform and services</li>
            <li>Send important updates and notifications</li>
            <li>Ensure safety and security of the community</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We share your information only when:</p>
          <ul>
            <li>Connecting you with hosts or pet owners for bookings</li>
            <li>Required by law or legal processes</li>
            <li>Necessary to protect the rights and safety of our users</li>
          </ul>

          <p>We do not sell your personal information to third parties.</p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data.
            However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Export your data</li>
          </ul>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to improve your experience, analyze usage,
            and remember your preferences.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            PetStay is not intended for users under 18 years of age. We do not knowingly collect
            information from children.
          </p>

          <h2>8. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant
            changes through email or platform notifications.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy or how we handle your data, please
            contact us through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
}
