
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Heart, Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from '../hooks/use-toast';
import { useReviews } from '../hooks/useReviews';

interface ProductCardProps {
  product: Product;
  showFavoriteButton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showFavoriteButton = false }) => {
  const { isInFavorites, toggleFavorite } = useFavorites();
  const isFavorite = isInFavorites(product.id);
  const { getAverageRating, getReviewsByProductId } = useReviews();
  const avgRating = getAverageRating(product.id);
  const reviewCount = getReviewsByProductId(product.id).length;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only toggle the favorite status for the current product
    toggleFavorite(product.id);

    toast({
      title: isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
      description: `${product.name} ${isFavorite ? "удален из" : "добавлен в"} избранное`,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="product-card group relative"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Product image with zoom effect */}
        <div className="relative w-full h-60 overflow-hidden rounded-t-lg img-hover-zoom">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700"
          />
          
          {/* Tags */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.tags.includes('new') && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Новинка
              </span>
            )}
            {product.tags.includes('sale') && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full">
                Скидка
              </span>
            )}
          </div>
          
          {/* Favorite button */}
          {showFavoriteButton && (
            <button
              onClick={handleToggleFavorite}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-colors",
                isFavorite ? "bg-white/90 text-red-500 hover:bg-white" : "bg-white/90 text-gray-400 hover:bg-white"
              )}
              aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          )}
        </div>
        
        {/* Product info */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {product.shortDescription}
              </p>
            </div>
            <div className="font-serif text-lg font-medium">
              {product.price} ₽
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={16}
                  className={cn(
                    star <= Math.round(avgRating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({reviewCount})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

