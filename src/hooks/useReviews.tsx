
import { useState, useEffect, useCallback } from 'react';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Load reviews from localStorage on initial render
  useEffect(() => {
    const savedReviews = localStorage.getItem('product_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);
  
  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('product_reviews', JSON.stringify(reviews));
  }, [reviews]);
  
  // Add a new review
  const addReview = useCallback((review: Review) => {
    setReviews(prev => [...prev, review]);
  }, []);
  
  // Get reviews for a specific product
  const getReviewsByProductId = useCallback((productId: string) => {
    return reviews.filter(review => review.productId === productId);
  }, [reviews]);
  
  // Get average rating for a product
  const getAverageRating = useCallback((productId: string) => {
    const productReviews = getReviewsByProductId(productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / productReviews.length;
  }, [getReviewsByProductId]);
  
  return {
    reviews,
    addReview,
    getReviewsByProductId,
    getAverageRating
  };
}
