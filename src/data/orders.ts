
import { Order } from '@/types';

// Начальные тестовые данные для заказов
const initialOrders: Order[] = [
  {
    id: "order1",
    items: [
      {
        product: {
          id: "coffee1",
          name: "Эспрессо",
          shortDescription: "Классический эспрессо",
          description: "Крепкий кофейный напиток",
          price: 150,
          category: "coffee",
          image: "/placeholder.svg",
          tags: ["hot", "classic"],
          rating: 4.5,
          reviewCount: 128,
          customizable: true,
          calories: {
            total: 0,
            fat: 0,
            protein: 0,
            carbs: 0
          },
          ingredients: ["кофе"],
          inStock: true,
          createdAt: "2024-01-01"
        },
        quantity: 2,
        totalPrice: 300
      }
    ],
    totalPrice: 300,
    status: "pending",
    createdAt: "2024-04-20T10:00:00Z",
    userId: "user1"
  }
];

// Получаем заказы из localStorage или используем начальные данные
const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem('coffee-shop-orders');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing orders:', error);
      return initialOrders;
    }
  }
  return initialOrders;
};

// Сохраняем заказы в localStorage
const saveOrders = (orders: Order[]) => {
  localStorage.setItem('coffee-shop-orders', JSON.stringify(orders));
};

export { getStoredOrders, saveOrders };
