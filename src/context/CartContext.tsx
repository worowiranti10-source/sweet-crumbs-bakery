import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Promo } from '../types';
import { dataService } from '../services/dataService';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  appliedPromo: Promo | null;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  subtotal: number;
  discount: number;
  total: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sweet_crumbs_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    // Generate distinct ID based on product ID and selected variants
    const variantKey = JSON.stringify(newItem.variantSelected);
    const existingIndex = cart.findIndex(
      (item) => item.productId === newItem.productId && JSON.stringify(item.variantSelected) === variantKey
    );

    if (existingIndex > -1) {
      // Update quantity
      setCart((prev) =>
        prev.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + newItem.quantity, notes: newItem.notes || item.notes }
            : item
        )
      );
    } else {
      const lineItemId = `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setCart((prev) => [...prev, { ...newItem, id: lineItemId }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: Math.min(newQty, 99) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discount = appliedPromo && subtotal >= appliedPromo.minPurchase
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const total = Math.max(0, subtotal - discount);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Silakan masukkan kode voucher promo.' };
    }

    const promos = await dataService.getPromos();
    const found = promos.find((p) => p.code.toUpperCase() === cleanCode && p.isActive);

    if (!found) {
      return { success: false, message: 'Kode voucher tidak valid atau telah kedaluwarsa.' };
    }

    if (subtotal < found.minPurchase) {
      const minFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(found.minPurchase);
      return { success: false, message: `Minimal belanja untuk promo ini adalah ${minFormatted}.` };
    }

    setAppliedPromo(found);
    return { success: true, message: `Voucher ${found.code} berhasil digunakan! Hemat ${found.discountPercent}%.` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        subtotal,
        discount,
        total,
        totalItems,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
