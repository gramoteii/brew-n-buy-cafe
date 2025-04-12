
import React from 'react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { productAdditions } from '@/data/products';

interface ProductCustomizationProps {
  product: Product;
  sugar: number;
  parvarda: number;
  onSugarChange: (value: number) => void;
  onParvardaChange: (value: number) => void;
}

const ProductCustomization: React.FC<ProductCustomizationProps> = ({ 
  product, 
  sugar, 
  parvarda, 
  onSugarChange, 
  onParvardaChange 
}) => {
  if (product.category !== 'coffee' || !product.customizable) {
    return null;
  }
  
  return (
    <>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Кубики сахара:</h3>
          <span className="text-sm text-muted-foreground">
            +{sugar * productAdditions.sugar.price} ₽
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={() => onSugarChange(value)}
              className={cn(
                "w-10 h-10 rounded-lg border flex items-center justify-center transition-colors",
                sugar === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">Парварда:</h3>
          <span className="text-sm text-muted-foreground">
            +{parvarda * productAdditions.parvarda.price} ₽
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[0, 1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              onClick={() => onParvardaChange(value)}
              className={cn(
                "w-10 h-10 rounded-lg border flex items-center justify-center transition-colors",
                parvarda === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductCustomization;
