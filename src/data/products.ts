import { Product, ProductSize } from '../types';

export const sizeTranslations: Record<string, string> = {
  small: 'Маленький',
  medium: 'Стандартный',
  large: 'Большой',
};

export const productAdditions = {
  sugar: {
    id: 'sugar',
    name: 'Кубики сахара',
    price: 5,
    maxQuantity: 5,
  },
  parvarda: {
    id: 'parvarda',
    name: 'Парварда',
    price: 15,
    maxQuantity: 5,
  },
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Эспрессо',
    description: 'Насыщенный и ароматный кофе, приготовленный под высоким давлением.',
    shortDescription: 'Классический эспрессо для настоящих ценителей.',
    price: 120,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1557821552-1710549b6a91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['popular'],
    rating: 4.5,
    reviewCount: 62,
    variations: [
      { size: 'small', price: 120 },
      { size: 'medium', price: 150 },
      { size: 'large', price: 180 },
    ],
    customizable: true,
    calories: {
      small: 68,
      medium: 80,
      large: 95,
    },
    ingredients: ['Кофе', 'Вода'],
    inStock: true,
    createdAt: '2023-01-01T12:00:00Z',
  },
  {
    id: '2',
    name: 'Капучино',
    description: 'Эспрессо с добавлением вспененного молока, посыпанный какао.',
    shortDescription: 'Нежный капучино с воздушной пенкой.',
    price: 160,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab778?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['popular', 'new'],
    rating: 4.7,
    reviewCount: 88,
    variations: [
      { size: 'small', price: 160 },
      { size: 'medium', price: 190 },
      { size: 'large', price: 220 },
    ],
    customizable: true,
    calories: {
      small: 120,
      medium: 150,
      large: 180,
    },
    ingredients: ['Кофе', 'Молоко', 'Какао'],
    inStock: true,
    createdAt: '2023-02-15T14:30:00Z',
  },
  {
    id: '3',
    name: 'Латте',
    description: 'Мягкий и кремовый кофе с большим количеством молока.',
    shortDescription: 'Идеальный выбор для любителей молочного кофе.',
    price: 160,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['popular'],
    rating: 4.3,
    reviewCount: 54,
    variations: [
      { size: 'small', price: 160 },
      { size: 'medium', price: 190 },
      { size: 'large', price: 220 },
    ],
    customizable: true,
    calories: {
      small: 150,
      medium: 180,
      large: 210,
    },
    ingredients: ['Кофе', 'Молоко'],
    inStock: true,
    createdAt: '2023-03-01T09:00:00Z',
  },
  {
    id: '4',
    name: 'Американо',
    description: 'Эспрессо, разбавленный горячей водой, для более мягкого вкуса.',
    shortDescription: 'Простой и понятный американо.',
    price: 120,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1509042231743-f4e697090bb9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: [],
    rating: 4.1,
    reviewCount: 32,
    variations: [
      { size: 'small', price: 120 },
      { size: 'medium', price: 150 },
      { size: 'large', price: 180 },
    ],
    customizable: true,
    calories: {
      small: 50,
      medium: 60,
      large: 70,
    },
    ingredients: ['Кофе', 'Вода'],
    inStock: true,
    createdAt: '2023-04-10T11:15:00Z',
  },
  {
    id: '5',
    name: 'Моккачино',
    description: 'Сладкий кофейный напиток с шоколадом и взбитыми сливками.',
    shortDescription: 'Наслаждение для сладкоежек.',
    price: 200,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1551632436-c6b807ca3a9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['new'],
    rating: 4.6,
    reviewCount: 75,
    variations: [
      { size: 'small', price: 200 },
      { size: 'medium', price: 230 },
      { size: 'large', price: 260 },
    ],
    customizable: true,
    calories: {
      small: 250,
      medium: 300,
      large: 350,
    },
    ingredients: ['Кофе', 'Молоко', 'Шоколад', 'Сливки'],
    inStock: true,
    createdAt: '2023-05-01T16:45:00Z',
  },
  {
    id: '6',
    name: 'Чизкейк',
    description: 'Нежный чизкейк с кремовой текстурой и песочным основанием.',
    shortDescription: 'Классический десерт к вашему кофе.',
    price: 250,
    category: 'sweets',
    image: 'https://images.unsplash.com/photo-1606906735419-c99c42e9c74e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    image: 'https://images.unsplash.com/photo-1630737444984-f99a111563c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
  {
    id: '8',
    name: 'Браслет "Кофейное зерно"',
    description: 'Стильный браслет с подвесками в виде кофейных зерен.',
    shortDescription: 'Аксессуар для настоящих кофеманов.',
    price: 450,
    category: 'accessory',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: [],
    rating: 4.4,
    reviewCount: 45,
    calories: {
      small: 0,
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
    image: 'https://images.unsplash.com/photo-1556715185-714349e68ca4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['popular'],
    rating: 4.6,
    reviewCount: 58,
    calories: {
      small: 0,
    },
    ingredients: ['Керамика'],
    customizable: false,
    inStock: true,
    createdAt: '2023-09-05T08:30:00Z',
  },
  {
    id: '10',
    name: 'Подарочный набор "Кофейный гурман"',
    description: 'Набор из разных сортов кофе, идеально подходящий для подарка.',
    shortDescription: 'Отличный подарок для ценителей кофе.',
    price: 950,
    category: 'gift',
    image: 'https://images.unsplash.com/photo-1543539308-9198179ff19c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['new'],
    rating: 4.7,
    reviewCount: 68,
    calories: {
      small: 0,
    },
    ingredients: ['Кофе разных сортов'],
    customizable: false,
    inStock: true,
    createdAt: '2023-10-15T15:00:00Z',
  },
  {
    id: '11',
    name: 'Кофе в зернах "Arabica Premium"',
    description: 'Отборные зерна арабики для приготовления идеального эспрессо.',
    shortDescription: 'Премиальный кофе для истинных ценителей.',
    price: 700,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1509003638349-d5972539c17e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: ['popular'],
    rating: 4.8,
    reviewCount: 80,
    calories: {
      small: 0,
    },
    ingredients: ['Зерна арабики'],
    customizable: false,
    inStock: true,
    createdAt: '2023-11-01T09:45:00Z',
  },
  {
    id: '12',
    name: 'Сироп "Карамель"',
    description: 'Сладкий карамельный сироп для добавления в кофе и десерты.',
    shortDescription: 'Придайте вашему напитку карамельный вкус.',
    price: 200,
    category: 'accessory',
    image: 'https://images.unsplash.com/photo-1622287534741-c1a15884a5a0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tags: [],
    rating: 4.5,
    reviewCount: 42,
    calories: {
      small: 0,
    },
    ingredients: ['Сахар', 'Вода', 'Ароматизатор'],
    customizable: false,
    inStock: true,
    createdAt: '2023-12-10T14:00:00Z',
  },
];
