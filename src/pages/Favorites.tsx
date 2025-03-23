
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useFavorites } from '../hooks/useFavorites';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  
  // Filter products that are in favorites
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="py-12 text-center">
          <Heart size={48} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-serif mb-4">Избранное</h1>
          <p className="text-muted-foreground mb-6">
            Пожалуйста, войдите в систему, чтобы увидеть ваш список избранного
          </p>
          <Button asChild>
            <Link to="/auth">Войти</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif mb-2">
              Избранное
            </h1>
            <p className="text-muted-foreground">
              {favoriteProducts.length} товаров
            </p>
          </div>
        </div>
        
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} showFavoriteButton />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg bg-background">
            <Heart size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium mb-2">Список избранного пуст</h3>
            <p className="text-muted-foreground mb-6">
              Добавляйте товары в избранное, чтобы быстро находить их позже
            </p>
            <Button asChild>
              <Link to="/products">Перейти к товарам</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Favorites;
