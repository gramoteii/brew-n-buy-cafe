
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronLeft } from 'lucide-react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useReviews } from '@/hooks/useReviews';

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isFavorite = favorites.includes(product.id);

  const { getAverageRating, getReviewsByProductId } = useReviews();
  const avgRating = getAverageRating(product.id);
  const reviewCount = getReviewsByProductId(product.id).length;

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/product/${product.id}` } });
      return;
    }

    toggleFavorite(product.id);

    toast({
      title: isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
      description: `${product.name} ${isFavorite ? "удален из" : "добавлен в"} избранное`,
    });
  };

  return (
    <>
      <div className="mb-8">
        <Link to="/products" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Назад к продуктам
        </Link>
      </div>

      <div className="bg-secondary inline-block px-3 py-1 rounded-full text-xs font-medium text-secondary-foreground mb-4">
        {product.category === 'coffee' ? 'Кофе' :
          product.category === 'sweets' ? 'Сладости' :
            product.category === 'accessory' ? 'Аксессуары' : 'Подарки'}
      </div>

      <div className="flex justify-between items-start">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">{product.name}</h1>
        <button
          onClick={handleToggleFavorite}
          className={cn(
            "p-2 rounded-full transition-colors",
            isFavorite ? "text-red-500 hover:bg-red-100" : "text-gray-400 hover:bg-gray-100"
          )}
        >
          <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex items-center mb-4">
        <div className="flex text-amber-500">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={18}
              fill={star <= Math.round(avgRating) ? "currentColor" : "none"}
              className={star <= Math.round(avgRating) ? "text-amber-500" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          {avgRating ? avgRating.toFixed(1) : "—"} ({reviewCount} отзывов)
        </span>
      </div>

      <div className="text-2xl font-serif font-medium mb-6">
        {product.price} ₽
      </div>

      <p className="text-muted-foreground mb-8">
        {product.shortDescription}
      </p>
    </>
  );
};

export default ProductHeader;
