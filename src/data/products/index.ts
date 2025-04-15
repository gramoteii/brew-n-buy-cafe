
import { coffeeProducts } from './coffee';
import { sweetsProducts } from './sweets';
import { accessoryProducts } from './accessories';
import { giftProducts } from './gifts';
import { Product } from '@/types';

// Load products from localStorage or use initial products as fallback
const loadProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('admin_products');
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  const initialProducts = [
    ...coffeeProducts,
    ...sweetsProducts,
    ...accessoryProducts,
    ...giftProducts,
  ];
  localStorage.setItem('admin_products', JSON.stringify(initialProducts));
  return initialProducts;
};

export const products = loadProducts();

export * from './coffee';
export * from './sweets';
export * from './accessories';
export * from './gifts';
