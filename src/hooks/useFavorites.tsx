
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './use-toast';

export function useFavorites() {
  const { isAuthenticated, user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  
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
    } else {
      // Clear favorites if not authenticated
      setFavorites([]);
    }
  }, [isAuthenticated, user]);
  
  // Toggle a product in favorites with safeguards
  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Необходима авторизация",
        description: "Пожалуйста, войдите в систему чтобы добавлять товары в избранное",
      });
      return;
    }
    
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
  
  // Clear all favorites (useful for debugging)
  const clearFavorites = () => {
    if (isAuthenticated && user) {
      const storageKey = `favorites_${user.id}`;
      localStorage.removeItem(storageKey);
      setFavorites([]);
    }
  };
  
  return { favorites, toggleFavorite, isInFavorites, clearFavorites };
}
