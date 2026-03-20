/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Cart, Order, OrderStatus, PaymentMethod, User } from "../types";
import { PRODUCTS } from "../data/products";
import * as mockApi from "../api/mockApi";

type ToastKind = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  kind: ToastKind;
};

type RegisterPayload = { name: string; email: string; password: string };

type DemoContextValue = {
  user: User | null;
  cart: Cart;
  orders: Order[];
  cartCount: number;
  cartTotal: number;
  loadingCart: boolean;
  loadingOrders: boolean;
  isPlacingOrder: boolean;
  toasts: Toast[];
  registerAccount: (payload: RegisterPayload) => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  deleteCartItem: (productId: string) => Promise<void>;
  placeOrder: (args: {
    shippingAddress: string;
    paymentMethod: PaymentMethod;
  }) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  signOut: () => void;
  pushToast: (message: string, kind?: ToastKind) => void;
};

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

function cartTotalFrom(cart: Cart): number {
  return cart.items.reduce((sum, it) => {
    const p = PRODUCTS.find((x) => x.id === it.productId);
    if (!p) return sum;
    return sum + p.price * it.quantity;
  }, 0);
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => mockApi.getUserFromStorage());
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [orders, setOrders] = useState<Order[]>([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const cartCount = useMemo(() => cart.items.reduce((sum, it) => sum + it.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cartTotalFrom(cart), [cart]);

  function pushToast(message: string, kind: ToastKind = "info") {
    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const toast: Toast = { id, message, kind };
    setToasts((prev) => [toast, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }

  async function refreshCart() {
    setLoadingCart(true);
    try {
      const next = await mockApi.getCart();
      setCart(next);
    } finally {
      setLoadingCart(false);
    }
  }

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setLoadingOrders(true);
    try {
      const next = await mockApi.getOrdersForCurrentUser(user.email);
      setOrders(next);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    void refreshCart();
  }, []);

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  async function registerAccount(payload: RegisterPayload) {
    try {
      const nextUser = await mockApi.createAccount(payload);
      setUser(nextUser);
      pushToast("Account created. Welcome!", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create account.";
      pushToast(msg, "error");
      throw err;
    }
  }

  async function addToCart(productId: string, quantity = 1) {
    try {
      const next = await mockApi.addToCart(productId, quantity);
      setCart(next);
      pushToast("Added to cart.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not add to cart.";
      pushToast(msg, "error");
      throw err;
    }
  }

  async function updateCartItem(productId: string, quantity: number) {
    try {
      const next = await mockApi.updateCartItem(productId, quantity);
      setCart(next);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update cart item.";
      pushToast(msg, "error");
      throw err;
    }
  }

  async function deleteCartItem(productId: string) {
    try {
      const next = await mockApi.deleteCartItem(productId);
      setCart(next);
      pushToast("Removed from cart.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not delete cart item.";
      pushToast(msg, "error");
      throw err;
    }
  }

  async function placeOrder(args: { shippingAddress: string; paymentMethod: PaymentMethod }) {
    if (!user) {
      pushToast("Please create an account to place orders.", "info");
      throw new Error("Not authenticated");
    }
    setIsPlacingOrder(true);
    try {
      await mockApi.placeOrder({
        userEmail: user.email,
        shippingAddress: args.shippingAddress,
        paymentMethod: args.paymentMethod,
      });
      await refreshOrders();
      await refreshCart();
      pushToast("Order placed successfully.", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not place order.";
      pushToast(msg, "error");
      throw err;
    } finally {
      setIsPlacingOrder(false);
    }
  }

  async function deleteOrder(orderId: string) {
    if (!user) throw new Error("Not authenticated");
    setLoadingOrders(true);
    try {
      await mockApi.deleteOrder(orderId);
      const next = await mockApi.getOrdersForCurrentUser(user.email);
      setOrders(next);
      pushToast("Order removed.", "success");
    } finally {
      setLoadingOrders(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!user) throw new Error("Not authenticated");
    setLoadingOrders(true);
    try {
      await mockApi.updateOrderStatus(orderId, status);
      const next = await mockApi.getOrdersForCurrentUser(user.email);
      setOrders(next);
      pushToast("Order updated.", "success");
    } finally {
      setLoadingOrders(false);
    }
  }

  function signOut() {
    localStorage.removeItem("demo_user_v1");
    setUser(null);
    setOrders([]);
    pushToast("Signed out.", "info");
  }

  const value: DemoContextValue = {
    user,
    cart,
    orders,
    cartCount,
    cartTotal,
    loadingCart,
    loadingOrders,
    isPlacingOrder,
    toasts,
    registerAccount,
    refreshCart,
    refreshOrders,
    addToCart,
    updateCartItem,
    deleteCartItem,
    placeOrder,
    deleteOrder,
    updateOrderStatus,
    signOut,
    pushToast,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}

