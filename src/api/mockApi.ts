import type {
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  User,
} from "../types";
import { PRODUCTS } from "../data/products";
import { readJSON, writeJSON } from "./storage";

type RegisterPayload = { name: string; email: string; password: string };

const LS_USER = "demo_user_v1";
const LS_CART = "demo_cart_v1";
const LS_ORDERS = "demo_orders_v1";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function productById(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(99, Math.floor(quantity)));
}

function getInitialCart(): Cart {
  return { items: [] };
}

function getCartFromStorage(): Cart {
  return readJSON<Cart>(LS_CART, getInitialCart());
}

function setCartToStorage(cart: Cart): void {
  writeJSON<Cart>(LS_CART, cart);
}

function getOrdersFromStorage(): Order[] {
  return readJSON<Order[]>(LS_ORDERS, []);
}

function setOrdersToStorage(orders: Order[]): void {
  writeJSON<Order[]>(LS_ORDERS, orders);
}

export function getUserFromStorage(): User | null {
  return readJSON<User | null>(LS_USER, null);
}

export async function createAccount(payload: RegisterPayload): Promise<User> {
  await sleep(randomBetween(350, 650));

  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();

  if (name.length < 2) throw new Error("Name is too short.");
  if (!email.includes("@")) throw new Error("Email looks invalid.");

  const user: User = {
    id: makeId("user"),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  writeJSON<User>(LS_USER, user);
  return user;
}

export async function searchProducts(query: string, category?: Category): Promise<Product[]> {
  await sleep(randomBetween(250, 520));

  const q = query.trim().toLowerCase();
  const base = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  if (!q) return base;

  return base.filter((p) => {
    const haystack = `${p.name} ${p.description}`.toLowerCase();
    return haystack.includes(q);
  });
}

export async function getCart(): Promise<Cart> {
  await sleep(randomBetween(100, 250));
  return getCartFromStorage();
}

export async function addToCart(productId: string, quantity = 1): Promise<Cart> {
  await sleep(randomBetween(200, 450));

  const product = productById(productId);
  if (!product) throw new Error("Product not found.");
  if (!product.inStock) throw new Error("Product is out of stock.");

  const q = clampQuantity(quantity);
  const cart = getCartFromStorage();
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) existing.quantity = clampQuantity(existing.quantity + q);
  else cart.items.push({ productId, quantity: q } satisfies CartItem);

  setCartToStorage(cart);
  return cart;
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  await sleep(randomBetween(200, 450));

  const product = productById(productId);
  if (!product) throw new Error("Product not found.");

  const q = clampQuantity(quantity);
  const cart = getCartFromStorage();
  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx === -1) throw new Error("Item is not in cart.");
  cart.items[idx].quantity = q;

  setCartToStorage(cart);
  return cart;
}

export async function deleteCartItem(productId: string): Promise<Cart> {
  await sleep(randomBetween(180, 420));

  const cart = getCartFromStorage();
  cart.items = cart.items.filter((i) => i.productId !== productId);
  setCartToStorage(cart);
  return cart;
}

function cartToOrderItems(cart: Cart): OrderItem[] {
  return cart.items
    .map((ci) => {
      const product = productById(ci.productId);
      if (!product) return null;
      return {
        productId: ci.productId,
        quantity: ci.quantity,
        unitPrice: product.price,
      } satisfies OrderItem;
    })
    .filter((x): x is OrderItem => x !== null);
}

export async function placeOrder(args: {
  userEmail: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
}): Promise<Order> {
  await sleep(randomBetween(350, 700));

  const userEmail = args.userEmail.trim().toLowerCase();
  if (!userEmail.includes("@")) throw new Error("User is not valid.");
  if (args.shippingAddress.trim().length < 6) throw new Error("Shipping address is too short.");

  const cart = getCartFromStorage();
  if (cart.items.length === 0) throw new Error("Cart is empty.");

  const items = cartToOrderItems(cart);
  const total = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const order: Order = {
    id: makeId("order"),
    userEmail,
    createdAt: new Date().toISOString(),
    status: "Processing",
    shippingAddress: args.shippingAddress.trim(),
    paymentMethod: args.paymentMethod,
    items,
    total,
  };

  const orders = getOrdersFromStorage();
  orders.unshift(order);
  setOrdersToStorage(orders);
  setCartToStorage(getInitialCart());

  return order;
}

export async function getOrdersForCurrentUser(userEmail: string): Promise<Order[]> {
  await sleep(randomBetween(160, 360));
  const email = userEmail.trim().toLowerCase();
  const orders = getOrdersFromStorage();
  return orders.filter((o) => o.userEmail === email);
}

export async function deleteOrder(orderId: string): Promise<Order[]> {
  await sleep(randomBetween(200, 420));
  const orders = getOrdersFromStorage().filter((o) => o.id !== orderId);
  setOrdersToStorage(orders);
  return orders;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  await sleep(randomBetween(200, 420));
  const orders = getOrdersFromStorage();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) throw new Error("Order not found.");
  orders[idx] = { ...orders[idx], status };
  setOrdersToStorage(orders);
  return orders[idx];
}

