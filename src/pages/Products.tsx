
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { Product, ProductCategory, SortOption } from '../types';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'framer-motion';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products } = useProducts();
  const categoryParam = searchParams.get('category') as ProductCategory | null;
  
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(categoryParam || 'all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Apply proper sorting and filtering
  useEffect(() => {
    let result = [...products];
    
    // Filter by category if not "all"
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply selected sort to filtered products
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    // After sorting, we can prioritize products with 'new' tag by bringing them to the top
    // without disturbing the sort order within each group
    if (sortOption !== 'newest' && sortOption !== 'oldest') {
      const newProducts = result.filter(product => product.tags.includes('new'));
      const otherProducts = result.filter(product => !product.tags.includes('new'));
      
      result = [...newProducts, ...otherProducts];
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, sortOption, products]);
  
  // Update category from URL params
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);
  
  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${category}`);
    }
  };
  
  const categories = [
    { value: 'all', label: 'Все категории' },
    { value: 'coffee', label: 'Кофе' },
    { value: 'sweets', label: 'Сладости' },
    { value: 'accessory', label: 'Аксессуары' },
    { value: 'gift', label: 'Подарки' },
  ];
  
  const sortOptions = [
    { value: 'newest', label: 'Новые' },
    { value: 'oldest', label: 'Старые' },
    { value: 'price-asc', label: 'От дешевых к дорогим' },
    { value: 'price-desc', label: 'От дорогих к дешевым' },
  ];
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-24" // Added padding to avoid navbar overlap
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif mb-2">
              {selectedCategory === 'all' ? 'Все продукты' : 
               selectedCategory === 'coffee' ? 'Кофе' :
               selectedCategory === 'sweets' ? 'Сладости' :
               selectedCategory === 'accessory' ? 'Аксессуары' : 'Подарки'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {filteredProducts.length} товаров
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as ProductCategory | 'all')}
                className="w-full min-w-[200px] p-2.5 text-base border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              >
                {categories.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full min-w-[200px] p-2.5 text-base border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} showFavoriteButton />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Товары не найдены</h3>
            <p className="text-muted-foreground mb-6">
              Попробуйте изменить параметры фильтрации
            </p>
            <Button 
              variant="outline"
              onClick={() => handleCategoryChange('all')}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Products;
