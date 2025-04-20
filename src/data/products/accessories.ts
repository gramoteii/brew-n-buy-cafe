
import { Product } from '@/types';

export const accessoryProducts: Product[] = [
  {
    id: '8',
    name: 'Браслет "Кофейное зерно"',
    description: 'Стильный браслет с подвесками в виде кофейных зерен.',
    shortDescription: 'Аксессуар для настоящих кофеманов.',
    price: 450,
    category: 'accessory',
    image: '/images/products/coffee-bean-bracelet.jpg',
    tags: [],
    rating: 4.4,
    reviewCount: 45,
    calories: {
      total: 0,
      fat: 0,
      protein: 0,
      carbs: 0
    },
    ingredients: ['Металл', 'Кофейные зерна'],
    customizable: false,
    inStock: true,
    createdAt: '2023-08-20T13:45:00Z',
  },
  {
    id: '9',
    name: 'Кружка "Coffee & Delights"',
    description: 'Керамическая кружка с логотипом вашего любимого кафе.',
    shortDescription: 'Идеальная кружка для утреннего кофе.',
    price: 300,
    category: 'accessory',
    image: '/images/products/branded-mug.jpg',
    tags: ['popular'],
    rating: 4.6,
    reviewCount: 58,
    calories: {
      total: 0,
      fat: 0,
      protein: 0,
      carbs: 0
    },
    ingredients: ['Керамика'],
    customizable: false,
    inStock: true,
    createdAt: '2023-09-05T08:30:00Z',
  },
];
