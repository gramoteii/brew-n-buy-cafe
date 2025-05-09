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
    calories: {
      total: 320,
      fat: 18,
      protein: 7,
      carbs: 28
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
    calories: {
      total: 350,
      fat: 21,
      protein: 6,
      carbs: 33
    },
    ingredients: ['Маскарпоне', 'Кофе', 'Какао', 'Печенье Савоярди'],
    customizable: false,
    inStock: true,
    createdAt: '2023-07-01T18:00:00Z',
  },
  {
    id: '8',
    name: 'Курабье',
    description: 'Традиционная сладость крымских татар, состоящая из топленого сливочного масла, сахарной пудры и муки. Простое и очень вкусное печенье с идеальным соотношением ингредиентов 1:1:1.',
    shortDescription: 'Классическое крымскотатарское печенье',
    price: 180,
    category: 'sweets',
    image: '/images/products/kurabiye.jpg',
    tags: ['traditional'],
    calories: {
      total: 250,
      fat: 15,
      protein: 3,
      carbs: 30
    },
    ingredients: ['Топленое сливочное масло', 'Сахарная пудра', 'Мука'],
    customizable: false,
    inStock: true,
    createdAt: '2024-04-13T08:20:00Z',
  },
  {
    id: '9',
    name: 'Пахлава',
    description: 'Легендарная крымскотатарская сладость с тонкими слоями теста, пропитанными медовым сиропом, с начинкой из орехов и пряностей. Хрустящая, ароматная и невероятно вкусная восточный деликатес!',
    shortDescription: 'Восточный десерт с медовым сиропом',
    price: 320,
    category: 'sweets',
    image: '/images/products/baklava.jpg',
    tags: ['traditional', 'popular'],
    calories: {
      total: 400,
      fat: 22,
      protein: 8,
      carbs: 45
    },
    ingredients: ['Слоеное тесто', 'Мед', 'Орехи', 'Пряности'],
    customizable: false,
    inStock: true,
    createdAt: '2024-04-13T08:25:00Z',
  },
  {
    id: '10',
    name: 'Рахат-лукум',
    description: 'Нежная восточная сладость, тающая во рту. Ароматные кубики из сахара, крахмала и розовой воды с добавлением орехов или фруктов. Легкий, воздушный и в меру сладкий – настоящий праздник вкуса!',
    shortDescription: 'Восточная сладость с розовой водой',
    price: 220,
    category: 'sweets',
    image: '/images/products/turkish-delight.jpg',
    tags: ['traditional'],
    calories: {
      total: 200,
      fat: 1,
      protein: 1,
      carbs: 48
    },
    ingredients: ['Сахар', 'Крахмал', 'Розовая вода', 'Орехи'],
    customizable: false,
    inStock: true,
    createdAt: '2024-04-13T08:26:00Z',
  },
  {
    id: '11',
    name: 'Пишмание',
    description: 'Воздушная крымскотатарская сладость, похожая на сахарную вату, но с неповторимым вкусом! Нежные нити карамелизированной муки, сливочного масла и меда, тающие во рту. Легкая, хрустящая и очень ароматная!',
    shortDescription: 'Воздушная сладость с карамелизированной мукой',
    price: 250,
    category: 'sweets',
    image: '/images/products/pishmanie.jpg',
    tags: ['traditional'],
    calories: {
      total: 280,
      fat: 10,
      protein: 2,
      carbs: 50
    },
    ingredients: ['Мука', 'Сливочное масло', 'Мед'],
    customizable: false,
    inStock: true,
    createdAt: '2024-04-13T08:27:00Z',
  },
  {
    id: '12',
    name: 'Рогалики с орехами',
    description: 'Хрустящее наслаждение с тающей сердцевиной! Уникальное тесто на пиве и холодном маргарине (тертом через терку) дает идеальную слоистую текстуру, а душистая начинка из молотых орехов с сахаром создает гармонию вкусов.',
    shortDescription: 'Слоистые рогалики с ореховой начинкой',
    price: 200,
    category: 'sweets',
    image: '/images/products/rogaliki.jpg',
    tags: ['traditional'],
    calories: {
      total: 300,
      fat: 18,
      protein: 5,
      carbs: 32
    },
    ingredients: ['Мука', 'Пиво', 'Маргарин', 'Орехи', 'Сахар'],
    customizable: false,
    inStock: true,
    createdAt: '2024-04-13T08:31:00Z',
  },
];

export * from './coffee';
export * from './accessories';
export * from './gifts';
