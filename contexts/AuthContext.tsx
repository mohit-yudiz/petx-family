'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, authService } from '@/lib/auth';
import { database, Profile } from '@/lib/database';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await database
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authService.getSession();
        const currentUser = session.data.session?.user;

        if (currentUser) {
          setUser(currentUser);
          await fetchProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth state changes
    const subscription = authService.onAuthStateChange(
      async (event, session: Session | null) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at,
            phone: session.user.phone,
            email_confirmed_at: session.user.email_confirmed_at,
            phone_confirmed_at: session.user.phone_confirmed_at,
          };
          setUser(currentUser);
          await fetchProfile(currentUser.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at,
            phone: session.user.phone,
            email_confirmed_at: session.user.email_confirmed_at,
            phone_confirmed_at: session.user.phone_confirmed_at,
          };
          setUser(currentUser);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await authService.signUp(email, password, userData);
      
      if (error) {
        return { error };
      }

      if (!data?.user) {
        return { error: { message: 'Failed to create user' } };
      }

      // Create profile in database
      const newProfile = {
        user_id: data.user.id,
        email: userData.email || email,
        phone: userData.phone || null,
        first_name: userData.firstName || '',
        last_name: userData.lastName || '',
        city: '',
        area: '',
        active_role: 'owner' as const,
        is_owner: true,
        is_host: false,
        has_own_pets: false,
        num_of_pets: 0,
        max_pets_can_host: 0,
        has_open_space: false,
        has_children: false,
        provides_daily_updates: false,
        email_verified: data.user.email_confirmed_at ? true : false,
        phone_verified: data.user.phone_confirmed_at ? true : false,
        profile_complete: false,
      };

      const { error: profileError } = await database
        .from('profiles')
        .insert(newProfile);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { error: profileError };
      }

      setUser(data.user);
      await fetchProfile(data.user.id);
      
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'An error occurred during sign up' } };
    }
  };

  const signIn = async (identifier: string, password: string) => {
    try {
      let email = identifier;

      // If identifier is a phone number, look up the email from profiles table
      if (!identifier.includes('@')) {
        const { data: profileData, error: profileError } = await database
          .from('profiles')
          .select('user_id, email')
          .eq('phone', identifier)
          .maybeSingle();

        if (profileError || !profileData) {
          return { error: { message: 'No user found with this phone number' } };
        }

        email = profileData.email;
      }

      // Sign in with Supabase Auth using email
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        return { error };
      }

      if (!data?.user) {
        return { error: { message: 'Invalid credentials' } };
      }

      setUser(data.user);
      await fetchProfile(data.user.id);
      
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'An error occurred during sign in' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
      setProfile(null);
      router.push('/login');
    } catch (err: any) {
      console.error('Error signing out:', err);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const { error } = await database
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) {
        return { error };
      }

      await fetchProfile(user.id);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || 'An error occurred while updating profile' } };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
