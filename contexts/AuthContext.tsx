'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authService } from '@/lib/auth';
import { database, Profile } from '@/lib/database';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    const session = await authService.getSession();
    const currentUser = session.data.session?.user;

    if (currentUser) {
      setUser(currentUser as User);
      await fetchProfile(currentUser.id);
    }
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await database
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setProfile(data as Profile);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await authService.signUp(email, password, userData);
    if (!error && data?.user) {
      const newProfile = {
        user_id: data.user.id,
        email: userData.email,
        phone: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
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
        email_verified: true,
        phone_verified: true,
        profile_complete: false,
      };

      const { error: profileError } = await database
        .from('profiles')
        .insert(newProfile);

      if (profileError) {
        return { error: profileError };
      }

      setUser(data.user as User);
      await fetchProfile(data.user.id);
    }
    return { error };
  };

  const signIn = async (identifier: string, password: string) => {
    // If identifier is a phone number, look up the user_id from Supabase first
    if (!identifier.includes('@')) {
      const { data: profileData } = await database
        .from('profiles')
        .select('user_id, email')
        .eq('phone', identifier)
        .maybeSingle();

      if (!profileData) {
        return { error: { message: 'No user found with this phone number' } };
      }

      // Now sign in with the email
      const { data, error } = await authService.signIn(profileData.email, password);
      if (!error && data?.user) {
        setUser(data.user as User);
        await fetchProfile(data.user.id);
      }
      return { error };
    }

    // Email login
    const { data, error } = await authService.signIn(identifier, password);
    if (!error && data?.user) {
      setUser(data.user as User);
      await fetchProfile(data.user.id);
    }
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    router.push('/login');
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'No user logged in' } };

    const { error } = await database
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (!error) {
      await fetchProfile(user.id);
    }

    return { error };
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
