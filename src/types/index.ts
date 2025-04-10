export type ProductSize = 'short' | 'tall' | 'grande' | 'venti';

export type ProductCategory = 'coffee' | 'sweets' | 'accessory' | 'gift';

export type ProductTag = 'new' | 'popular' | 'sale' | 'seasonal' | 'limited';

export interface ProductAddition {
  id: string;
  name: string;
  price: number;
  maxQuantity: number;
}

export interface ProductCustomization {
  size?: ProductSize;
  sugar?: number;
  pahlava?: number;
  additions?: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: ProductCategory;
  image: string;
  tags: ProductTag[];
  rating: number;
  reviewCount: number;
  variations?: {
    size: ProductSize;
    price: number;
  }[];
  customizable: boolean;
  calories: {
    [key in ProductSize]?: number;
  };
  ingredients: string[];
  inStock: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization: ProductCustomization;
  totalPrice: number;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: UserRole;
  orders: Order[];
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shipping: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: 'card' | 'paypal' | 'other';
    transactionId: string;
  };
}

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc';
