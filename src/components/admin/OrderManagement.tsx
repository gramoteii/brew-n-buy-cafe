
import React, { useState, useEffect } from 'react';
import { Order } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const { toast } = useToast();
  const { getAllOrders, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<{[key: string]: boolean}>({});

  // Get all orders
  const allOrders = getAllOrders();
  
  console.log('All orders in admin:', allOrders); // For debugging
  
  // Filter orders by search term
  const filteredOrders = allOrders.filter(order => 
    order.id.includes(searchTerm) || 
    (order.userId && order.userId.includes(searchTerm))
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

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Управление заказами</CardTitle>
        <CardDescription className="text-base">
          Просмотр и обработка заказов клиентов
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Поиск заказа по ID или ID пользователя..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md text-base"
          />
        </div>
        
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/30 p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleOrderDetails(order.id)}
                        className="p-1"
                      >
                        {expandedOrders[order.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </Button>
                      
                      <div>
                        <p className="font-medium text-base">Заказ #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')} | 
                          {order.userId ? ` Пользователь: ${order.userId}` : ' Гостевой заказ'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-medium text-base block">{order.totalPrice} ₽</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
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
                    </div>
                  </div>
                </div>
                
                {expandedOrders[order.id] && (
                  <div className="p-4 bg-white">
                    <h4 className="font-medium text-base mb-3">Товары в заказе:</h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-base">Товар</TableHead>
                            <TableHead className="text-base">Количество</TableHead>
                            <TableHead className="text-base">Цена за ед.</TableHead>
                            <TableHead className="text-right text-base">Сумма</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium text-base">
                                {item.product.name}
                                {item.customization && Object.keys(item.customization).length > 0 && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {item.customization.size && (
                                      <span>Размер: {item.customization.size} </span>
                                    )}
                                    {item.customization.sugar !== undefined && (
                                      <span>Сахар: {item.customization.sugar} </span>
                                    )}
                                    {item.customization.parvarda !== undefined && (
                                      <span>Парварда: {item.customization.parvarda}</span>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-base">{item.quantity}</TableCell>
                              <TableCell className="text-base">{item.product.price} ₽</TableCell>
                              <TableCell className="text-right text-base">{item.totalPrice} ₽</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-medium text-base">Итого:</TableCell>
                            <TableCell className="text-right font-bold text-base">{order.totalPrice} ₽</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-base">
            {allOrders.length === 0 
              ? 'Пока нет заказов в системе' 
              : 'Не найдено заказов по вашему запросу'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
