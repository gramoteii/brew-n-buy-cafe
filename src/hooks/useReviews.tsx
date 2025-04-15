
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const STORAGE_KEY = 'product_reviews';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuth();
  
  // Load reviews from localStorage on initial render
  useEffect(() => {
    const savedReviews = localStorage.getItem(STORAGE_KEY);
    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews);
        setReviews(Array.isArray(parsedReviews) ? parsedReviews : []);
      } catch (error) {
        console.error('Error parsing reviews:', error);
        setReviews([]);
      }
    }
  }, []);
  
  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }
  }, [reviews]);
  
  // Add a new review
  const addReview = useCallback((review: Review) => {
    setReviews(prev => {
      const newReviews = [...prev, review];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
      return newReviews;
    });
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
  
  // Check if user has already reviewed this product
  const hasUserReviewed = useCallback((productId: string) => {
    if (!user) return false;
    return reviews.some(review => review.productId === productId && review.userId === user.id);
  }, [reviews, user]);
  
  // Delete a review
  const deleteReview = useCallback((reviewId: string) => {
    setReviews(prev => {
      const newReviews = prev.filter(review => review.id !== reviewId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
      return newReviews;
    });
  }, []);
  
  return {
    reviews,
    addReview,
    deleteReview,
    getReviewsByProductId,
    getAverageRating,
    hasUserReviewed
  };
}
