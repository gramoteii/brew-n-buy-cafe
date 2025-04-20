
// Product-related types
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  customizable: boolean;
  calories: Calories;
  ingredients: string[];
  inStock: boolean;
  createdAt: string;
  variations?: ProductVariation[];
}

export type ProductCategory = 'coffee' | 'sweets' | 'accessory' | 'gift';
export type ProductSize = 'small' | 'medium' | 'large';

export interface ProductVariation {
  size: ProductSize;
  price: number;
}

export interface Calories {
  total: number;
  fat: number;
  protein: number;
  carbs: number;
}

export interface ProductCustomization {
  size?: ProductSize;
  sugar?: number;
  parvarda?: number;
}

// Cart-related types
export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
  customization: ProductCustomization;
}

// Order-related types
export interface OrderItem {
  product: Product;
  quantity: number;
  totalPrice: number;
  customization?: ProductCustomization;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
  userId?: string;
}

// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  orders?: Order[];
  createdAt?: string;
}

// Review-related types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Filter and sort types
export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';
