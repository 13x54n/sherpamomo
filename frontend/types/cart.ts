// types/cart.ts
import { products } from "@/lib/data";
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;       // "pcs", "jar", "container" etc.
  // Optional: you can add more later (description, category…)
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface CheckoutData {
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

export interface CheckoutResult {
  success: boolean;
  orderId?: string;
  message: string;
  order?: {
    id: string;
    orderId: string;
    total: number;
    status: string;
    createdAt: string;
  };
}

export interface CartContextValue {
  cart: CartState;
  addToCart: (product: typeof products[number], quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  checkout: (checkoutData?: CheckoutData) => Promise<CheckoutResult>;
}