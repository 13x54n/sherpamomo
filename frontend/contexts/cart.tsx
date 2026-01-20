"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { CartItem, CartState, CartContextValue } from "@/types/cart";
import { products } from "@/lib/data";
import { toast } from "sonner";

const CART_STORAGE_KEY = "sherpamomo-cart";// make sure to implement dynamic key in future using backend

const defaultCart: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(defaultCart);
  const lastToastRef = useRef<string | null>(null);

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
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.id === product.id);

      let updatedItems: CartItem[];
      let isNewItem = false;

      if (existingIndex >= 0) {
        // already in cart → increase quantity
        updatedItems = prev.items.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        // new item
        isNewItem = true;
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

      // Show toast notification only once using setTimeout to avoid React strict mode double calls
      setTimeout(() => {
        if (isNewItem) {
          toast.success(`${product.name} added to cart!`, {
            description: `${qty} ${product.unit} × $${product.price.toFixed(2)}`,
          });
        } else {
          const existingItem = newCart.items.find(item => item.id === product.id);
          toast.success(`Updated ${product.name} quantity!`, {
            description: `Now ${existingItem?.quantity} ${product.unit} in cart`,
          });
        }
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

  const value: CartContextValue = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
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