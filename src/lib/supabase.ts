import {
  MOCK_CATEGORIES,
  MOCK_STATES,
  MOCK_DISTRICTS,
  MOCK_MINISTRIES,
  MOCK_DOCUMENTS,
  MOCK_SCHEMES,
  MOCK_SCHOLARSHIPS,
  MOCK_SERVICES,
  MOCK_POLICIES,
  MOCK_BLOGS,
  MOCK_NOTIFICATIONS
} from './mockData';

export const isSupabaseConfigured = true; // Always true to bypass configuration warnings

// Mock user store in local storage
function getMockUser() {
  const email = localStorage.getItem('mock_user_email');
  if (!email) return null;
  return {
    id: localStorage.getItem('mock_user_id') || 'mock-user-123',
    email,
    user_metadata: {
      full_name: localStorage.getItem('mock_user_name') || 'Guest User'
    }
  };
}

function saveMockUser(email: string, fullName: string = 'User') {
  const id = 'mock-user-' + Math.floor(Math.random() * 100000);
  localStorage.setItem('mock_user_email', email);
  localStorage.setItem('mock_user_id', id);
  localStorage.setItem('mock_user_name', fullName);
  return { id, email, user_metadata: { full_name: fullName } };
}

function clearMockUser() {
  localStorage.removeItem('mock_user_email');
  localStorage.removeItem('mock_user_id');
  localStorage.removeItem('mock_user_name');
  localStorage.removeItem('mock_user_profile');
}

function getMockProfile() {
  const stored = localStorage.getItem('mock_user_profile');
  if (stored) return JSON.parse(stored);
  
  const email = localStorage.getItem('mock_user_email') || 'guest@example.com';
  const name = localStorage.getItem('mock_user_name') || 'Guest User';
  const id = localStorage.getItem('mock_user_id') || 'mock-user-123';
  
  const defaultProfile = {
    id,
    email,
    full_name: name,
    phone: '9876543210',
    avatar_url: null,
    role: 'user',
    preferred_language: 'en',
    accessibility_mode: false,
    high_contrast: false,
    large_fonts: false,
    is_guest: false,
    age: 25,
    gender: 'Male',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    occupation: 'Student',
    annual_income: 150000,
    caste: 'General',
    religion: 'Hindu',
    disability: false,
    education: 'Graduate',
    veteran: false,
    farmer: false,
    student: true,
    business_owner: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  localStorage.setItem('mock_user_profile', JSON.stringify(defaultProfile));
  return defaultProfile;
}

// Map table names to data sources
function getMockTableData(tableName: string): any[] {
  switch (tableName) {
    case 'schemes': return MOCK_SCHEMES;
    case 'scholarships': return MOCK_SCHOLARSHIPS;
    case 'citizen_services': return MOCK_SERVICES;
    case 'policies': return MOCK_POLICIES;
    case 'blogs': return MOCK_BLOGS;
    case 'notifications': return MOCK_NOTIFICATIONS;
    case 'categories': return MOCK_CATEGORIES;
    case 'states': return MOCK_STATES;
    case 'districts': return MOCK_DISTRICTS;
    case 'ministries': return MOCK_MINISTRIES;
    case 'documents_master': return MOCK_DOCUMENTS;
    case 'profiles': return [getMockProfile()];
    default: return [];
  }
}

class MockSupabaseQuery {
  private tableName: string;
  private data: any[];

  constructor(tableName: string) {
    this.tableName = tableName;
    this.data = [...getMockTableData(tableName)];
  }

  select(columns: string = '*') {
    return this;
  }

  eq(column: string, value: any) {
    if (column === 'id' || column === 'slug') {
      this.data = this.data.filter(item => String(item[column]) === String(value));
    } else if (column === 'published') {
      this.data = this.data.filter(item => item.published === value);
    } else if (column === 'state_id') {
      this.data = this.data.filter(item => item.state_id === Number(value));
    }
    return this;
  }

  order(column: string, options?: { ascending: boolean }) {
    return this;
  }

  limit(num: number) {
    this.data = this.data.slice(0, num);
    return this;
  }

  maybeSingle() {
    return Promise.resolve({
      data: this.data.length > 0 ? this.data[0] : null,
      error: null
    });
  }

  single() {
    return Promise.resolve({
      data: this.data.length > 0 ? this.data[0] : null,
      error: null
    });
  }

  then(onfulfilled: (value: any) => any) {
    return Promise.resolve({
      data: this.data,
      error: null
    }).then(onfulfilled);
  }

  insert(record: any) {
    const updated = Array.isArray(record) ? record : [record];
    if (this.tableName === 'profiles') {
      const current = getMockProfile();
      const newProfile = { ...current, ...updated[0], updated_at: new Date().toISOString() };
      localStorage.setItem('mock_user_profile', JSON.stringify(newProfile));
      return Promise.resolve({ data: newProfile, error: null });
    }
    return Promise.resolve({ data: updated, error: null });
  }

  update(record: any) {
    if (this.tableName === 'profiles') {
      const current = getMockProfile();
      const newProfile = { ...current, ...record, updated_at: new Date().toISOString() };
      localStorage.setItem('mock_user_profile', JSON.stringify(newProfile));
      return Promise.resolve({ data: newProfile, error: null });
    }
    return Promise.resolve({ data: record, error: null });
  }

  delete() {
    return this;
  }
}

export const supabase = {
  from: (tableName: string) => {
    return new MockSupabaseQuery(tableName);
  },
  auth: {
    getSession: () => {
      const mockUser = getMockUser();
      const session = mockUser ? { user: mockUser, access_token: 'mock-token' } : null;
      return Promise.resolve({
        data: { session },
        error: null
      });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const mockUser = getMockUser();
      const session = mockUser ? { user: mockUser, access_token: 'mock-token' } : null;
      setTimeout(() => callback('SIGNED_IN', session), 0);
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: ({ email }: { email: string }) => {
      const user = saveMockUser(email);
      return Promise.resolve({ data: { user }, error: null });
    },
    signUp: ({ email, options }: any) => {
      const fullName = options?.data?.full_name || '';
      const user = saveMockUser(email, fullName);
      return Promise.resolve({ data: { user }, error: null });
    },
    signInWithOAuth: () => {
      const user = saveMockUser('google.user@example.com', 'Google User');
      return Promise.resolve({ data: { user }, error: null });
    },
    signInWithOtp: () => Promise.resolve({ data: {}, error: null }),
    verifyOtp: ({ phone }: any) => {
      const user = saveMockUser(phone + '@phone.com', 'Phone User');
      return Promise.resolve({ data: { user }, error: null });
    },
    signOut: () => {
      clearMockUser();
      return Promise.resolve({ error: null });
    }
  }
} as any;
