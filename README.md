# PetStay - Pet Hospitality Platform

A production-ready, scalable Peer-to-Peer Pet Hospitality web application connecting pet owners with verified pet hosts for safe, home-like pet stays.

## Features

### For Pet Owners
- **Pet Management**: Add and manage multiple pet profiles with detailed information
- **Host Discovery**: Search and filter verified hosts by location and preferences
- **Booking System**: Request bookings with date selection and pet details
- **Real-time Messaging**: Chat with hosts about your pet's stay
- **Reviews & Ratings**: Rate and review hosts after completed stays

### For Pet Hosts
- **Host Profile**: Showcase your experience and home environment
- **Availability Management**: Set available dates and maximum pet capacity
- **Booking Requests**: Accept or reject booking requests
- **Guest Communication**: Stay in touch with pet owners
- **Build Reputation**: Earn reviews and ratings from satisfied pet owners

### General Features
- **Dual Roles**: Users can be both pet owners and hosts
- **Authentication**: Secure email/password authentication with OTP verification
- **Profile Management**: Comprehensive user profiles with role switching
- **Notifications**: Real-time notifications for bookings and messages
- **Responsive Design**: Beautiful Airbnb-inspired UI that works on all devices
- **Security**: Row-level security with Supabase

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Validation**: React Hook Form + Zod
- **Hosting**: Netlify

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd petstay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Netlify.

### Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

**Important**: After deployment, don't forget to add your Supabase environment variables in Netlify Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:
- `profiles` - User profiles with owner/host information
- `pets` - Pet profiles
- `bookings` - Booking requests and confirmations
- `messages` - In-app chat messages
- `reviews` - User reviews and ratings
- `notifications` - System notifications
- `host_availability` - Host availability periods
- `reports` - Incident reports

All tables have Row-Level Security (RLS) policies configured for data protection.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── (public)/          # Public pages
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   └── ...               # Custom components
├── contexts/             # React contexts (Auth, etc.)
├── lib/                  # Utility functions and configs
├── hooks/                # Custom React hooks
├── supabase/            # Database migrations
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Features Roadmap

Current implementation (Phase 1):
- ✅ Authentication system
- ✅ User profiles with role management
- ✅ Pet management (CRUD)
- ✅ Host discovery and search
- ✅ Booking system
- ✅ In-app messaging
- ✅ Reviews and ratings
- ✅ Notifications
- ✅ Incident reporting

Future enhancements:
- 🔲 Payment integration
- 🔲 Admin panel
- 🔲 Advanced search filters
- 🔲 Photo galleries
- 🔲 Calendar integrations
- 🔲 Mobile app (React Native)
- 🔲 Email notifications
- 🔲 SMS alerts

## Contributing

This is a proprietary project. Please contact the project owner for contribution guidelines.

## Security

- All database queries use Row-Level Security (RLS)
- Authentication handled by Supabase Auth
- Environment variables for sensitive data
- Input validation with Zod schemas
- Protected routes with authentication checks

## License

Proprietary - All rights reserved

## Support

For support, please contact support@petstay.com or visit our [Contact Page](/contact).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Database and auth by [Supabase](https://supabase.com/)
- Hosted on [Netlify](https://www.netlify.com/)
