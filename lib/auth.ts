// Supabase authentication service

import { getSupabaseClient } from './database';
import type { User as SupabaseUser, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';

export type User = {
  id: string;
  email: string;
  created_at: string;
  phone?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
};

export type AuthError = {
  message: string;
};

// Helper to get Supabase client
function getClient() {
  return getSupabaseClient();
}

// Convert Supabase user to our User type
function convertSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    created_at: supabaseUser.created_at,
    phone: supabaseUser.phone,
    email_confirmed_at: supabaseUser.email_confirmed_at,
    phone_confirmed_at: supabaseUser.phone_confirmed_at,
  };
}

export const authService = {
  signUp: async (email: string, password: string, userData: any) => {
    try {
      const supabase = getClient();
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message } as AuthError,
        };
      }

      if (!data.user) {
        return {
          data: null,
          error: { message: 'Failed to create user' } as AuthError,
        };
      }

      return {
        data: { user: convertSupabaseUser(data.user), session: data.session },
        error: null,
      };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err.message || 'An error occurred during sign up' } as AuthError,
      };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const supabase = getClient();
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          data: null,
          error: { message: error.message } as AuthError,
        };
      }

      if (!data.user) {
        return {
          data: null,
          error: { message: 'Invalid credentials' } as AuthError,
        };
      }

      return {
        data: { user: convertSupabaseUser(data.user), session: data.session },
        error: null,
      };
    } catch (err: any) {
      return {
        data: null,
        error: { message: err.message || 'An error occurred during sign in' } as AuthError,
      };
    }
  },

  getSession: async () => {
    try {
      const supabase = getClient();
      
      // Get current session from Supabase
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return { data: { session: null }, error };
      }

      if (!data.session || !data.session.user) {
        return { data: { session: null }, error: null };
      }

      return {
        data: {
          session: {
            user: convertSupabaseUser(data.session.user),
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          },
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: { session: null },
        error: { message: err.message || 'Failed to get session' },
      };
    }
  },

  signOut: async () => {
    try {
      const supabase = getClient();
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (err: any) {
      return {
        error: { message: err.message || 'An error occurred during sign out' },
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    const supabase = getClient();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return { data };
  },
};
