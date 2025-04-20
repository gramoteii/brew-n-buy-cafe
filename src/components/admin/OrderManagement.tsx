import React, { useState } from 'react';
import { Order } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useOrders } from '@/hooks/useOrders';

const OrderManagement: React.FC = () => {
  const { toast } = useToast();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  // Get all orders
  const allOrders = getAllOrders();
  
  console.log('All orders in admin:', allOrders); // For debugging
  
  // Filter orders by search term
  const filteredOrders = allOrders.filter(order => 
    order.id.includes(searchTerm)
  );

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    toast({
      title: "Статус обновлен",
      description: `Заказ #${orderId} обновлен`
    });
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'В обработке';
      case 'processing': return 'Обрабатывается';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заказами</CardTitle>
        <CardDescription>
          Просмотр и обработка заказов клиентов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Поиск заказа по ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID заказа</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
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
                      {getStatusText(order.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select 
                      className="px-2 py-1 border border-input rounded-md text-sm"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    >
                      <option value="pending">В обработке</option>
                      <option value="processing">Обрабатывается</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {allOrders.length === 0 
                    ? 'Пока нет заказов в системе' 
                    : 'Не найдено заказов по вашему запросу'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
