
import { useState, useEffect } from 'react';
import { Order, OrderItem } from '@/types';
import { getStoredOrders, saveOrders } from '@/data/orders';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/useUsers';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const { users, updateUser, findUserById } = useUsers();

  // Load orders on initial render
  useEffect(() => {
    const loadedOrders = getStoredOrders();
    setOrders(loadedOrders);
    
    // Sync orders with users
    syncOrdersWithUsers(loadedOrders);
  }, []);

  // Sync orders with users to ensure user.orders is up to date
  const syncOrdersWithUsers = (currentOrders: Order[]) => {
    // Group orders by userId
    const ordersByUser: {[userId: string]: Order[]} = {};
    
    currentOrders.forEach(order => {
      if (order.userId) {
        if (!ordersByUser[order.userId]) {
          ordersByUser[order.userId] = [];
        }
        ordersByUser[order.userId].push(order);
      }
    });
    
    // Update each user's orders
    Object.keys(ordersByUser).forEach(userId => {
      const user = findUserById(userId);
      if (user) {
        updateUser({
          ...user,
          orders: ordersByUser[userId]
        });
      }
    });
  };

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
      
      // Update user's orders
      if (newOrder.userId) {
        const user = findUserById(newOrder.userId);
        if (user) {
          updateUser({
            ...user,
            orders: [...(user.orders || []), newOrder]
          });
        }
      }
      
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
      const updatedOrder = prev.find(order => order.id === orderId);
      const newOrders = prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      
      saveOrders(newOrders);
      
      // Update in user's orders as well
      if (updatedOrder && updatedOrder.userId) {
        const user = findUserById(updatedOrder.userId);
        if (user && user.orders) {
          const updatedUserOrders = user.orders.map(order => 
            order.id === orderId ? { ...order, status } : order
          );
          
          updateUser({
            ...user,
            orders: updatedUserOrders
          });
        }
      }
      
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
