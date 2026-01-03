import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PawPrint } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How does PetStay work?',
      answer: 'PetStay connects pet owners with verified hosts. Browse hosts in your area, send a booking request with your pet details, and chat with the host. Once confirmed, drop off your pet and receive daily updates during their stay.'
    },
    {
      question: 'Are hosts verified?',
      answer: 'Yes, all hosts go through a verification process and build their reputation through reviews from other pet owners. You can read reviews and ratings before booking.'
    },
    {
      question: 'What if my pet has special needs?',
      answer: 'When creating your pet profile, you can add detailed information about medical conditions, medications, dietary requirements, and special instructions. Hosts can view this before accepting a booking.'
    },
    {
      question: 'How do I become a host?',
      answer: 'Simply enable host mode in your profile settings, complete your host profile with information about your home and experience, and set your availability. You will start receiving booking requests from pet owners in your area.'
    },
    {
      question: 'What happens in case of an emergency?',
      answer: 'During booking, owners can grant emergency permission for veterinary care. Hosts have access to your emergency contact and vet information. We recommend discussing emergency procedures with your host before the stay.'
    },
    {
      question: 'How do payments work?',
      answer: 'Payment features are coming soon. Currently, PetStay focuses on connecting the community. Payment arrangements can be made directly between owners and hosts.'
    },
    {
      question: 'Can I cancel a booking?',
      answer: 'Yes, bookings can be cancelled by either party. We recommend communicating with clear notice and understanding that last-minute cancellations impact other users.'
    },
    {
      question: 'How do I report an issue?',
      answer: 'If you experience any issues, you can file an incident report through your profile. Our team reviews all reports and takes appropriate action to maintain community safety.'
    }
  ];

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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about PetStay
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6 border-0 shadow-sm">
              <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-orange-500">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 bg-orange-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Contact our support team and we'll be happy to help
          </p>
          <Link href="/contact">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
