
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { motion } from 'framer-motion';

interface FeaturedProductsProps {
  title: string;
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ title, products }) => {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-serif font-medium tracking-tight mb-2">
          {title}
        </h2>
        <div className="w-20 h-1 bg-primary mb-8"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
