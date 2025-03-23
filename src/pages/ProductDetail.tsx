
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { products, productAdditions, sizeTranslations } from '../data/products';
import { Product, ProductSize } from '../types';
import { motion } from 'framer-motion';
import { ShoppingCart, Coffee, ChevronLeft, Star, Heart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from '../hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  
  // Find product by ID
  const product = products.find(p => p.id === id);
  
  // States for product customization
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(
    product?.variations?.[0]?.size
  );
  const [quantity, setQuantity] = useState(1);
  const [sugar, setSugar] = useState(0);
  const [pahlava, setPahlava] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  
  // Calculate current price based on selected size
  const currentPrice = product?.variations?.find(v => v.size === selectedSize)?.price || product?.price || 0;
  
  // Check if product is in favorites
  const isFavorite = product ? favorites.includes(product.id) : false;

  // Reset customization when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.variations?.[0]?.size);
      setQuantity(1);
      setSugar(0);
      setPahlava(0);
    }
  }, [product]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/auth', { state: { from: `/product/${id}` } });
      return;
    }
    
    addToCart(
      product,
      quantity,
      {
        size: selectedSize,
        sugar: sugar,
        pahlava: pahlava
      }
    );

    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в корзину`,
    });
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/product/${id}` } });
      return;
    }
    
    toggleFavorite(product.id);
    
    toast({
      title: isFavorite ? "Удалено из избранного" : "Добавлено в избранное",
      description: `${product.name} ${isFavorite ? "удален из" : "добавлен в"} избранное`,
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
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link to="/products" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Назад к продуктам
          </Link>
        </div>
        
        {/* Product details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product image */}
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
          
          {/* Product info */}
          <div>
            {/* Category tag */}
            <div className="bg-secondary inline-block px-3 py-1 rounded-full text-xs font-medium text-secondary-foreground mb-4">
              {product.category === 'coffee' ? 'Кофе' :
               product.category === 'tea' ? 'Сладости' :
               product.category === 'accessory' ? 'Аксессуары' : 'Подарки'}
            </div>
            
            <div className="flex justify-between items-start">
              <h1 className="text-3xl md:text-4xl font-serif mb-2">{product.name}</h1>
              <button 
                onClick={handleToggleFavorite}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  isFavorite ? "text-red-500 hover:bg-red-100" : "text-gray-400 hover:bg-gray-100"
                )}
              >
                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= Math.round(product.rating) ? "currentColor" : "none"}
                    className={star <= Math.round(product.rating) ? "text-amber-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground ml-2">
                {product.rating.toFixed(1)} ({product.reviewCount} отзывов)
              </span>
            </div>
            
            {/* Price */}
            <div className="text-2xl font-serif font-medium mb-6">
              {currentPrice} ₽
            </div>
            
            {/* Short description */}
            <p className="text-muted-foreground mb-8">
              {product.shortDescription}
            </p>
            
            {/* Size selection for coffee/tea */}
            {product.variations && product.variations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Размер:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variations.map(variation => (
                    <button
                      key={variation.size}
                      onClick={() => setSelectedSize(variation.size)}
                      className={cn(
                        "px-4 py-2 rounded-lg border transition-colors",
                        selectedSize === variation.size
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {sizeTranslations[variation.size] || variation.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sugar and Pahlava options (only for coffee) */}
            {product.category === 'coffee' && product.customizable && (
              <>
                {/* Sugar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Кубики сахара:</h3>
                    <span className="text-sm text-muted-foreground">
                      +{sugar * productAdditions.sugar.price} ₽
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3, 4, 5].map(value => (
                      <button
                        key={value}
                        onClick={() => setSugar(value)}
                        className={cn(
                          "w-10 h-10 rounded-lg border flex items-center justify-center transition-colors",
                          sugar === value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Pahlava */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Пахлава:</h3>
                    <span className="text-sm text-muted-foreground">
                      +{pahlava * productAdditions.pahlava.price} ₽
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3, 4, 5].map(value => (
                      <button
                        key={value}
                        onClick={() => setPahlava(value)}
                        className={cn(
                          "w-10 h-10 rounded-lg border flex items-center justify-center transition-colors",
                          pahlava === value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {/* Quantity and Add to cart */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  -
                </button>
                <span className="w-10 h-10 flex items-center justify-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  +
                </button>
              </div>
              
              <Button 
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} className="mr-2" />
                Добавить в корзину
              </Button>
            </div>
            
            {/* Total price */}
            <div className="bg-secondary p-4 rounded-lg mb-8">
              <div className="flex justify-between">
                <span className="font-medium">Итого:</span>
                <span className="font-medium">
                  {(currentPrice + 
                    (sugar * productAdditions.sugar.price) + 
                    (pahlava * productAdditions.pahlava.price)) * quantity} ₽
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional information tabs */}
        <div className="mt-16">
          <div className="border-b border-border">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={cn(
                  "pb-4 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === 'description'
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Описание
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={cn(
                  "pb-4 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === 'reviews'
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Отзывы ({product.reviewCount})
              </button>
            </div>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' ? (
              <div>
                <p className="mb-6">{product.description}</p>
                
                {/* Product details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Состав:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {product.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Nutrition info (for coffee and tea) */}
                  {(product.category === 'coffee' || product.category === 'tea') && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Калорийность:</h3>
                      <ul className="space-y-1 text-muted-foreground">
                        {Object.entries(product.calories).map(([size, calories]) => (
                          <li key={size} className="flex justify-between border-b border-border/50 pb-1">
                            <span>
                              {sizeTranslations[size] || size}
                            </span>
                            <span>{calories} ккал</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <ReviewList productId={product.id} />
                <ReviewForm productId={product.id} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ProductDetail;
