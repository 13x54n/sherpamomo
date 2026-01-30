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

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  ingredients?: string[];
  amount?: number;
  unit?: string;
  featured?: boolean;
  inStock?: boolean;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiRequest<ProductsResponse>('/api/products');
    return response.products;
  },

  getById: async (id: string): Promise<Product> => {
    return apiRequest<Product>(`/api/products/${id}`);
  },
};

// Order types
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
}

export interface CustomerInfo {
  name: string;
  email?: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface PaymentInfo {
  method: 'cash' | 'cash_on_delivery' | 'card';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'packaging' | 'delivered' | 'cancelled' | 'completed' | 'failed';
  customerInfo?: CustomerInfo;
  paymentInfo?: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
  order: {
    id: string;
    orderId: string;
    total: number;
    status: string;
    createdAt: string;
  };
}

// Orders API
export const ordersApi = {
  create: async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
    return apiRequest<CreateOrderResponse>(
      '/api/orders',
      {
        method: 'POST',
        body: JSON.stringify(orderData),
      },
      true // Require auth
    );
  },

  getUserOrders: async (): Promise<Order[]> => {
    return apiRequest<Order[]>('/api/orders/user/orders', {}, true);
  },

  getOrder: async (orderId: string): Promise<Order> => {
    return apiRequest<Order>(`/api/orders/${orderId}`);
  },

  cancelOrder: async (orderId: string): Promise<{ message: string; order: Order }> => {
    return apiRequest<{ message: string; order: Order }>(
      `/api/orders/${orderId}/cancel`,
      { method: 'PUT' },
      true
    );
  },
};

// User types
export interface UserProfile {
  id: string;
  firebaseUid?: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  authProvider?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

// User API
export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/api/users/me', {}, true);
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    return apiRequest<UpdateProfileResponse>(
      '/api/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      true
    );
  },
};
