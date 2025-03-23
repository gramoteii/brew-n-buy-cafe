
import React from 'react';
import { useReviews } from '../hooks/useReviews';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReviewListProps {
  productId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const { getReviewsByProductId } = useReviews();
  const reviews = getReviewsByProductId(productId);
  
  if (reviews.length === 0) {
    return (
      <div className="py-6">
        <p className="text-center text-muted-foreground italic">
          У этого товара пока нет отзывов. Будьте первым, кто оставит отзыв!
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mb-8">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{review.userName}</p>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={cn(
                      star <= review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                    )}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDistanceToNow(new Date(review.createdAt), { 
                    addSuffix: true,
                    locale: ru
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
