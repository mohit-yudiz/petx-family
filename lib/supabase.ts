// Re-export database types and functions for backward compatibility
export { database as supabase } from './database';
export type {
  Profile,
  Pet,
  HostAvailability,
  Booking,
  Message,
  Review,
  Notification,
} from './database';
