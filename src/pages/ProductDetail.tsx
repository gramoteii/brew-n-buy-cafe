
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import { Product, ProductSize } from '../types';
import { motion } from 'framer-motion';
import { toast } from '../hooks/use-toast';

// Import the new components
import ProductHeader from '../components/product/ProductHeader';
import ProductSizeSelector from '../components/product/ProductSizeSelector';
import ProductCustomization from '../components/product/ProductCustomization';
import ProductPurchase from '../components/product/ProductPurchase';
import ProductTabs from '../components/product/ProductTabs';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    product?.variations?.[0]?.size
  );
  const [quantity, setQuantity] = useState(1);
  const [sugar, setSugar] = useState(0);
  const [parvarda, setParvarda] = useState(0);
  
  const currentPrice = product?.variations?.find(v => v.size === selectedSize)?.price || product?.price || 0;

  useEffect(() => {
    if (product) {
      setSelectedSize(product.variations?.[0]?.size);
      setQuantity(1);
      setSugar(0);
      setParvarda(0);
    }
  }, [product]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/product/${id}` } });
      return;
    }
    
    addToCart(
      product,
      quantity,
      {
        size: selectedSize,
        sugar: sugar,
        parvarda: parvarda
      }
    );

    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в корзину`,
    });
  };
  
  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Товар не найден</h2>
          <Link to="/products">
            <Button>Вернуться к списку товаров</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-xl overflow-hidden">
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover object-center"
            />
          </div>
          
          <div>
            <ProductHeader product={product} />
            
            <ProductSizeSelector 
              product={product} 
              selectedSize={selectedSize} 
              onSizeChange={setSelectedSize} 
            />
            
            <ProductCustomization 
              product={product}
              sugar={sugar}
              parvarda={parvarda}
              onSugarChange={setSugar}
              onParvardaChange={setParvarda}
            />
            
            <ProductPurchase 
              product={product}
              quantity={quantity}
              currentPrice={currentPrice}
              sugar={sugar}
              parvarda={parvarda}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
        
        <ProductTabs product={product} />
      </motion.div>
    </Layout>
  );
};

export default ProductDetail;
