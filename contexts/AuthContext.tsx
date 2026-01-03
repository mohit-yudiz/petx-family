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
      setUser(data.user as User);
      await fetchProfile(data.user.id);
    }
    return { error };
  };

  const signIn = async (identifier: string, password: string) => {
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
