import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface PromoDiscount {
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  description: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  appliedPromo: PromoDiscount | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  totalAmount: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'storex_cart_v1';
const FREE_SHIPPING_THRESHOLD = 99.0;
const STANDARD_SHIPPING_FEE = 9.99;

const VALID_PROMOS: Record<string, PromoDiscount> = {
  STOREX20: { code: 'STOREX20', type: 'fixed', value: 20, description: '$20 OFF on orders over $80' },
  WELCOME10: { code: 'WELCOME10', type: 'percent', value: 10, description: '10% OFF Storewide' },
  FREESHIP: { code: 'FREESHIP', type: 'fixed', value: 9.99, description: 'Free Standard Delivery' }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<PromoDiscount | null>(() => {
    try {
      const stored = localStorage.getItem('storex_promo');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem('storex_promo', JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem('storex_promo');
      }
    } catch (e) {
      console.error('Failed to persist promo:', e);
    }
  }, [appliedPromo]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is currently out of stock.`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock.`, 'error');
          return prev.map(item => item.product.id === product.id ? { ...item, quantity: product.stock } : item);
        }
        showToast(`Updated "${product.name}" quantity to ${nextQty}.`, 'success');
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: nextQty } : item);
      } else {
        const safeQty = Math.min(quantity, product.stock);
        showToast(`Added "${product.name}" to cart!`, 'success');
        return [...prev, { product, quantity: safeQty }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart.`, 'info');
      }
      return prev.filter(i => i.product.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    showToast('Shopping cart cleared.', 'info');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const isFreeShippingByAmount = subtotal >= FREE_SHIPPING_THRESHOLD;
  const isFreeShippingByPromo = appliedPromo?.code === 'FREESHIP';
  const shippingFee = cart.length === 0 || isFreeShippingByAmount || isFreeShippingByPromo ? 0 : STANDARD_SHIPPING_FEE;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'fixed') {
      discount = appliedPromo.code === 'FREESHIP' ? 0 : Math.min(appliedPromo.value, subtotal);
    } else if (appliedPromo.type === 'percent') {
      discount = (subtotal * appliedPromo.value) / 100;
    }
  }

  const totalAmount = Math.max(0, subtotal + shippingFee - discount);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const promo = VALID_PROMOS[cleanCode];

    if (!promo) {
      showToast('Invalid promo code. Try STOREX20 or WELCOME10', 'error');
      return { success: false, message: 'Invalid coupon code. Try "STOREX20" or "WELCOME10".' };
    }

    if (promo.code === 'STOREX20' && subtotal < 80) {
      showToast('STOREX20 requires a minimum subtotal of $80.', 'error');
      return { success: false, message: 'Code STOREX20 requires a minimum subtotal of $80.' };
    }

    setAppliedPromo(promo);
    showToast(`Promo code "${cleanCode}" applied: ${promo.description}`, 'success');
    return { success: true, message: `Coupon applied: ${promo.description}` };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Promo code removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        discount,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        remainingForFreeShipping
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
