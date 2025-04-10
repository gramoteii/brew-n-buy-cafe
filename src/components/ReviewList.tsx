
import React from 'react';
import { useReviews } from '../hooks/useReviews';
import { Star, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '../hooks/use-toast';

interface ReviewListProps {
  productId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {
  const { getReviewsByProductId, deleteReview } = useReviews();
  const { user } = useAuth();
  const reviews = getReviewsByProductId(productId);
  
  const handleDeleteReview = (reviewId: string) => {
    deleteReview(reviewId);
    toast({
      title: "Отзыв удален",
      description: "Ваш отзыв был успешно удален",
    });
  };
  
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
      <h3 className="text-lg font-medium mb-4">Отзывы покупателей ({reviews.length})</h3>
      {reviews.map((review) => (
        <div key={review.id} className="border border-border rounded-lg p-4 mb-4">
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
            {user && user.id === review.userId && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
          <p className="mt-3 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
