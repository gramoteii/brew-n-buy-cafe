
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="product-card group"
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
                <svg
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= Math.round(product.rating) ? "text-amber-500" : "text-gray-300"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
