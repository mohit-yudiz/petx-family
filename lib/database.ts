import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      console.warn('Supabase credentials not found during build. This is expected for static generation.');
    }

    supabaseInstance = createClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  } else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

export const database = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export type Profile = {
  id: string;
  user_id: string;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  dob: string | null;
  gender: string | null;
  city: string;
  area: string;
  bio: string | null;
  languages_spoken: string[] | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  active_role: 'owner' | 'host' | 'both';
  is_owner: boolean;
  is_host: boolean;
  travel_frequency: string | null;
  preferred_host_type: string | null;
  vet_name: string | null;
  vet_contact: string | null;
  has_own_pets: boolean;
  num_of_pets: number;
  types_of_pets: string[] | null;
  pet_experience_years: number | null;
  home_type: string | null;
  has_open_space: boolean;
  has_children: boolean;
  max_pets_can_host: number;
  provides_daily_updates: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type Pet = {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  age_years: number | null;
  age_months: number | null;
  gender: string | null;
  weight_kg: number | null;
  is_vaccinated: boolean;
  vaccination_certificate_url: string | null;
  is_neutered: boolean;
  friendly_with_pets: boolean;
  friendly_with_humans: boolean;
  medical_conditions: string | null;
  medicines: string | null;
  food_type: string | null;
  feeding_schedule: string | null;
  walking_schedule: string | null;
  special_instructions: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type HostAvailability = {
  id: string;
  host_id: string;
  available_from: string;
  available_to: string;
  max_pets: number;
  blocked_dates: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  booking_number: string;
  owner_id: string;
  host_id: string;
  pet_ids: string[];
  check_in_date: string;
  check_out_date: string;
  drop_off_time: string | null;
  pick_up_time: string | null;
  location_radius: number | null;
  special_instructions: string | null;
  emergency_permission: boolean;
  status: 'requested' | 'accepted' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  rejection_reason: string | null;
  owner_confirmed_dropoff: boolean;
  host_confirmed_receiving: boolean;
  host_confirmed_completion: boolean;
  owner_confirmed_pickup: boolean;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string | null;
  image_url: string | null;
  is_system_message: boolean;
  read_at: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  review_text: string | null;
  pet_behavior_feedback: string | null;
  host_experience_feedback: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'new_request' | 'request_accepted' | 'request_rejected' | 'booking_reminder' | 'review_reminder' | 'message';
  title: string;
  message: string;
  booking_id: string | null;
  is_read: boolean;
  created_at: string;
};
