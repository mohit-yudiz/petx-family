// Local database service using localStorage

const STORAGE_KEYS = {
  PROFILES: 'petstay_profiles',
  PETS: 'petstay_pets',
  BOOKINGS: 'petstay_bookings',
  MESSAGES: 'petstay_messages',
  NOTIFICATIONS: 'petstay_notifications',
  REVIEWS: 'petstay_reviews',
  HOST_AVAILABILITY: 'petstay_host_availability',
};

const mockStorage = typeof window !== 'undefined' ? window.localStorage : {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

type QueryBuilder<T> = {
  select: (columns?: string) => QueryBuilder<T>;
  insert: (data: any) => QueryBuilder<T>;
  update: (data: any) => QueryBuilder<T>;
  delete: () => QueryBuilder<T>;
  eq: (field: string, value: any) => QueryBuilder<T>;
  neq: (field: string, value: any) => QueryBuilder<T>;
  in: (field: string, values: any[]) => QueryBuilder<T>;
  contains: (field: string, value: any) => QueryBuilder<T>;
  order: (field: string, options?: { ascending?: boolean }) => QueryBuilder<T>;
  limit: (count: number) => QueryBuilder<T>;
  maybeSingle: () => Promise<{ data: T | null; error: any }>;
  single: () => Promise<{ data: T | null; error: any }>;
  then: (resolve: (value: { data: T[] | null; error: any }) => void) => void;
};

function createQueryBuilder<T>(tableName: string): QueryBuilder<T> {
  let operation = 'select';
  let filters: Array<{ type: string; field: string; value: any }> = [];
  let insertData: any = null;
  let updateData: any = null;
  let orderField: string | null = null;
  let orderAsc = true;
  let limitCount: number | null = null;

  const builder: QueryBuilder<T> = {
    select: (columns?: string) => {
      operation = 'select';
      return builder;
    },

    insert: (data: any) => {
      operation = 'insert';
      insertData = data;
      return builder;
    },

    update: (data: any) => {
      operation = 'update';
      updateData = data;
      return builder;
    },

    delete: () => {
      operation = 'delete';
      return builder;
    },

    eq: (field: string, value: any) => {
      filters.push({ type: 'eq', field, value });
      return builder;
    },

    neq: (field: string, value: any) => {
      filters.push({ type: 'neq', field, value });
      return builder;
    },

    in: (field: string, values: any[]) => {
      filters.push({ type: 'in', field, value: values });
      return builder;
    },

    contains: (field: string, value: any) => {
      filters.push({ type: 'contains', field, value });
      return builder;
    },

    order: (field: string, options?: { ascending?: boolean }) => {
      orderField = field;
      orderAsc = options?.ascending !== false;
      return builder;
    },

    limit: (count: number) => {
      limitCount = count;
      return builder;
    },

    maybeSingle: async () => {
      const result = await executeQuery();
      if (result.error) return { data: null, error: result.error };
      return { data: result.data?.[0] || null, error: null };
    },

    single: async () => {
      const result = await executeQuery();
      if (result.error) return { data: null, error: result.error };
      if (!result.data || result.data.length === 0) {
        return { data: null, error: { message: 'No rows found' } };
      }
      return { data: result.data[0], error: null };
    },

    then: (resolve: (value: { data: T[] | null; error: any }) => void) => {
      executeQuery().then(resolve);
    },
  };

  async function executeQuery(): Promise<{ data: T[] | null; error: any }> {
    try {
      const storageKey = (STORAGE_KEYS as any)[tableName.toUpperCase().replace(/-/g, '_')];
      if (!storageKey) {
        return { data: null, error: { message: `Unknown table: ${tableName}` } };
      }

      let items = JSON.parse(mockStorage.getItem(storageKey) || '[]');

      if (operation === 'insert') {
        const newItem = {
          id: `${tableName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...insertData,
          created_at: insertData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        items.push(newItem);
        mockStorage.setItem(storageKey, JSON.stringify(items));
        return { data: [newItem], error: null };
      }

      // Apply filters
      items = items.filter((item: any) => {
        return filters.every(filter => {
          if (filter.type === 'eq') {
            return item[filter.field] === filter.value;
          }
          if (filter.type === 'neq') {
            return item[filter.field] !== filter.value;
          }
          if (filter.type === 'in') {
            return filter.value.includes(item[filter.field]);
          }
          if (filter.type === 'contains') {
            const itemValue = item[filter.field];
            if (Array.isArray(itemValue)) {
              return itemValue.some(v =>
                Array.isArray(filter.value)
                  ? filter.value.includes(v)
                  : v === filter.value
              );
            }
            return false;
          }
          return true;
        });
      });

      if (operation === 'update') {
        const allItems = JSON.parse(mockStorage.getItem(storageKey) || '[]');
        const updatedItems = allItems.map((item: any) => {
          const shouldUpdate = filters.every(filter => {
            if (filter.type === 'eq') return item[filter.field] === filter.value;
            if (filter.type === 'neq') return item[filter.field] !== filter.value;
            return true;
          });
          if (shouldUpdate) {
            return { ...item, ...updateData, updated_at: new Date().toISOString() };
          }
          return item;
        });
        mockStorage.setItem(storageKey, JSON.stringify(updatedItems));
        return { data: items.map((item: any) => ({ ...item, ...updateData })), error: null };
      }

      if (operation === 'delete') {
        const allItems = JSON.parse(mockStorage.getItem(storageKey) || '[]');
        const remainingItems = allItems.filter((item: any) => {
          return !filters.every(filter => {
            if (filter.type === 'eq') return item[filter.field] === filter.value;
            return true;
          });
        });
        mockStorage.setItem(storageKey, JSON.stringify(remainingItems));
        return { data: [], error: null };
      }

      // Apply ordering
      if (orderField) {
        items.sort((a: any, b: any) => {
          const aVal = a[orderField as string];
          const bVal = b[orderField as string];
          if (aVal < bVal) return orderAsc ? -1 : 1;
          if (aVal > bVal) return orderAsc ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (limitCount !== null) {
        items = items.slice(0, limitCount);
      }

      return { data: items, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  return builder;
}

export const database = {
  from: <T = any>(tableName: string): QueryBuilder<T> => {
    return createQueryBuilder<T>(tableName);
  },
};

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
