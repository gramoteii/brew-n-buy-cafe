
import React, { useState, useEffect, useRef } from 'react';
import { User, Order } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { debounce } from '@/lib/utils';

interface UserManagementProps {
  users: User[];
}

const UserManagement: React.FC<UserManagementProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce filter function to prevent "jittering"
  const updateFilteredUsers = useRef(
    debounce((term: string) => {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
      
      // If selected user is no longer in filtered list, reset selection
      if (selectedUser && !filtered.some(u => u.id === selectedUser.id)) {
        setSelectedUser(filtered.length > 0 ? filtered[0] : null);
      } else if (!selectedUser && filtered.length > 0) {
        setSelectedUser(filtered[0]);
      }
    }, 300)
  ).current;

  // Update filtered users when search term or users list changes
  useEffect(() => {
    updateFilteredUsers(searchTerm);
  }, [searchTerm, users, updateFilteredUsers]);

  // Select first user if none selected and there are users available
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  // Handle search input change with immediate UI update
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value); // Immediate update to prevent input lag
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Управление пользователями</CardTitle>
          <CardDescription className="text-base">
            Просмотр и управление учетными записями пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              ref={searchInputRef}
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-base"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Список пользователей */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium text-lg">Пользователи системы</h3>
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
                          <p className="font-medium text-base">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.orders?.length || 0} заказов
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-base">
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
                    <h3 className="font-medium text-lg">Детали пользователя: {selectedUser.name}</h3>
                    <p className="text-base text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-lg mb-4">Заказы пользователя</h4>
                    
                    {selectedUser.orders && selectedUser.orders.length > 0 ? (
                      <div className="space-y-4">
                        {selectedUser.orders.map((order) => (
                          <div key={order.id} className="border border-border rounded-lg overflow-hidden">
                            <div className="p-4 bg-secondary/30 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-base">
                                  Заказ #{order.id}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium block text-base">{order.totalPrice} ₽</span>
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
                              <h5 className="text-base font-medium mb-2">Товары в заказе:</h5>
                              <ul className="text-base space-y-1">
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
                      <div className="text-center p-8 text-base text-muted-foreground">
                        У пользователя еще нет заказов
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/30 rounded-lg border border-border p-8 text-center text-base text-muted-foreground">
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
