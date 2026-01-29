import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';

// Get the API URL from environment or use sensible defaults
const getApiUrl = (): string => {
  // First check for explicit environment variable
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // For development, detect the platform and use appropriate URL
  if (__DEV__) {
    // Android emulator uses 10.0.2.2 to reach host machine's localhost
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5001';
    }
    // iOS simulator can use localhost
    if (Platform.OS === 'ios') {
      return 'http://localhost:5001';
    }
    // Web or other
    return 'http://localhost:5001';
  }

  // Production - should be set via EXPO_PUBLIC_API_URL
  return 'https://api.sherpamomo.com';
};

export const API_BASE_URL = getApiUrl();

// Get stored auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

// Helper for making authenticated requests
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = false
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error('Authentication required');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

// Products API
export const productsApi = {
  getAll: async () => {
    return apiRequest<any[]>('/api/products');
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/api/products/${id}`);
  },
};

// Orders API
export const ordersApi = {
  create: async (orderData: any) => {
    return apiRequest<any>(
      '/api/orders',
      {
        method: 'POST',
        body: JSON.stringify(orderData),
      },
      true // Require auth
    );
  },

  getUserOrders: async () => {
    return apiRequest<any[]>('/api/orders/user/orders', {}, true);
  },
};

// User API
export const userApi = {
  getProfile: async () => {
    return apiRequest<any>('/api/users/me', {}, true);
  },

  updateProfile: async (data: any) => {
    return apiRequest<any>(
      '/api/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      true
    );
  },
};
