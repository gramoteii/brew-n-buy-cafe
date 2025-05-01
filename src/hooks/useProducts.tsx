
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { products as initialProducts } from '@/data/products';
import { useToast } from './use-toast';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Load products from localStorage on initial render
  useEffect(() => {
    const savedProducts = localStorage.getItem('admin_products');
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        // Ensure each product has a unique ID
        const uniqueProducts = parsedProducts.reduce((acc: Product[], product: Product) => {
          if (!acc.find(p => p.id === product.id)) {
            acc.push(product);
          } else {
            console.warn(`Duplicate product ID found: ${product.id}. Skipping.`);
          }
          return acc;
        }, []);
        
        setProducts(uniqueProducts);
        
        // If duplicates were found, update localStorage with the cleaned data
        if (uniqueProducts.length !== parsedProducts.length) {
          localStorage.setItem('admin_products', JSON.stringify(uniqueProducts));
          console.log('Duplicate products removed from localStorage');
        }
      } catch (error) {
        console.error('Error parsing products:', error);
        setProducts(initialProducts);
        localStorage.setItem('admin_products', JSON.stringify(initialProducts));
      }
    } else {
      setProducts(initialProducts);
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
    }
  }, []);

  const addProduct = (product: Product) => {
    // Check for duplicate IDs
    if (products.some(p => p.id === product.id)) {
      const uniqueId = `${product.id}_${Date.now()}`;
      product = { ...product, id: uniqueId };
    }

    // Check for duplicate names
    if (products.some(p => p.name.toLowerCase() === product.name.toLowerCase())) {
      toast({
        title: "Предупреждение",
        description: `Товар с названием "${product.name}" уже существует.`,
        variant: "warning"
      });
      return;
    }

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    
    toast({
      title: "Товар добавлен",
      description: `Товар "${product.name}" успешно добавлен.`,
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    
    toast({
      title: "Товар обновлен",
      description: `Товар "${updatedProduct.name}" успешно обновлен.`,
    });
  };

  const deleteProduct = (productId: string) => {
    // Find the product to be deleted for logging purposes
    const productToDelete = products.find(p => p.id === productId);
    
    // Filter out the product with the specific ID
    const updatedProducts = products.filter(p => p.id !== productId);
    
    // Only update if we actually deleted something
    if (updatedProducts.length < products.length) {
      setProducts(updatedProducts);
      localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
      
      toast({
        title: "Товар удален",
        description: productToDelete 
          ? `Товар "${productToDelete.name}" успешно удален.` 
          : "Товар успешно удален.",
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Товар не найден или уже удален.",
        variant: "destructive"
      });
    }
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
