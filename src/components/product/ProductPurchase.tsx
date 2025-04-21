
import React from 'react';
import { Product, ProductSize } from '@/types';
import { ShoppingCart } from 'lucide-react';
import Button from '@/components/Button';
import { productAdditions } from '@/data/products';

interface ProductPurchaseProps {
  product: Product;
  quantity: number;
  currentPrice: number;
  sugar: number;
  parvarda: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

const ProductPurchase: React.FC<ProductPurchaseProps> = ({ 
  product, 
  quantity, 
  currentPrice, 
  sugar, 
  parvarda,
  onQuantityChange, 
  onAddToCart 
}) => {
  // Calculate the total price based on current price, additions, and quantity
  const totalPrice = (currentPrice + 
    (sugar * productAdditions.sugar.price) + 
    (parvarda * productAdditions.parvarda.price)) * quantity;
    
  return (
    <>
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            -
          </button>
          <span className="w-10 h-10 flex items-center justify-center">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            +
          </button>
        </div>
        
        <Button 
          className="flex-1"
          onClick={onAddToCart}
        >
          <ShoppingCart size={16} className="mr-2" />
          Добавить в корзину
        </Button>
      </div>
      
      <div className="bg-secondary p-4 rounded-lg mb-8">
        <div className="flex justify-between">
          <span className="font-medium">Итого:</span>
          <span className="font-medium">
            {totalPrice} ₽
          </span>
        </div>
      </div>
    </>
  );
};

export default ProductPurchase;
