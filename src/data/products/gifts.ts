
import { Product } from '@/types';

export const giftProducts: Product[] = [
  {
    id: '10',
    name: 'Подарочный набор "Кофейный гурман"',
    description: 'Набор из разных сортов кофе, идеально подходящий для подарка.',
    shortDescription: 'Отличный подарок для ценителей кофе.',
    price: 950,
    category: 'gift',
    image: '/images/products/coffee-gift-set.jpg',
    tags: ['new'],
    rating: 4.7,
    reviewCount: 68,
    calories: {
      total: 0,
      fat: 0,
      protein: 0,
      carbs: 0
    },
    ingredients: ['Кофе разных сортов'],
    customizable: false,
    inStock: true,
    createdAt: '2023-10-15T15:00:00Z',
  },
];
