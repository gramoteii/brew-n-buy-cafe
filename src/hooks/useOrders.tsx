
import { useState, useEffect } from 'react';
import { Order, OrderItem } from '@/types';
import { getStoredOrders, saveOrders } from '@/data/orders';
import { useToast } from '@/hooks/use-toast';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  // Load orders on initial render
  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  // Add new order
  const addOrder = (orderData: Omit<Order, 'id'>) => {
    // Generate a unique order ID
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    const newOrder: Order = {
      ...orderData,
      id: orderId
    };
    
    setOrders(prev => {
      const newOrders = [...prev, newOrder];
      saveOrders(newOrders);
      return newOrders;
    });
    
    toast({
      title: "Заказ создан",
      description: `Заказ #${orderId} успешно создан`
    });
    
    return orderId;
  };

  // Update order status
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => {
      const newOrders = prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      saveOrders(newOrders);
      return newOrders;
    });
  };

  // Get orders for specific user
  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  // Get all orders (for admin)
  const getAllOrders = () => orders;

  return {
    orders,
    addOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders
  };
}
