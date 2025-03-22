
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product, ProductCustomization } from '../types';
import { useToast } from '../hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, customization: ProductCustomization) => void;
  removeFromCart: (itemIndex: number) => void;
  updateQuantity: (itemIndex: number, quantity: number) => void;
  updateCustomization: (itemIndex: number, customization: ProductCustomization) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('coffee-shop-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('coffee-shop-cart', JSON.stringify(items));
  }, [items]);

  const calculateItemPrice = (product: Product, quantity: number, customization: ProductCustomization) => {
    let basePrice = product.price;
    
    // Adjust price based on size
    if (customization.size && product.variations) {
      const variation = product.variations.find(v => v.size === customization.size);
      if (variation) {
        basePrice = variation.price;
      }
    }
    
    // Add price of sugar
    const sugarPrice = (customization.sugar || 0) * 5;
    
    // Add price of pahlava
    const pahlavaPrice = (customization.pahlava || 0) * 50;
    
    // Calculate total
    return (basePrice + sugarPrice + pahlavaPrice) * quantity;
  };

  const addToCart = (product: Product, quantity: number, customization: ProductCustomization) => {
    const totalPrice = calculateItemPrice(product, quantity, customization);
    
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.product.id === product.id && 
               JSON.stringify(item.customization) === JSON.stringify(customization)
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].totalPrice = calculateItemPrice(
          product, 
          updatedItems[existingItemIndex].quantity, 
          customization
        );
        
        toast({
          title: 'Товар обновлен',
          description: `${product.name} (${quantity}) добавлен в корзину`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        toast({
          title: 'Товар добавлен',
          description: `${product.name} добавлен в корзину`,
        });
        
        return [...prevItems, { product, quantity, customization, totalPrice }];
      }
    });
  };

  const removeFromCart = (itemIndex: number) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      const removed = newItems.splice(itemIndex, 1);
      
      if (removed.length) {
        toast({
          title: 'Товар удален',
          description: `${removed[0].product.name} удален из корзины`,
        });
      }
      
      return newItems;
    });
  };

  const updateQuantity = (itemIndex: number, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[itemIndex]) {
        newItems[itemIndex].quantity = quantity;
        newItems[itemIndex].totalPrice = calculateItemPrice(
          newItems[itemIndex].product,
          quantity,
          newItems[itemIndex].customization
        );
      }
      return newItems;
    });
  };

  const updateCustomization = (itemIndex: number, customization: ProductCustomization) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[itemIndex]) {
        newItems[itemIndex].customization = customization;
        newItems[itemIndex].totalPrice = calculateItemPrice(
          newItems[itemIndex].product,
          newItems[itemIndex].quantity,
          customization
        );
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: 'Корзина очищена',
      description: 'Все товары удалены из корзины',
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateCustomization,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
