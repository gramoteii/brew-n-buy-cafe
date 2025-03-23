
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [isAuthenticated, user]);
  
  // Toggle a product in favorites
  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated || !user) return;
    
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      // Save to localStorage
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  // Check if a product is in favorites
  const isInFavorites = (productId: string) => {
    return favorites.includes(productId);
  };
  
  return { favorites, toggleFavorite, isInFavorites };
}
