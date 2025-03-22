
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
import { Check, CreditCard, Truck, ChevronLeft } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  // Validation states
  const [formErrors, setFormErrors] = useState({
    address: false,
    city: false,
    postalCode: false,
  });

  const validateForm = () => {
    const errors = {
      address: !address.trim(),
      city: !city.trim(),
      postalCode: !postalCode.trim(),
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the order to a backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create order object (this would be sent to backend)
      const order = {
        items,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user?.id,
        shipping: {
          address,
          city,
          postalCode,
          country: 'Россия',
        },
        payment: {
          method: paymentMethod,
          transactionId: `TR-${Date.now()}`,
        },
      };
      
      // Clear cart and navigate to success page
      clearCart();
      
      toast({
        title: "Заказ оформлен",
        description: "Ваш заказ успешно отправлен",
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Пожалуйста, попробуйте еще раз",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-serif mb-4">Ваша корзина пуста</h2>
          <p className="text-muted-foreground mb-8">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <Button onClick={() => navigate('/products')}>
            К товарам
          </Button>
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
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Оформление заказа</h1>
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-primary hover:underline"
          >
            <ChevronLeft size={16} className="mr-1" />
            Вернуться в корзину
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Shipping information */}
              <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-border flex items-center">
                  <Truck size={20} className="mr-2 text-primary" />
                  <h2 className="text-xl font-medium">Информация о доставке</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      Адрес доставки *
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full p-3 border ${
                        formErrors.address ? 'border-destructive' : 'border-border'
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                    />
                    {formErrors.address && (
                      <p className="text-destructive text-sm mt-1">Укажите адрес доставки</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">
                        Город *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`w-full p-3 border ${
                          formErrors.city ? 'border-destructive' : 'border-border'
                        } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                      />
                      {formErrors.city && (
                        <p className="text-destructive text-sm mt-1">Укажите город</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                        Почтовый индекс *
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className={`w-full p-3 border ${
                          formErrors.postalCode ? 'border-destructive' : 'border-border'
                        } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary`}
                      />
                      {formErrors.postalCode && (
                        <p className="text-destructive text-sm mt-1">Укажите почтовый индекс</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment method */}
              <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-border flex items-center">
                  <CreditCard size={20} className="mr-2 text-primary" />
                  <h2 className="text-xl font-medium">Способ оплаты</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="card" className="block text-sm font-medium">
                      Банковская карта
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="paypal" className="block text-sm font-medium">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 lg:hidden">
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg border border-border shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-6">Ваш заказ</h2>
              
              <div className="space-y-4 mb-6">
                <div className="max-h-60 overflow-y-auto space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{item.product.name}</span>
                          <span className="text-sm font-medium">{item.totalPrice} ₽</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Кол-во: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Сумма товаров</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Стоимость доставки</span>
                    <span>Бесплатно</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 flex justify-between font-medium">
                  <span>Итого</span>
                  <span>{totalPrice} ₽</span>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <Button
                  onClick={handleSubmit}
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      Оформление...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Check size={16} className="mr-2" />
                      Оформить заказ
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Checkout;
