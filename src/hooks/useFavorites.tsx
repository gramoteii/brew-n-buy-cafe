
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `favorites_${user.id}`;
      const savedFavorites = localStorage.getItem(storageKey);
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        } catch (error) {
          console.error('Error parsing favorites:', error);
          setFavorites([]);
        }
      }
    }
  }, [isAuthenticated, user]);
  
  // Toggle a product in favorites
  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated || !user) return;
    
    const storageKey = `favorites_${user.id}`;
    
    setFavorites(prev => {
      // Check if the product is already in favorites
      const isAlreadyFavorite = prev.includes(productId);
      
      // Create a new array based on the action (add or remove)
      const newFavorites = isAlreadyFavorite
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  // Check if a product is in favorites
  const isInFavorites = (productId: string) => {
    return favorites.includes(productId);
  };
  
  return { favorites, toggleFavorite, isInFavorites };
}
