
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { Product } from '../types';
import { products } from '../data/products';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(query);

  // Search products based on the query
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filteredProducts);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-6">Поиск</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Что вы ищете?"
                  className="w-full p-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              </div>
              <Button type="submit">Поиск</Button>
            </div>
          </form>
          
          {query && (
            <p className="text-muted-foreground mb-6">
              {searchResults.length === 0 
                ? 'По вашему запросу ничего не найдено.' 
                : `Найдено ${searchResults.length} товаров по запросу "${query}"`}
            </p>
          )}
        </div>
        
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {query && searchResults.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon size={64} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Ничего не найдено</h3>
            <p className="text-muted-foreground mb-6">
              Попробуйте изменить запрос или просмотреть все наши товары
            </p>
            <Button 
              variant="outline"
              onClick={() => setSearchParams({})}
            >
              Очистить поиск
            </Button>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Search;
