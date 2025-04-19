
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Order } from '../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Package, Check, Truck, Clock, X } from 'lucide-react';
import Button from './Button';

const AdminUserManagement = () => {
  const { getAllUsers, updateOrderStatus } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const users = getAllUsers();
  
  const totalOrders = users.reduce((total, user) => 
    total + (user.orders?.length || 0), 0);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-muted-foreground" />;
      case 'processing':
        return <Package size={16} className="text-amber-500" />;
      case 'shipped':
        return <Truck size={16} className="text-blue-500" />;
      case 'delivered':
        return <Check size={16} className="text-green-500" />;
      case 'cancelled':
        return <X size={16} className="text-destructive" />;
      default:
        return <Clock size={16} className="text-muted-foreground" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };
  
  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    // Refresh selected user to see the update
    if (selectedUser) {
      const updatedUser = getAllUsers().find(user => user.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-2">Пользователи</h3>
          <p className="text-3xl font-serif">{users.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-2">Всего заказов</h3>
          <p className="text-3xl font-serif">{totalOrders}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users list */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium">Пользователи системы</h3>
          </div>
          
          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {users.map(user => (
              <button
                key={user.id}
                className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-secondary/80' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.orders?.length || 0} заказов
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* User details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Детали пользователя: {selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium mb-4">Заказы пользователя</h4>
                
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="space-y-4">
                    {selectedUser.orders.map(order => (
                      <div key={order.id} className="border border-border rounded-lg overflow-hidden">
                        <div className="p-4 bg-secondary/30 flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              Заказ #{order.id} 
                              <span className="ml-2 inline-flex items-center">
                                {getStatusIcon(order.status)}
                                <span className="ml-1 text-sm">{getStatusText(order.status)}</span>
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <p className="font-medium">{order.totalPrice} ₽</p>
                        </div>
                        
                        <div className="p-4">
                          <h5 className="text-sm font-medium mb-2">Товары в заказе:</h5>
                          <ul className="text-sm space-y-1">
                            {order.items.map((item, i) => (
                              <li key={i} className="flex justify-between">
                                <span>{item.product.name} × {item.quantity}</span>
                                <span>{item.totalPrice} ₽</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="p-4 border-t border-border bg-secondary/10">
                          <h5 className="text-sm font-medium mb-2">Изменить статус:</h5>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant={order.status === 'pending' ? 'default' : 'outline'}
                              onClick={() => handleUpdateStatus(order.id, 'pending')}
                            >
                              <Clock size={14} className="mr-1" />
                              Ожидает
                            </Button>
                            <Button 
                              size="sm" 
                              variant={order.status === 'processing' ? 'default' : 'outline'}
                              onClick={() => handleUpdateStatus(order.id, 'processing')}
                            >
                              <Package size={14} className="mr-1" />
                              В обработке
                            </Button>
                            <Button 
                              size="sm" 
                              variant={order.status === 'shipped' ? 'default' : 'outline'}
                              onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            >
                              <Truck size={14} className="mr-1" />
                              Отправлен
                            </Button>
                            <Button 
                              size="sm" 
                              variant={order.status === 'delivered' ? 'default' : 'outline'}
                              onClick={() => handleUpdateStatus(order.id, 'delivered')}
                            >
                              <Check size={14} className="mr-1" />
                              Доставлен
                            </Button>
                            <Button 
                              size="sm" 
                              variant={order.status === 'cancelled' ? 'destructive' : 'outline'}
                              onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            >
                              <X size={14} className="mr-1" />
                              Отменен
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    У пользователя еще нет заказов
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-lg border border-border p-8 text-center text-muted-foreground">
              Выберите пользователя для просмотра деталей
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
