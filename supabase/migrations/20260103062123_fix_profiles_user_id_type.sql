/*
  # Fix profiles.user_id data type

  ## Changes
  - Drop all policies on profiles table that reference user_id
  - Drop foreign key constraint to auth.users  
  - Change user_id from uuid to text to work with local auth
  - Recreate simple permissive policies
*/

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow all operations on profiles" ON profiles;
DROP POLICY IF EXISTS "Public can view host profiles" ON profiles;

-- Drop the foreign key constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Change user_id column type from uuid to text
ALTER TABLE profiles ALTER COLUMN user_id TYPE text USING user_id::text;

-- Recreate permissive policy for local auth (no user_id reference)
CREATE POLICY "Allow all profile operations"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK (true);
