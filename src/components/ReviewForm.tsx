
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useReviews } from '../hooks/useReviews';
import { toast } from '../hooks/use-toast';

interface ReviewFormProps {
  productId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { isAuthenticated, user } = useAuth();
  const { addReview } = useReviews();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в систему, чтобы оставить отзыв",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите рейтинг от 1 до 5",
        variant: "destructive",
      });
      return;
    }
    
    if (comment.trim().length < 3) {
      toast({
        title: "Ошибка",
        description: "Текст отзыва должен содержать не менее 3 символов",
        variant: "destructive",
      });
      return;
    }
    
    addReview({
      id: Date.now().toString(),
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
    
    // Reset form
    setRating(0);
    setComment('');
    
    toast({
      title: "Отзыв добавлен",
      description: "Спасибо за ваш отзыв!",
    });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="mt-8 p-6 bg-secondary/50 rounded-lg text-center">
        <p className="mb-4 text-muted-foreground">Пожалуйста, войдите в систему, чтобы оставить отзыв</p>
        <Button variant="outline" asChild>
          <a href="/auth">Войти</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="mt-8 border border-border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Оставить отзыв</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Rating stars */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Рейтинг:</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-2xl mr-1 focus:outline-none"
              >
                <Star
                  size={24}
                  className={cn(
                    "transition-colors",
                    star <= (hoverRating || rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Comment */}
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Комментарий:
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-md border border-border p-3 focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Напишите ваш отзыв здесь..."
          ></textarea>
        </div>
        
        <Button type="submit">Отправить отзыв</Button>
      </form>
    </div>
  );
};

export default ReviewForm;
