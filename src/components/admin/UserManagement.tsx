
import React, { useState, useEffect } from 'react';
import { User, Order } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  users: User[];
}

const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    
    // Если выбранный пользователь больше не в отфильтрованном списке, сбрасываем выбор
    if (selectedUser && !filtered.some(u => u.id === selectedUser.id)) {
      setSelectedUser(null);
    }
  }, [searchTerm, users, selectedUser]);

  // Выбираем первого пользователя если еще никто не выбран
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
          <CardDescription>
            Просмотр и управление учетными записями пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Список пользователей */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Пользователи системы</h3>
              </div>
              
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
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
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    Нет пользователей, соответствующих поисковому запросу
                  </div>
                )}
              </div>
            </div>
            
            {/* Детали пользователя */}
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
                        {selectedUser.orders.map((order) => (
                          <div key={order.id} className="border border-border rounded-lg overflow-hidden">
                            <div className="p-4 bg-secondary/30 flex justify-between items-center">
                              <div>
                                <p className="font-medium">
                                  Заказ #{order.id}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium block">{order.totalPrice} ₽</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
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
                              </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
