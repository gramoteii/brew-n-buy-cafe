
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Order, User } from '@/types';

export const AdminOrderHistory = () => {
  const { getAllUsers, updateOrderStatus } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Get all orders from all users
  const allOrders = getAllUsers().flatMap(user => 
    (user.orders || []).map(order => ({
      ...order,
      userName: user.name,
      userEmail: user.email
    }))
  );
  
  const filteredOrders = statusFilter === 'all' 
    ? allOrders 
    : allOrders.filter(order => order.status === statusFilter);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select defaultValue="all" onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все заказы</SelectItem>
            <SelectItem value="pending">Ожидают</SelectItem>
            <SelectItem value="processing">В обработке</SelectItem>
            <SelectItem value="shipped">Отправлены</SelectItem>
            <SelectItem value="delivered">Доставлены</SelectItem>
            <SelectItem value="cancelled">Отменены</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.userName}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</TableCell>
              <TableCell>{order.totalPrice} ₽</TableCell>
              <TableCell>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'pending' && 'Ожидает'}
                  {order.status === 'processing' && 'В обработке'}
                  {order.status === 'shipped' && 'Отправлен'}
                  {order.status === 'delivered' && 'Доставлен'}
                  {order.status === 'cancelled' && 'Отменен'}
                </span>
              </TableCell>
              <TableCell>
                <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Изменить статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="processing">В обработке</SelectItem>
                    <SelectItem value="shipped">Отправлен</SelectItem>
                    <SelectItem value="delivered">Доставлен</SelectItem>
                    <SelectItem value="cancelled">Отменен</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
