"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { CartItem, CartState, CartContextValue, CheckoutData, CheckoutResult } from "@/types/cart";
import { products } from "@/lib/data";
import { toast } from "sonner";
import { createOrder } from "@/lib/api/orders";

const CART_STORAGE_KEY = "sherpamomo-cart";// make sure to implement dynamic key in future using backend

const defaultCart: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(defaultCart);
  const [isProcessingAdd, setIsProcessingAdd] = useState(false);

  // Hydrate from localStorage once (on mount)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsedItems: CartItem[] = JSON.parse(saved);
        setCart(calculateTotals(parsedItems));
      }
    } catch (err) {
      console.error("Failed to parse cart from localStorage", err);
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart.items));
  }, [cart.items]);

  function calculateTotals(items: CartItem[]): CartState {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { items, totalItems, subtotal };
  }

  const addToCart = (product: typeof products[number], qty = 1) => {
    // Validate that product has required fields
    if (!product.id) {
      console.error('Cannot add product to cart: missing ID', product);
      toast.error('Cannot add product to cart: invalid product data');
      return;
    }

    if (!product.name || !product.price) {
      console.error('Cannot add product to cart: missing required fields', product);
      toast.error('Cannot add product to cart: invalid product data');
      return;
    }

    // Prevent multiple simultaneous add operations
    if (isProcessingAdd) {
      return;
    }

    setIsProcessingAdd(true);

    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.id === product.id);
      const wasNewItem = existingIndex < 0;

      let updatedItems: CartItem[];

      if (existingIndex >= 0) {
        // already in cart → increase quantity
        updatedItems = prev.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        // new item
        const newCartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image,
          unit: product.unit,
        };
        updatedItems = [...prev.items, newCartItem];
      }

      const newCart = calculateTotals(updatedItems);

      // Show toast notification with correct information from the new cart state
      setTimeout(() => {
        if (wasNewItem) {
          toast.success(`${product.name} added to cart!`, {
            description: `${qty} ${product.unit} × $${product.price.toFixed(2)}`,
          });
        } else {
          const updatedItem = newCart.items.find(item => item.id === product.id);
          toast.success(`Updated ${product.name} quantity!`, {
            description: `Now ${updatedItem?.quantity} ${product.unit} in cart`,
          });
        }
        setIsProcessingAdd(false);
      }, 0);

      return newCart;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setCart((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      return calculateTotals(updatedItems);
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== id);
      return calculateTotals(updatedItems);
    });
  };

  const clearCart = () => {
    setCart(defaultCart);
  };

  const isInCart = (id: string) => {
    return cart.items.some((item) => item.id === id);
  };

  const checkout = async (checkoutData: CheckoutData = {}): Promise<CheckoutResult> => {
    if (cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty'
      };
    }

    try {
      // Convert cart items to order items format
      const orderItems = cart.items.map(item => {
        if (!item.id) {
          console.error('Cart item missing ID:', item);
          throw new Error(`Cart item missing ID: ${item.name}`);
        }
        return {
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          unit: item.unit
        };
      });

      const orderData = {
        items: orderItems,
        ...checkoutData
      };

      console.log('Order data being sent:', orderData);
      const response = await createOrder(orderData);

      // Clear cart after successful order
      clearCart();

      toast.success('Order placed successfully!', {
        description: `Order #${response.orderId} has been created.`,
      });

      return {
        success: true,
        orderId: response.orderId,
        message: response.message,
        order: response.order
      };
    } catch (error) {
      console.error('Checkout error:', error);
      const message = error instanceof Error ? error.message : 'Failed to place order';
      toast.error('Checkout failed', {
        description: message,
      });
      return {
        success: false,
        message
      };
    }
  };

  const value: CartContextValue = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}