
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product, ProductCustomization } from '../types';
import { useToast } from '../hooks/use-toast';
import { useProducts } from '../hooks/useProducts';

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

const CART_STORAGE_KEY = 'coffee-shop-cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { products } = useProducts();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const loadCartFromStorage = () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          
          // Always update cart with the latest product data
          if (products.length > 0) {
            const updatedCart = parsedCart.map((item: CartItem) => {
              const currentProductData = products.find(p => p.id === item.product.id);
              if (currentProductData) {
                // Recalculate the total price with the latest product data
                return {
                  ...item,
                  product: currentProductData,
                  totalPrice: calculateItemPrice(
                    currentProductData,
                    item.quantity,
                    item.customization
                  )
                };
              }
              return item;
            });
            setItems(updatedCart);
          } else {
            setItems(parsedCart);
          }
        } catch (error) {
          console.error('Error parsing cart data:', error);
        }
      }
    };

    loadCartFromStorage();
  }, [products]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Update cart items with latest product prices from products
  useEffect(() => {
    if (products.length > 0 && items.length > 0) {
      console.log('Updating cart items with latest product prices');
      const updatedItems = items.map(item => {
        // Find the latest product data
        const currentProductData = products.find(p => p.id === item.product.id);
        
        if (currentProductData) {
          // Check if price has changed
          if (currentProductData.price !== item.product.price) {
            console.log(`Updating product ${currentProductData.name}: old price=${item.product.price}, new price=${currentProductData.price}`);
          }
          
          // Always update the product in the cart with latest data and recalculate total price
          const updatedItem = {
            ...item,
            product: currentProductData,
            totalPrice: calculateItemPrice(
              currentProductData,
              item.quantity,
              item.customization
            )
          };
          return updatedItem;
        }
        return item;
      });
      
      // Only update items if there are actual changes to avoid infinite loop
      const hasChanges = JSON.stringify(updatedItems) !== JSON.stringify(items);
      if (hasChanges) {
        console.log('Cart items updated with new prices');
        setItems(updatedItems);
      }
    }
  }, [products]);

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
    
    // Add price of parvarda
    const parvardaPrice = (customization.parvarda || 0) * 50;
    
    // Calculate total
    return (basePrice + sugarPrice + parvardaPrice) * quantity;
  };

  const findExistingItemIndex = (product: Product, customization: ProductCustomization) => {
    return items.findIndex(
      item => item.product.id === product.id && 
              JSON.stringify(item.customization) === JSON.stringify(customization)
    );
  };

  const addToCart = (product: Product, quantity: number, customization: ProductCustomization) => {
    // Always get the latest product data from products array
    const latestProduct = products.find(p => p.id === product.id) || product;
    const totalPrice = calculateItemPrice(latestProduct, quantity, customization);
    
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = findExistingItemIndex(latestProduct, customization);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].product = latestProduct; // Always use latest product data
        updatedItems[existingItemIndex].totalPrice = calculateItemPrice(
          latestProduct, 
          updatedItems[existingItemIndex].quantity, 
          customization
        );
        
        toast({
          title: 'Товар обновлен',
          description: `${latestProduct.name} (${quantity}) добавлен в корзину`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        toast({
          title: 'Товар добавлен',
          description: `${latestProduct.name} добавлен в корзину`,
        });
        
        return [...prevItems, { product: latestProduct, quantity, customization, totalPrice }];
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
        // Get the latest product data
        const latestProduct = products.find(p => p.id === newItems[itemIndex].product.id) || newItems[itemIndex].product;
        
        newItems[itemIndex].product = latestProduct;
        newItems[itemIndex].quantity = quantity;
        newItems[itemIndex].totalPrice = calculateItemPrice(
          latestProduct,
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
        // Get the latest product data
        const latestProduct = products.find(p => p.id === newItems[itemIndex].product.id) || newItems[itemIndex].product;
        
        newItems[itemIndex].product = latestProduct;
        newItems[itemIndex].customization = customization;
        newItems[itemIndex].totalPrice = calculateItemPrice(
          latestProduct,
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

  // Calculate totals based on the current items state
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Use the item's totalPrice which is recalculated anytime the product, quantity or customization changes
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
