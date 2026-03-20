export type Category = "Clothes" | "Shoes" | "Electronics";

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number;
  rating: number; // 0..5
  inStock: boolean;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO
};

export type PaymentMethod = "Card" | "UPI" | "Cash on Delivery";

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type OrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  userEmail: string;
  createdAt: string; // ISO
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  total: number;
};

