
import React, { useState, useEffect } from 'react';
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Product, ProductCategory, Order } from '../types';
import { products as allProducts } from '../data/products';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useProducts } from '../hooks/useProducts';

const Admin = () => {
  const { user, isAdmin, logout, getAllUsers, updateOrderStatus } = useAuth();
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const allUsers = getAllUsers();
  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    shortDescription: '',
    description: '',
    price: 0,
    category: 'coffee' as ProductCategory,
    image: '',
    tags: [],
    rating: 4.5,
    reviewCount: 0,
    customizable: false,
    ingredients: [],
    inStock: true,
    createdAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const filtered = allUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const handleProductSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description || "",
        shortDescription: newProduct.shortDescription || "",
        price: Number(newProduct.price) || 0,
        category: newProduct.category as ProductCategory,
        image: newProduct.image || "/placeholder.svg",
        tags: Array.isArray(newProduct.tags) ? newProduct.tags : [],
        rating: 0,
        reviewCount: 0,
        customizable: newProduct.customizable || false,
        calories: {
          total: 0,
          fat: 0,
          protein: 0,
          carbs: 0
        },
        ingredients: Array.isArray(newProduct.ingredients) ? newProduct.ingredients : [],
        inStock: true,
        createdAt: new Date().toISOString(),
        variations: []
      };
      
      addProduct(product);

      setNewProduct({
        name: '',
        shortDescription: '',
        description: '',
        price: 0,
        category: 'coffee' as ProductCategory,
        image: '',
        tags: [],
        rating: 4.5,
        reviewCount: 0,
        customizable: false,
        ingredients: [],
        inStock: true,
        createdAt: new Date().toISOString().split('T')[0],
      });

      toast({
        title: 'Товар добавлен',
        description: `Товар "${product.name}" успешно добавлен.`,
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      tags: product.tags,
      rating: product.rating,
      reviewCount: product.reviewCount,
      customizable: product.customizable,
      ingredients: product.ingredients,
      inStock: product.inStock,
      createdAt: product.createdAt,
    });
    setIsEditing(true);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    const updatedProduct: Product = {
      ...selectedProduct,
      name: newProduct.name || selectedProduct.name,
      shortDescription: newProduct.shortDescription || selectedProduct.shortDescription,
      description: newProduct.description || selectedProduct.description,
      price: newProduct.price !== undefined ? newProduct.price : selectedProduct.price,
      category: newProduct.category || selectedProduct.category,
      image: newProduct.image || selectedProduct.image,
      tags: newProduct.tags || selectedProduct.tags,
      rating: newProduct.rating !== undefined ? newProduct.rating : selectedProduct.rating,
      reviewCount: newProduct.reviewCount !== undefined ? newProduct.reviewCount : selectedProduct.reviewCount,
      customizable: newProduct.customizable !== undefined ? newProduct.customizable : selectedProduct.customizable,
      ingredients: newProduct.ingredients || selectedProduct.ingredients,
      inStock: newProduct.inStock !== undefined ? newProduct.inStock : selectedProduct.inStock,
    };

    updateProduct(updatedProduct);
    setIsEditing(false);
    setSelectedProduct(null);

    setNewProduct({
      name: '',
      shortDescription: '',
      description: '',
      price: 0,
      category: 'coffee' as ProductCategory,
      image: '',
      tags: [],
      rating: 4.5,
      reviewCount: 0,
      customizable: false,
      ingredients: [],
      inStock: true,
      createdAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    // Update the order status in the state
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    if (id === 'productPrice') {
      setNewProduct({
        ...newProduct,
        price: parseFloat(value) || 0,
      });
    } else if (id === 'productCategory') {
      setNewProduct({
        ...newProduct,
        category: value as ProductCategory,
      });
    } else if (id === 'productCustomizable') {
      setNewProduct({
        ...newProduct,
        customizable: (e.target as HTMLInputElement).checked,
      });
    } else if (id === 'productInStock') {
      setNewProduct({
        ...newProduct,
        inStock: (e.target as HTMLInputElement).checked,
      });
    } else if (id === 'productImage') {
      setNewProduct({
        ...newProduct,
        image: value || 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop',
      });
    } else if (id === 'productTags') {
      setNewProduct({
        ...newProduct,
        tags: value.split(',').map(tag => tag.trim()),
      });
    } else if (id === 'productIngredients') {
      setNewProduct({
        ...newProduct,
        ingredients: value.split(',').map(ingredient => ingredient.trim()),
      });
    } else {
      setNewProduct({
        ...newProduct,
        [id.replace('product', '').toLowerCase()]: value,
      });
    }
  };

  const displayedProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

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
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Редактировать товар</CardTitle>
                  <CardDescription>
                    Внесите изменения в информацию о товаре
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Название</Label>
                      <Input 
                        id="productName" 
                        value={newProduct.name || ''} 
                        onChange={handleInputChange}
                        placeholder="Введите название товара" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Цена (₽)</Label>
                      <Input 
                        id="productPrice" 
                        type="number" 
                        value={newProduct.price || 0} 
                        onChange={handleInputChange}
                        placeholder="0" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productShortDescription">Краткое описание</Label>
                    <Input 
                      id="productShortDescription" 
                      value={newProduct.shortDescription || ''} 
                      onChange={handleInputChange}
                      placeholder="Краткое описание товара" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Категория</Label>
                    <select 
                      id="productCategory"
                      className="w-full px-3 py-2 border border-border rounded-md"
                      value={newProduct.category || 'coffee'}
                      onChange={handleInputChange}
                    >
                      <option value="coffee">Кофе</option>
                      <option value="sweets">Сладости</option>
                      <option value="accessory">Аксессуары</option>
                      <option value="gift">Подарки</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Описание</Label>
                    <Textarea 
                      id="productDescription"
                      value={newProduct.description || ''}
                      onChange={handleInputChange}
                      placeholder="Введите подробное описание товара"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Изображение</Label>
                    <Input 
                      id="productImage" 
                      value={newProduct.image || ''} 
                      onChange={handleInputChange}
                      placeholder="URL изображения"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="productInStock"
                      checked={newProduct.inStock || false}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="productInStock">В наличии</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="productCustomizable"
                      checked={newProduct.customizable || false}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="productCustomizable">Можно настроить</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setSelectedProduct(null);
                    setNewProduct({});
                  }}>Отмена</Button>
                  <Button onClick={handleUpdateProduct}>Сохранить изменения</Button>
                </CardFooter>
              </Card>
            ) : (
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
                      <Input 
                        id="productName" 
                        value={newProduct.name || ''} 
                        onChange={handleInputChange}
                        placeholder="Введите название товара" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Цена (₽)</Label>
                      <Input 
                        id="productPrice" 
                        type="number" 
                        value={newProduct.price || 0} 
                        onChange={handleInputChange}
                        placeholder="0" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productShortDescription">Краткое описание</Label>
                    <Input 
                      id="productShortDescription" 
                      value={newProduct.shortDescription || ''} 
                      onChange={handleInputChange}
                      placeholder="Краткое описание товара" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Категория</Label>
                    <select 
                      id="productCategory"
                      className="w-full px-3 py-2 border border-border rounded-md"
                      value={newProduct.category || 'coffee'}
                      onChange={handleInputChange}
                    >
                      <option value="coffee">Кофе</option>
                      <option value="sweets">Сладости</option>
                      <option value="accessory">Аксессуары</option>
                      <option value="gift">Подарки</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Описание</Label>
                    <Textarea 
                      id="productDescription"
                      value={newProduct.description || ''}
                      onChange={handleInputChange}
                      placeholder="Введите подробное описание товара"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Изображение</Label>
                    <Input 
                      id="productImage" 
                      value={newProduct.image || ''} 
                      onChange={handleInputChange}
                      placeholder="URL изображения"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="productInStock"
                      checked={newProduct.inStock || false}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="productInStock">В наличии</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="productCustomizable"
                      checked={newProduct.customizable || false}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="productCustomizable">Можно настроить</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setNewProduct({})}>Очистить</Button>
                  <Button onClick={handleAddProduct}>Добавить товар</Button>
                </CardFooter>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Управление товарами</CardTitle>
                <CardDescription>
                  Редактирование и удаление существующих товаров
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Input 
                    placeholder="Поиск товаров..." 
                    value={searchTerm}
                    onChange={handleProductSearch}
                  />
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Цена</TableHead>
                        <TableHead>В наличии</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            {product.category === 'coffee' && 'Кофе'}
                            {product.category === 'sweets' && 'Сладости'}
                            {product.category === 'accessory' && 'Аксессуары'}
                            {product.category === 'gift' && 'Подарки'}
                          </TableCell>
                          <TableCell>{product.price} ₽</TableCell>
                          <TableCell>{product.inStock ? 'Да' : 'Нет'}</TableCell>
                          <TableCell className="space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleEditProduct(product)}
                            >
                              Изменить
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">Удалить</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Вы уверены, что хотите удалить товар "{product.name}"? Это действие нельзя отменить.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                    Удалить
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
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
                <div className="mb-4">
                  <Input
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Заказов</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                          </span>
                        </TableCell>
                        <TableCell>{user.orders?.length || 0}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt || '').toLocaleDateString('ru-RU')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    {allUsers.flatMap(user => user.orders || []).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          {allUsers.find(u => u.orders?.some(o => o.id === order.id))?.name || 'Unknown'}
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
                            onChange={(e) => {
                              const result = updateOrderStatus(
                                order.id, 
                                e.target.value as Order['status']
                              );
                              if (result) {
                                toast({
                                  title: "Статус обновлен",
                                  description: `Заказ #${order.id} обновлен`
                                });
                              }
                            }}
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
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Admin;
