'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Role, CartItem, Order, Notification, Product, OrderStatus } from '@/types';
import { initialOrders, initialNotifications } from '@/data/mock';
import { products as allProducts } from '@/data/products';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Notification) => void;
  sellerProducts: Product[];
  addSellerProduct: (product: Product) => void;
  updateSellerProduct: (productId: string, updates: Partial<Product>) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  savedSuppliers: string[];
  toggleSavedSupplier: (supplierId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('guest');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [sellerProducts, setSellerProducts] = useState<Product[]>(
    allProducts.filter((p) => p.supplierId === 'sup-1')
  );
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [savedSuppliers, setSavedSuppliers] = useState<string[]>(['sup-1', 'sup-2', 'sup-6']);

  useEffect(() => {
    setRoleState(loadFromStorage('horeca_role', 'guest' as Role));
    setIsLoggedIn(loadFromStorage('horeca_loggedIn', false));
    setCart(loadFromStorage('horeca_cart', [] as CartItem[]));
    setWishlist(loadFromStorage('horeca_wishlist', [] as string[]));
    setOrders(loadFromStorage('horeca_orders', initialOrders));
    setNotifications(loadFromStorage('horeca_notifications', initialNotifications));
    setSellerProducts(loadFromStorage('horeca_sellerProducts', allProducts.filter((p) => p.supplierId === 'sup-1')));
    setRecentlyViewed(loadFromStorage('horeca_recentlyViewed', [] as string[]));
    setSavedSuppliers(loadFromStorage('horeca_savedSuppliers', ['sup-1', 'sup-2', 'sup-6']));
  }, []);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    saveToStorage('horeca_role', r);
  }, []);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    saveToStorage('horeca_loggedIn', true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole('guest');
    saveToStorage('horeca_loggedIn', false);
  }, [setRole]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      let newCart: CartItem[];
      if (existing) {
        newCart = prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            supplierId: product.supplierId,
            supplierName: product.supplierName,
            price: product.price,
            unit: product.unit,
            moq: product.moq,
            quantity: Math.max(quantity, product.moq),
            image: product.image,
            category: product.category,
          },
        ];
      }
      saveToStorage('horeca_cart', newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId);
      saveToStorage('horeca_cart', newCart);
      return newCart;
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(quantity, 1) }
          : item
      );
      saveToStorage('horeca_cart', newCart);
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    saveToStorage('horeca_cart', []);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      saveToStorage('horeca_wishlist', newWishlist);
      return newWishlist;
    });
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => {
      const newOrders = [order, ...prev];
      saveToStorage('horeca_orders', newOrders);
      return newOrders;
    });
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => {
      const newOrders = prev.map((order) => {
        if (order.id !== orderId) return order;
        const statusOrder: OrderStatus[] = ['placed', 'accepted', 'packed', 'dispatched', 'delivered'];
        const currentIndex = statusOrder.indexOf(status);
        const newTimeline = order.timeline.map((event) => {
          const eventIndex = statusOrder.indexOf(event.status);
          if (eventIndex <= currentIndex && eventIndex >= 0) {
            return { ...event, completed: true, date: event.date || new Date().toISOString().split('T')[0] };
          }
          return event;
        });
        return {
          ...order,
          status,
          timeline: newTimeline,
          paymentStatus: status === 'rejected' || status === 'cancelled' ? 'refunded' : order.paymentStatus,
        };
      });
      saveToStorage('horeca_orders', newOrders);
      return newOrders;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const newNotifs = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage('horeca_notifications', newNotifs);
      return newNotifs;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const newNotifs = prev.map((n) => ({ ...n, read: true }));
      saveToStorage('horeca_notifications', newNotifs);
      return newNotifs;
    });
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const newNotifs = [notification, ...prev];
      saveToStorage('horeca_notifications', newNotifs);
      return newNotifs;
    });
  }, []);

  const addSellerProduct = useCallback((product: Product) => {
    setSellerProducts((prev) => {
      const newProducts = [product, ...prev];
      saveToStorage('horeca_sellerProducts', newProducts);
      return newProducts;
    });
  }, []);

  const updateSellerProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setSellerProducts((prev) => {
      const newProducts = prev.map((p) => (p.id === productId ? { ...p, ...updates } : p));
      saveToStorage('horeca_sellerProducts', newProducts);
      return newProducts;
    });
  }, []);

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const newRecent = [productId, ...filtered].slice(0, 10);
      saveToStorage('horeca_recentlyViewed', newRecent);
      return newRecent;
    });
  }, []);

  const toggleSavedSupplier = useCallback((supplierId: string) => {
    setSavedSuppliers((prev) => {
      const newSaved = prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId];
      saveToStorage('horeca_savedSuppliers', newSaved);
      return newSaved;
    });
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        orders,
        addOrder,
        updateOrderStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        sellerProducts,
        addSellerProduct,
        updateSellerProduct,
        recentlyViewed,
        addRecentlyViewed,
        savedSuppliers,
        toggleSavedSupplier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
