
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
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('admin_products', JSON.stringify(initialProducts));
    }
  }, []);

  const addProduct = (product: Product) => {
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
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('admin_products', JSON.stringify(updatedProducts));
    toast({
      title: "Товар удален",
      description: "Товар успешно удален.",
    });
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
