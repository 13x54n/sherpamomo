import apiRequest from './client';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
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
        status: 'pending' | 'completed' | 'failed';
        transactionId?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    customerInfo?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    paymentInfo?: {
        method: string;
        transactionId?: string;
    };
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

export interface OrdersResponse {
    orders: Order[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

// Create new order
export async function createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    return apiRequest<CreateOrderResponse>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
}

// Get order by order ID
export async function getOrder(orderId: string): Promise<Order> {
    return apiRequest<Order>(`/orders/${orderId}`);
}

// Get all orders with pagination (admin only)
export async function getOrders(filters: {
    status?: string;
    limit?: number;
    page?: number;
    sort?: string;
} = {}): Promise<OrdersResponse> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
        }
    });

    const queryString = params.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;

    return apiRequest<OrdersResponse>(endpoint);
}

// Update order status (admin only)
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    return apiRequest<Order>(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// Cancel order (customer)
export async function cancelOrder(orderId: string): Promise<{ message: string; order: Order }> {
    return apiRequest<{ message: string; order: Order }>(`/orders/${orderId}/cancel`, {
        method: 'PUT',
    });
}

// Get user orders (authenticated user only)
export async function getUserOrders(): Promise<Order[]> {
    return apiRequest<Order[]>('/orders/user/orders');
}