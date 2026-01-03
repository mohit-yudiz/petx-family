import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
        <div className="prose prose-lg max-w-none bg-white rounded-lg shadow-lg p-12">
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using PetXfamily, you accept and agree to be bound by these Terms and Conditions.
            If you do not agree to these terms, please do not use our platform.
          </p>

          <h2>2. User Responsibilities</h2>
          <h3>Pet Owners</h3>
          <ul>
            <li>Provide accurate information about your pets including health status and behavior</li>
            <li>Ensure pets are vaccinated and healthy before hosting</li>
            <li>Communicate special needs and requirements clearly</li>
            <li>Respect hosts' homes and property</li>
          </ul>

          <h3>Pet Hosts</h3>
          <ul>
            <li>Provide accurate information about your home and experience</li>
            <li>Provide proper care and attention to hosted pets</li>
            <li>Maintain a safe and clean environment</li>
            <li>Communicate any issues or concerns promptly</li>
          </ul>

          <h2>3. Liability</h2>
          <p>
            PetXfamily acts as a platform connecting pet owners with hosts. We do not assume responsibility for:
          </p>
          <ul>
            <li>Pet health issues or injuries during stays</li>
            <li>Property damage caused by pets</li>
            <li>Disputes between owners and hosts</li>
            <li>Quality of care provided</li>
          </ul>

          <h2>4. Cancellation Policy</h2>
          <p>
            Users may cancel bookings according to mutually agreed terms. We encourage clear communication
            and reasonable notice for cancellations.
          </p>

          <h2>5. Prohibited Activities</h2>
          <p>Users may not:</p>
          <ul>
            <li>Misrepresent information about pets or hosting capabilities</li>
            <li>Use the platform for illegal activities</li>
            <li>Harass or threaten other users</li>
            <li>Violate any local laws or regulations</li>
          </ul>

          <h2>6. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these terms or engage in
            inappropriate behavior.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the platform after changes
            constitutes acceptance of new terms.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions about these terms, please contact us through our support channels.
          </p>
        </div>
      </div>
    </div>
  );
}
