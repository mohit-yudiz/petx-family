/*
  # PetStay Platform Schema

  ## Overview
  Complete database schema for PetStay - a pet hospitality platform connecting pet owners with hosts.
  Note: Authentication is handled locally, so RLS policies are permissive for application-level access control.

  ## Tables Created

  1. **profiles** - User profile information
  2. **pets** - Pet information
  3. **host_availability** - Host availability periods
  4. **bookings** - Pet stay bookings
  5. **messages** - Booking-related messages
  6. **notifications** - User notifications
  7. **reviews** - Booking reviews

  ## Security
  - RLS enabled but permissive since auth is local
  - Application handles access control logic
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  profile_photo text,
  dob date,
  gender text,
  city text DEFAULT '',
  area text DEFAULT '',
  bio text,
  languages_spoken text[],
  emergency_contact_name text,
  emergency_contact_phone text,
  active_role text DEFAULT 'owner' CHECK (active_role IN ('owner', 'host', 'both')),
  is_owner boolean DEFAULT true,
  is_host boolean DEFAULT false,
  travel_frequency text,
  preferred_host_type text,
  vet_name text,
  vet_contact text,
  has_own_pets boolean DEFAULT false,
  num_of_pets integer DEFAULT 0,
  types_of_pets text[],
  pet_experience_years integer,
  home_type text,
  has_open_space boolean DEFAULT false,
  has_children boolean DEFAULT false,
  max_pets_can_host integer DEFAULT 0,
  provides_daily_updates boolean DEFAULT false,
  email_verified boolean DEFAULT true,
  phone_verified boolean DEFAULT true,
  profile_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  age_years integer,
  age_months integer,
  gender text,
  weight_kg decimal,
  is_vaccinated boolean DEFAULT false,
  vaccination_certificate_url text,
  is_neutered boolean DEFAULT false,
  friendly_with_pets boolean DEFAULT true,
  friendly_with_humans boolean DEFAULT true,
  medical_conditions text,
  medicines text,
  food_type text,
  feeding_schedule text,
  walking_schedule text,
  special_instructions text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create host_availability table
CREATE TABLE IF NOT EXISTS host_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  available_from date NOT NULL,
  available_to date NOT NULL,
  max_pets integer DEFAULT 1,
  blocked_dates date[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (available_to >= available_from)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text UNIQUE NOT NULL,
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pet_ids uuid[] NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  drop_off_time time,
  pick_up_time time,
  location_radius integer,
  special_instructions text,
  emergency_permission boolean DEFAULT false,
  status text DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  rejection_reason text,
  owner_confirmed_dropoff boolean DEFAULT false,
  host_confirmed_receiving boolean DEFAULT false,
  host_confirmed_completion boolean DEFAULT false,
  owner_confirmed_pickup boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_dates CHECK (check_out_date >= check_in_date)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_text text,
  image_url text,
  is_system_message boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_request', 'request_accepted', 'request_rejected', 'booking_reminder', 'review_reminder', 'message')),
  title text NOT NULL,
  message text NOT NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  pet_behavior_feedback text,
  host_experience_feedback text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, reviewer_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_host_availability_host_id ON host_availability(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anon access (since auth is local)
CREATE POLICY "Allow all operations on profiles"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on pets"
  ON pets FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on host_availability"
  ON host_availability FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on bookings"
  ON bookings FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on messages"
  ON messages FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on notifications"
  ON notifications FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on reviews"
  ON reviews FOR ALL
  USING (true)
  WITH CHECK (true);
