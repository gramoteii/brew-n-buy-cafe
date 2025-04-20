
import React from 'react';
import { Order, User } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface OrderManagementProps {
  users: User[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ users, onUpdateStatus }) => {
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    onUpdateStatus(orderId, status);
    toast({
      title: "Статус обновлен",
      description: `Заказ #${orderId} обновлен`
    });
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID заказа</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.flatMap(user => user.orders || []).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {users.find(u => u.orders?.some(o => o.id === order.id))?.name || 'Unknown'}
                </TableCell>
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
                    {order.status === 'pending' && 'В обработке'}
                    {order.status === 'processing' && 'Обрабатывается'}
                    {order.status === 'shipped' && 'Отправлен'}
                    {order.status === 'delivered' && 'Доставлен'}
                    {order.status === 'cancelled' && 'Отменен'}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
