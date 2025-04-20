
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';

const Admin = () => {
  const { user, isAdmin, logout, getAllUsers, updateOrderStatus } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const allUsers = getAllUsers();

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    shortDescription: '',
    description: '',
    price: 0,
    category: 'coffee',
    image: '',
    tags: [],
    rating: 4.5,
    reviewCount: 0,
    customizable: false,
    calories: {
      total: 0,
      fat: 0,
      protein: 0,
      carbs: 0
    },
    ingredients: [],
    inStock: true,
    createdAt: new Date().toISOString(),
  });

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

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
        category: value as Product['category'],
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
    } else if (id === 'productTags') {
      setNewProduct({
        ...newProduct,
        tags: value ? value.split(',').map(tag => tag.trim()) : [],
      });
    } else if (id === 'productIngredients') {
      setNewProduct({
        ...newProduct,
        ingredients: value ? value.split(',').map(ingredient => ingredient.trim()) : [],
      });
    } else {
      setNewProduct({
        ...newProduct,
        [id.replace('product', '').toLowerCase()]: value,
      });
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description || "",
        shortDescription: newProduct.shortDescription || "",
        price: Number(newProduct.price) || 0,
        category: newProduct.category!,
        image: newProduct.image || "/placeholder.svg",
        tags: Array.isArray(newProduct.tags) ? newProduct.tags : [],
        rating: 0,
        reviewCount: 0,
        customizable: newProduct.customizable || false,
        calories: newProduct.calories || {
          total: 0,
          fat: 0,
          protein: 0,
          carbs: 0
        },
        ingredients: Array.isArray(newProduct.ingredients) ? newProduct.ingredients : [],
        inStock: true,
        createdAt: new Date().toISOString()
      };
      
      addProduct(product);
      setNewProduct({
        name: '',
        shortDescription: '',
        description: '',
        price: 0,
        category: 'coffee',
        image: '',
        tags: [],
        rating: 4.5,
        reviewCount: 0,
        customizable: false,
        calories: {
          total: 0,
          fat: 0,
          protein: 0,
          carbs: 0
        },
        ingredients: [],
        inStock: true,
        createdAt: new Date().toISOString(),
      });
    }
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
            <ProductForm
              product={newProduct}
              isEditing={isEditing}
              onSubmit={isEditing ? handleUpdateProduct : handleAddProduct}
              onChange={handleInputChange}
              onCancel={() => {
                setIsEditing(false);
                setSelectedProduct(null);
                setNewProduct({});
              }}
              onClear={() => setNewProduct({})}
            />
            
            <ProductList
              products={products}
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onEdit={(product) => {
                setSelectedProduct(product);
                setNewProduct(product);
                setIsEditing(true);
              }}
              onDelete={deleteProduct}
            />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserManagement users={allUsers} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement 
              users={allUsers}
              onUpdateStatus={updateOrderStatus}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Admin;
