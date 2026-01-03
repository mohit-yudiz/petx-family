// Local authentication service using localStorage

const STORAGE_KEYS = {
  USERS: 'petstay_users',
  CURRENT_USER: 'petstay_current_user',
  PROFILES: 'petstay_profiles',
};

const mockStorage = typeof window !== 'undefined' ? window.localStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type AuthError = {
  message: string;
};

export const authService = {
  signUp: async (email: string, password: string, userData: any) => {
    const users = JSON.parse(mockStorage.getItem(STORAGE_KEYS.USERS) || '[]');

    // Check if user already exists
    const existingUser = users.find((u: any) => u.email === email || u.phone === userData.phone);
    if (existingUser) {
      return {
        data: null,
        error: { message: 'User with this email or phone already exists' } as AuthError,
      };
    }

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: User = {
      id: userId,
      email,
      created_at: new Date().toISOString(),
    };

    // Create profile
    const profiles = JSON.parse(mockStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const newProfile = {
      id: `profile_${Date.now()}`,
      user_id: userId,
      email: userData.email,
      phone: userData.phone,
      first_name: userData.firstName,
      last_name: userData.lastName,
      profile_photo: null,
      dob: null,
      gender: null,
      city: '',
      area: '',
      bio: null,
      languages_spoken: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      active_role: 'owner',
      is_owner: true,
      is_host: false,
      travel_frequency: null,
      preferred_host_type: null,
      vet_name: null,
      vet_contact: null,
      has_own_pets: false,
      num_of_pets: 0,
      types_of_pets: null,
      pet_experience_years: null,
      home_type: null,
      has_open_space: false,
      has_children: false,
      max_pets_can_host: 0,
      provides_daily_updates: false,
      email_verified: true,
      phone_verified: true,
      profile_complete: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save user with password (in real app, hash the password!)
    users.push({ ...newUser, password });
    mockStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Save profile
    profiles.push(newProfile);
    mockStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

    // Set current user
    mockStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    return {
      data: { user: newUser },
      error: null,
    };
  },

  signIn: async (identifier: string, password: string) => {
    const users = JSON.parse(mockStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const profiles = JSON.parse(mockStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');

    // Check if identifier is email or phone
    let user;
    if (identifier.includes('@')) {
      user = users.find((u: any) => u.email === identifier && u.password === password);
    } else {
      const profile = profiles.find((p: any) => p.phone === identifier);
      if (profile) {
        user = users.find((u: any) => u.id === profile.user_id && u.password === password);
      }
    }

    if (!user) {
      return {
        data: null,
        error: { message: 'Invalid credentials' } as AuthError,
      };
    }

    // Set current user
    const { password: _, ...userWithoutPassword } = user;
    mockStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    return {
      data: { user: userWithoutPassword },
      error: null,
    };
  },

  getSession: async () => {
    const userStr = mockStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      return { data: { session: null }, error: null };
    }

    try {
      const user = JSON.parse(userStr);
      return {
        data: { session: { user } },
        error: null,
      };
    } catch {
      return { data: { session: null }, error: null };
    }
  },

  signOut: async () => {
    mockStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return { error: null };
  },
};
