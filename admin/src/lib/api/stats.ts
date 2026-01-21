const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Types for API responses
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  revenueChange: number;
  orderChange: number;
  deliveredToday: number;
  orderStats: {
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    delivered: number;
    cancelled: number;
    completed: number;
    failed: number;
  };
  recentOrders: Array<{
    id: string;
    orderId: string;
    customer: string;
    total: number;
    status: string;
    date: string;
    updatedAt: string;
  }>;
}

export interface ProductStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  newProductsThisMonth: number;
  productsWithoutReviews: number;
  totalInventoryValue: number;
  averageRating: number;
  totalReviews: number;
  lowStockProducts: Array<{
    name: string;
    stock: number;
    category: string;
    price: number;
  }>;
  topRatedProducts: Array<{
    name: string;
    rating: number;
    reviewCount: number;
    category: string;
    price: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
    totalStock: number;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    totalValue: number;
  }>;
}

export interface UserStats {
  totalUsers: number;
  recentUsers: number;
  activeUsers: number;
  usersWithPhone: number;
  usersWithAddress: number;
  firebaseUsers: number;
  userGrowthRate: number;
  monthlyGrowth: Array<{
    month: string;
    users: number;
  }>;
  topLocations: Array<{
    location: string;
    count: number;
  }>;
}

export interface DashboardStats {
  orders: OrderStats;
  products: ProductStats;
  users: UserStats;
}

// API functions
export async function fetchOrderStats(): Promise<OrderStats> {
  const response = await fetch(`${API_BASE_URL}/api/orders/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch order stats');
  }
  return response.json();
}

export async function fetchProductStats(): Promise<ProductStats> {
  const response = await fetch(`${API_BASE_URL}/api/products/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch product stats');
  }
  return response.json();
}

export async function fetchUserStats(): Promise<UserStats> {
  const response = await fetch(`${API_BASE_URL}/api/users/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  return response.json();
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [orders, products, users] = await Promise.all([
      fetchOrderStats(),
      fetchProductStats(),
      fetchUserStats()
    ]);

    return {
      orders,
      products,
      users
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}