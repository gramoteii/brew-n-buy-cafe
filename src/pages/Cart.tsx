
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

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
                    <CartItem
                      key={index}
                      item={item}
                      index={index}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                    />
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
              <CartSummary
                totalPrice={totalPrice}
                onCheckout={handleCheckout}
                onClearCart={clearCart}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Cart;
