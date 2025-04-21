
import React, { useState } from 'react';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { sizeTranslations } from '@/data/products';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import { useReviews } from '@/hooks/useReviews';

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const { getReviewsByProductId } = useReviews();
  const reviewCount = getReviewsByProductId(product.id).length;

  return (
    <div className="mt-16">
      <div className="border-b border-border">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('description')}
            className={cn(
              "pb-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === 'description'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Описание
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={cn(
              "pb-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === 'reviews'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Отзывы ({reviewCount})
          </button>
        </div>
      </div>

      <div className="py-8">
        {activeTab === 'description' ? (
          <div>
            <p className="mb-6">{product.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Состав:</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              {(product.category === 'coffee' || product.category === 'sweets') && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Калорийность:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    {Object.entries(product.calories).map(([size, calories]) => (
                      <li key={size} className="flex justify-between border-b border-border/50 pb-1">
                        <span>
                          {sizeTranslations[size] || size}
                        </span>
                        <span>{calories} ккал</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <ReviewList productId={product.id} />
            <ReviewForm productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
