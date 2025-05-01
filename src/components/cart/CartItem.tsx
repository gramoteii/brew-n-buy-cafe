
import React from 'react';
import { CartItem as CartItemType } from '@/types';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { productAdditions } from '@/data/products';

interface CartItemProps {
  item: CartItemType;
  index: number;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
}

const formatSize = (size: string) => {
  switch (size) {
    case 'small': return 'Маленький';
    case 'medium': return 'Стандартный';
    case 'large': return 'Большой';
    default: return size;
  }
};

const CartItem: React.FC<CartItemProps> = ({
  item,
  index,
  updateQuantity,
  removeFromCart
}) => {
  // Calculate current price to display
  const currentItemPrice = item.totalPrice / item.quantity;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6"
    >
      <div className="flex items-start">
        {/* Product image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden mr-4 sm:mr-6 flex-shrink-0">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg mb-1">{item.product.name}</h3>
              <p className="text-base text-muted-foreground">
                Цена: {item.product.price} ₽
              </p>
              {item.customization.size && (
                <p className="text-base text-muted-foreground">
                  Размер: {formatSize(item.customization.size)}
                </p>
              )}
              
              {/* Customizations for coffee */}
              {item.product.category === 'coffee' && item.product.customizable && (
                <div className="mt-2 text-base">
                  {item.customization.sugar && item.customization.sugar > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Сахар (×{item.customization.sugar})</span>
                      <span>+{item.customization.sugar * productAdditions.sugar.price} ₽</span>
                    </div>
                  )}
                  
                  {item.customization.parvarda && item.customization.parvarda > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Парварда (×{item.customization.parvarda})</span>
                      <span>+{item.customization.parvarda * productAdditions.parvarda.price} ₽</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button
              onClick={() => removeFromCart(index)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-end mt-4">
            {/* Quantity control */}
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                -
              </button>
              <span className="w-8 h-8 flex items-center justify-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(index, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                +
              </button>
            </div>
            
            {/* Price */}
            <div className="font-medium text-base">
              {item.totalPrice} ₽
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
