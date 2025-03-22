
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAdditions } from '../data/products';
import { motion } from 'framer-motion';
import { X, ShoppingBag, ChevronLeft, ShoppingCart } from 'lucide-react';
import { ProductSize } from '../types';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/cart' } });
      return;
    }
    
    navigate('/checkout');
  };
  
  const formatSize = (size: ProductSize) => {
    return size === 'short' ? 'Short' :
           size === 'tall' ? 'Tall' :
           size === 'grande' ? 'Grande' : 'Venti';
  };
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-serif mb-8">Корзина</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart size={64} className="mx-auto text-muted-foreground mb-6" />
            <h2 className="text-2xl font-serif mb-4">Ваша корзина пуста</h2>
            <p className="text-muted-foreground mb-8">
              Добавьте товары в корзину, чтобы продолжить покупки
            </p>
            <Link to="/products">
              <Button>Начать покупки</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="divide-y divide-border">
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 sm:p-6"
                    >
                      <div className="flex items-start">
                        {/* Product image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden mr-4 sm:mr-6 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg mb-1">{item.product.name}</h3>
                              {item.customization.size && (
                                <p className="text-sm text-muted-foreground">
                                  Размер: {formatSize(item.customization.size)}
                                </p>
                              )}
                              
                              {/* Customizations for coffee */}
                              {item.product.category === 'coffee' && item.product.customizable && (
                                <div className="mt-2 text-sm">
                                  {item.customization.sugar && item.customization.sugar > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Сахар (×{item.customization.sugar})</span>
                                      <span>+{item.customization.sugar * productAdditions.sugar.price} ₽</span>
                                    </div>
                                  )}
                                  
                                  {item.customization.pahlava && item.customization.pahlava > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Пахлава (×{item.customization.pahlava})</span>
                                      <span>+{item.customization.pahlava * productAdditions.pahlava.price} ₽</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-end mt-4">
                            {/* Quantity control */}
                            <div className="flex items-center border border-border rounded-lg">
                              <button
                                onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              >
                                -
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              >
                                +
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="font-medium">
                              {item.totalPrice} ₽
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Continue shopping */}
                <div className="p-4 sm:p-6 border-t border-border">
                  <Link 
                    to="/products"
                    className="flex items-center text-sm text-primary hover:underline"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Продолжить покупки
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div>
              <div className="bg-white rounded-lg border border-border shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">Ваш заказ</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Сумма товаров</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Стоимость доставки</span>
                    <span>Бесплатно</span>
                  </div>
                  
                  <div className="border-t border-border pt-4 flex justify-between font-medium">
                    <span>Итого</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button
                    fullWidth
                    onClick={handleCheckout}
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    Оформить заказ
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={clearCart}
                  >
                    Очистить корзину
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Cart;
