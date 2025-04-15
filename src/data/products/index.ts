
import { coffeeProducts } from './coffee';
import { sweetsProducts } from './sweets';
import { accessoryProducts } from './accessories';
import { giftProducts } from './gifts';
import { Product } from '@/types';

export const products: Product[] = [
  ...coffeeProducts,
  ...sweetsProducts,
  ...accessoryProducts,
  ...giftProducts,
];

export * from './coffee';
export * from './sweets';
export * from './accessories';
export * from './gifts';
