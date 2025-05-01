
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Product, ProductCategory } from '../types'; // Add import for ProductCategory
import { useProducts } from '../hooks/useProducts';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import { useToast } from '../hooks/use-toast';

const Admin = () => {
  const { user, isAdmin, logout, getAllUsers } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const allUsers = getAllUsers();

  const emptyProduct: Partial<Product> = {
    name: '',
    shortDescription: '',
    description: '',
    price: 0,
    category: 'coffee',
    image: '',
    tags: [],
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
  };

  const [newProduct, setNewProduct] = useState<Partial<Product>>({...emptyProduct});

  // Reset form when switching to another tab
  useEffect(() => {
    return () => {
      setNewProduct({...emptyProduct});
      setSelectedProduct(null);
      setIsEditing(false);
    };
  }, []);

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    
    if (name === 'price') {
      setNewProduct({
        ...newProduct,
        price: parseFloat(value as string) || 0,
      });
    } else if (name === 'category') {
      setNewProduct({
        ...newProduct,
        category: value as Product['category'],
      });
    } else if (name === 'customizable' || name === 'inStock') {
      setNewProduct({
        ...newProduct,
        [name]: Boolean(value),
      });
    } else if (name === 'tags') {
      setNewProduct({
        ...newProduct,
        tags: (value as string) ? (value as string).split(',').map(tag => tag.trim()) : [],
      });
    } else if (name === 'ingredients') {
      setNewProduct({
        ...newProduct,
        ingredients: (value as string) ? (value as string).split(',').map(ingredient => ingredient.trim()) : [],
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля: название и категория",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names
    const existingProduct = products.find(p => 
      p.name.toLowerCase() === newProduct.name?.toLowerCase() && !isEditing
    );

    if (existingProduct) {
      toast({
        title: "Ошибка",
        description: "Товар с таким названием уже существует",
        variant: "destructive"
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description || "",
      shortDescription: newProduct.shortDescription || "",
      price: Number(newProduct.price) || 0,
      category: newProduct.category!,
      image: newProduct.image || "/placeholder.svg",
      tags: Array.isArray(newProduct.tags) ? newProduct.tags : [],
      customizable: newProduct.customizable || false,
      calories: newProduct.calories || {
        total: 0,
        fat: 0,
        protein: 0,
        carbs: 0
      },
      ingredients: Array.isArray(newProduct.ingredients) ? newProduct.ingredients : [],
      inStock: newProduct.inStock ?? true,
      createdAt: new Date().toISOString()
    };
    
    addProduct(product);
    setNewProduct({...emptyProduct});
  };

  const handleUpdateProduct = () => {
    if (selectedProduct && newProduct) {
      if (!newProduct.name || !newProduct.category) {
        toast({
          title: "Ошибка",
          description: "Заполните обязательные поля: название и категория",
          variant: "destructive"
        });
        return;
      }

      // Check for duplicate names, but exclude the current product being edited
      const existingProduct = products.find(p => 
        p.name.toLowerCase() === newProduct.name?.toLowerCase() && 
        p.id !== selectedProduct.id
      );

      if (existingProduct) {
        toast({
          title: "Ошибка",
          description: "Товар с таким названием уже существует",
          variant: "destructive"
        });
        return;
      }

      const productToUpdate: Product = {
        ...selectedProduct,
        name: newProduct.name || selectedProduct.name,
        description: newProduct.description || selectedProduct.description,
        shortDescription: newProduct.shortDescription || selectedProduct.shortDescription,
        price: Number(newProduct.price) || selectedProduct.price,
        category: newProduct.category as ProductCategory || selectedProduct.category,
        image: newProduct.image || selectedProduct.image,
        tags: Array.isArray(newProduct.tags) ? newProduct.tags : selectedProduct.tags,
        customizable: newProduct.customizable ?? selectedProduct.customizable,
        calories: newProduct.calories || selectedProduct.calories,
        ingredients: Array.isArray(newProduct.ingredients) ? newProduct.ingredients : selectedProduct.ingredients,
        inStock: newProduct.inStock ?? selectedProduct.inStock,
      };
      
      updateProduct(productToUpdate);
      setIsEditing(false);
      setSelectedProduct(null);
      setNewProduct({...emptyProduct});
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
            <p className="text-lg text-muted-foreground">
              Добро пожаловать, {user?.name}
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="text-base">
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="text-base px-6 py-2">Товары</TabsTrigger>
            <TabsTrigger value="orders" className="text-base px-6 py-2">Заказы</TabsTrigger>
            <TabsTrigger value="users" className="text-base px-6 py-2">Пользователи</TabsTrigger>
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
                setNewProduct({...emptyProduct});
              }}
              onClear={() => setNewProduct({...emptyProduct})}
            />
            
            <ProductList
              products={products}
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              onEdit={(product) => {
                setSelectedProduct(product);
                setNewProduct({
                  ...product,
                  // Ensure we have all fields from the product being edited
                  name: product.name,
                  description: product.description,
                  shortDescription: product.shortDescription,
                  price: product.price,
                  category: product.category,
                  image: product.image,
                  tags: product.tags,
                  customizable: product.customizable,
                  calories: product.calories,
                  ingredients: product.ingredients,
                  inStock: product.inStock,
                });
                setIsEditing(true);
              }}
              onDelete={deleteProduct}
            />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserManagement users={allUsers} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default Admin;
