
import React from 'react';
import { Product, ProductSize } from '@/types';
import { cn } from '@/lib/utils';
import { sizeTranslations } from '@/data/products';

interface ProductSizeSelectorProps {
  product: Product;
  selectedSize: ProductSize | undefined;
  onSizeChange: (size: ProductSize) => void;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({ 
  product, 
  selectedSize, 
  onSizeChange 
}) => {
  if (!product.variations || product.variations.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Размер:</h3>
      <div className="flex flex-wrap gap-3">
        {product.variations.map(variation => (
          <button
            key={variation.size}
            onClick={() => onSizeChange(variation.size)}
            className={cn(
              "px-4 py-2 rounded-lg border transition-colors",
              selectedSize === variation.size
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            {sizeTranslations[variation.size] || variation.size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeSelector;
