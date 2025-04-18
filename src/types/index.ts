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
}

export type ProductCategory = 'coffee' | 'sweets' | 'accessory' | 'gift';

export interface Calories {
  total: number;
  fat: number;
  protein: number;
  carbs: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  orders?: Order[];
  createdAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
