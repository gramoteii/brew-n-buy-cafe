
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import { motion } from 'framer-motion';

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const handleProductOperation = (operation: string) => {
    // This would connect to a real backend in production
    toast({
      title: 'Операция выполнена',
      description: `${operation} товара успешно завершено.`,
    });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">
              Добро пожаловать, {user?.name}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Добавить новый товар</CardTitle>
                <CardDescription>
                  Заполните форму для добавления нового товара в магазин
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Название</Label>
                    <Input id="productName" placeholder="Введите название товара" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Цена (₽)</Label>
                    <Input id="productPrice" type="number" placeholder="0" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Категория</Label>
                  <select 
                    id="productCategory"
                    className="w-full px-3 py-2 border border-border rounded-md"
                  >
                    <option value="coffee">Кофе</option>
                    <option value="tea">Чай</option>
                    <option value="accessory">Аксессуары</option>
                    <option value="gift">Подарки</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productDescription">Описание</Label>
                  <Textarea 
                    id="productDescription"
                    placeholder="Введите подробное описание товара"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="productImage">Изображение</Label>
                  <Input id="productImage" type="file" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Отмена</Button>
                <Button onClick={() => handleProductOperation('Добавление')}>Добавить товар</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Управление товарами</CardTitle>
                <CardDescription>
                  Редактирование и удаление существующих товаров
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input placeholder="Поиск товаров..." />
                </div>
                
                <div className="mt-4 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Название
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Категория
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Цена
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Midnight Mint Mocha Frappuccino
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Кофе</td>
                        <td className="px-6 py-4 whitespace-nowrap">450 ₽</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <Button size="sm" onClick={() => handleProductOperation('Редактирование')}>
                            Изменить
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleProductOperation('Удаление')}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Курабье, 400г.
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">Десерты</td>
                        <td className="px-6 py-4 whitespace-nowrap">320 ₽</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <Button size="sm" onClick={() => handleProductOperation('Редактирование')}>
                            Изменить
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleProductOperation('Удаление')}
                          >
                            Удалить
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление заказами</CardTitle>
                <CardDescription>
                  Просмотр и обработка заказов клиентов
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID заказа
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Клиент
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Дата
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Сумма
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Статус
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">ORD-001</td>
                        <td className="px-6 py-4 whitespace-nowrap">Анна Смирнова</td>
                        <td className="px-6 py-4 whitespace-nowrap">12.06.2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">1250 ₽</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                            В обработке
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm">Подробнее</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">ORD-002</td>
                        <td className="px-6 py-4 whitespace-nowrap">Иван Петров</td>
                        <td className="px-6 py-4 whitespace-nowrap">11.06.2023</td>
                        <td className="px-6 py-4 whitespace-nowrap">780 ₽</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Доставлен
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm">Подробнее</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Просмотр и управление учетными записями пользователей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Имя
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Роль
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">1</td>
                        <td className="px-6 py-4 whitespace-nowrap">Анна Смирнова</td>
                        <td className="px-6 py-4 whitespace-nowrap">anna@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            Пользователь
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm">Редактировать</Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">2</td>
                        <td className="px-6 py-4 whitespace-nowrap">Администратор</td>
                        <td className="px-6 py-4 whitespace-nowrap">admin@coffee.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                            Администратор
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button size="sm">Редактировать</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Admin;
