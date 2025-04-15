
import { Product } from '@/types';

export const sweetsProducts: Product[] = [
  {
    id: '6',
    name: 'Чизкейк',
    description: 'Нежный чизкейк с кремовой текстурой и песочным основанием.',
    shortDescription: 'Классический десерт к вашему кофе.',
    price: 250,
    category: 'sweets',
    image: '/images/products/cheesecake.jpg',
    tags: ['popular'],
    rating: 4.8,
    reviewCount: 92,
    calories: {
      small: 320,
    },
    ingredients: ['Сыр', 'Печенье', 'Сахар', 'Яйца'],
    customizable: false,
    inStock: true,
    createdAt: '2023-06-12T10:30:00Z',
  },
  {
    id: '7',
    name: 'Тирамису',
    description: 'Итальянский десерт с кофе, маскарпоне и какао.',
    shortDescription: 'Изысканный тирамису с кофейным ароматом.',
    price: 280,
    category: 'sweets',
    image: '/images/products/tiramisu.jpg',
    tags: ['popular', 'new'],
    rating: 4.9,
    reviewCount: 110,
    calories: {
      small: 350,
    },
    ingredients: ['Маскарпоне', 'Кофе', 'Какао', 'Печенье Савоярди'],
    customizable: false,
    inStock: true,
    createdAt: '2023-07-01T18:00:00Z',
  },
];
