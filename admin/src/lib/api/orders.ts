import apiRequest from './client';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'completed' | 'failed';
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentInfo?: {
    method: string;
    status: string;
    transactionId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Get all orders with pagination and filters
export async function getOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}): Promise<{ orders: Order[]; total: number; page: number; pages: number }> {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return apiRequest(`/orders?${searchParams.toString()}`);
}

// Get single order
export async function getOrder(orderId: string): Promise<Order> {
  return apiRequest(`/orders/${orderId}`);
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  return apiRequest(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

// Cancel order
export async function cancelOrder(orderId: string): Promise<{ message: string; order: Order }> {
  return apiRequest(`/orders/${orderId}/cancel`, {
    method: 'PUT',
  });
}

// Get order statistics
export async function getOrderStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredToday: number;
  recentOrders: Order[];
}> {
  return apiRequest('/orders/stats');
}