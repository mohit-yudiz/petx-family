/*
  # Fix Security and Performance Issues

  ## Changes Made

  ### 1. Add Missing Indexes on Foreign Keys
  - Add indexes on messages table (receiver_id, sender_id)
  - Add indexes on notifications table (booking_id)
  - Add indexes on reports table (booking_id, reported_user_id, reporter_id)
  - Add indexes on reviews table (booking_id, reviewer_id)

  ### 2. Optimize RLS Policies
  - Replace auth.uid() with (select auth.uid()) in all RLS policies
  - This prevents re-evaluation of auth.uid() for each row, significantly improving query performance

  ### 3. Fix Function Search Paths
  - Set immutable search_path for all custom functions to prevent security issues

  ## Performance Impact
  - Indexes will speed up foreign key lookups and joins
  - Optimized RLS policies will reduce CPU usage and improve query response times
*/

-- =====================================================
-- 1. ADD MISSING INDEXES ON FOREIGN KEYS
-- =====================================================

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Notifications table indexes
CREATE INDEX IF NOT EXISTS idx_notifications_booking_id ON notifications(booking_id);

-- Reports table indexes
CREATE INDEX IF NOT EXISTS idx_reports_booking_id ON reports(booking_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);

-- Reviews table indexes
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);

-- =====================================================
-- 2. OPTIMIZE RLS POLICIES - PROFILES TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view host profiles" ON profiles;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Public can view host profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (is_host = true);

-- =====================================================
-- 3. OPTIMIZE RLS POLICIES - PETS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Owners can view their own pets" ON pets;
DROP POLICY IF EXISTS "Owners can insert their own pets" ON pets;
DROP POLICY IF EXISTS "Owners can update their own pets" ON pets;
DROP POLICY IF EXISTS "Owners can delete their own pets" ON pets;
DROP POLICY IF EXISTS "Hosts can view pets in their bookings" ON pets;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Owners can view their own pets"
  ON pets FOR SELECT
  TO authenticated
  USING (owner_id = (select auth.uid()));

CREATE POLICY "Owners can insert their own pets"
  ON pets FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));

CREATE POLICY "Owners can update their own pets"
  ON pets FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()));

CREATE POLICY "Owners can delete their own pets"
  ON pets FOR DELETE
  TO authenticated
  USING (owner_id = (select auth.uid()));

CREATE POLICY "Hosts can view pets in their bookings"
  ON pets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.host_id = (select auth.uid())
      AND pets.id = ANY(bookings.pet_ids)
    )
  );

-- =====================================================
-- 4. OPTIMIZE RLS POLICIES - HOST_AVAILABILITY TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Hosts can manage their own availability" ON host_availability;
DROP POLICY IF EXISTS "Public can view host availability" ON host_availability;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Hosts can manage their own availability"
  ON host_availability FOR ALL
  TO authenticated
  USING (host_id = (select auth.uid()))
  WITH CHECK (host_id = (select auth.uid()));

CREATE POLICY "Public can view host availability"
  ON host_availability FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 5. OPTIMIZE RLS POLICIES - BOOKINGS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own bookings as owner" ON bookings;
DROP POLICY IF EXISTS "Users can view their own bookings as host" ON bookings;
DROP POLICY IF EXISTS "Owners can create bookings" ON bookings;
DROP POLICY IF EXISTS "Booking participants can update bookings" ON bookings;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view their own bookings as owner"
  ON bookings FOR SELECT
  TO authenticated
  USING (owner_id = (select auth.uid()));

CREATE POLICY "Users can view their own bookings as host"
  ON bookings FOR SELECT
  TO authenticated
  USING (host_id = (select auth.uid()));

CREATE POLICY "Owners can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = (select auth.uid()));

CREATE POLICY "Booking participants can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (owner_id = (select auth.uid()) OR host_id = (select auth.uid()))
  WITH CHECK (owner_id = (select auth.uid()) OR host_id = (select auth.uid()));

-- =====================================================
-- 6. OPTIMIZE RLS POLICIES - MESSAGES TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages in their bookings" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view messages in their bookings"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = (select auth.uid()));

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = (select auth.uid()))
  WITH CHECK (receiver_id = (select auth.uid()));

-- =====================================================
-- 7. OPTIMIZE RLS POLICIES - REVIEWS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews for completed bookings" ON reviews;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = reviews.booking_id
      AND bookings.status = 'completed'
      AND (bookings.owner_id = (select auth.uid()) OR bookings.host_id = (select auth.uid()))
    )
  );

-- =====================================================
-- 8. OPTIMIZE RLS POLICIES - NOTIFICATIONS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- 9. OPTIMIZE RLS POLICIES - REPORTS TABLE
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
DROP POLICY IF EXISTS "Users can create reports" ON reports;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (reporter_id = (select auth.uid()));

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = (select auth.uid()));

-- =====================================================
-- 10. FIX FUNCTION SEARCH PATHS
-- =====================================================

-- Update generate_booking_number function with secure search_path
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN 'BK' || LPAD(nextval('booking_number_seq')::text, 8, '0');
END;
$$;

-- Update update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Update set_booking_number function with secure search_path
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number = generate_booking_number();
  END IF;
  RETURN NEW;
END;
$$;

-- =====================================================
-- VERIFICATION QUERIES (commented out for reference)
-- =====================================================

-- Verify indexes exist:
-- SELECT schemaname, tablename, indexname FROM pg_indexes 
-- WHERE tablename IN ('messages', 'notifications', 'reports', 'reviews')
-- ORDER BY tablename, indexname;

-- Verify RLS policies are optimized:
-- SELECT schemaname, tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('profiles', 'pets', 'bookings', 'messages', 'reviews', 'notifications', 'reports')
-- ORDER BY tablename, policyname;
