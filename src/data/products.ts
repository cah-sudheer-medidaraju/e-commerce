import type { Category, Product } from "../types";

export const CATEGORIES_LIST: Category[] = ["Clothes", "Shoes", "Electronics"];

// Static product catalog (dummy data).
export const PRODUCTS: Product[] = [
  {
    id: "cloth-tshirt-001",
    name: "Everyday Cotton T-Shirt",
    category: "Clothes",
    description: "Soft, breathable cotton tee. Great for daily wear.",
    price: 19.99,
    rating: 4.6,
    inStock: true,
  },
  {
    id: "cloth-jeans-002",
    name: "Slim Fit Denim Jeans",
    category: "Clothes",
    description: "Comfort-stretch denim with a clean slim silhouette.",
    price: 49.5,
    rating: 4.4,
    inStock: true,
  },
  {
    id: "cloth-hoodie-003",
    name: "Fleece Zip Hoodie",
    category: "Clothes",
    description: "Warm fleece lining and smooth zip closure.",
    price: 59.0,
    rating: 4.7,
    inStock: true,
  },
  {
    id: "shoe-sneaker-101",
    name: "CloudRunner Sneakers",
    category: "Shoes",
    description: "Lightweight cushioning for everyday comfort.",
    price: 74.25,
    rating: 4.5,
    inStock: true,
  },
  {
    id: "shoe-boots-102",
    name: "Leather Chelsea Boots",
    category: "Shoes",
    description: "Classic boots with a durable, weather-ready build.",
    price: 119.99,
    rating: 4.3,
    inStock: true,
  },
  {
    id: "shoe-sandals-103",
    name: "Breeze Comfort Sandals",
    category: "Shoes",
    description: "Supportive straps and a cushioned footbed.",
    price: 29.99,
    rating: 4.2,
    inStock: true,
  },
  {
    id: "elec-headphones-201",
    name: "Studio Wireless Headphones",
    category: "Electronics",
    description: "Deep bass, clear vocals, and low-latency mode.",
    price: 129.0,
    rating: 4.6,
    inStock: true,
  },
  {
    id: "elec-smartwatch-202",
    name: "Pulse Smartwatch",
    category: "Electronics",
    description: "Fitness tracking, notifications, and bright display.",
    price: 159.75,
    rating: 4.4,
    inStock: true,
  },
  {
    id: "elec-charger-203",
    name: "PowerBank 20K mAh",
    category: "Electronics",
    description: "Fast charging with a compact travel-friendly design.",
    price: 39.9,
    rating: 4.1,
    inStock: true,
  },
];

export const PRODUCT_IDS = new Set(PRODUCTS.map((p) => p.id));

