import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CardForm from '../components/checkout/CardForm';
import YooKassaForm from '../components/payment/YooKassaForm';
import { useToast } from '@/hooks/use-toast';
import { OrderItem, OrderStatus } from '@/types';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');
  const [showYooKassa, setShowYooKassa] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    comments: '',
  });
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: '/checkout' }} />;
  }
  
  if (items.length === 0) {
    return <Navigate to="/cart" />;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите ваше имя",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.phone.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите номер телефона",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.address.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите адрес доставки",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const proceedToPayment = () => {
    if (validateForm()) {
      setPaymentStep('payment');
    }
  };
  
  const handlePaymentComplete = (status: 'success' | 'error', transactionId?: string) => {
    if (status === 'success') {
      // Create order items from cart items
      const orderItems: OrderItem[] = items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        customization: item.customization
      }));
      
      // Create order without ID (it will be generated in the addOrder function)
      const orderData = {
        userId: user?.id || 'guest',
        items: orderItems,
        totalPrice: totalPrice,
        status: 'processing' as OrderStatus,
        createdAt: new Date().toISOString()
      };
      
      // Add the order and get back the generated ID
      const orderId = addOrder(orderData);
      
      // Clear cart
      clearCart();
      
      // Show success message
      toast({
        title: "Заказ оформлен",
        description: `Номер заказа: ${orderId}`,
      });
      
      // Navigate to success page
      navigate('/profile', { state: { orderSuccess: true, orderId } });
    } else {
      toast({
        title: "Ошибка оплаты",
        description: "Не удалось провести платеж. Попробуйте еще раз",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4"
      >
        <h1 className="text-3xl md:text-4xl font-serif mb-8">Оформление заказа</h1>
        
        {paymentStep === 'details' ? (
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-serif mb-6">Контактная информация</h2>
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-base">Имя</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Иван Иванов"
                    className="text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    className="text-base"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-base">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+7 (999) 123-45-67"
                  className="text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="address" className="text-base">Адрес доставки</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="ул. Пушкина, д. 10, кв. 5"
                  className="text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="city" className="text-base">Город</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Москва"
                  className="text-base"
                />
              </div>
              
              <div>
                <Label htmlFor="comments" className="text-base">Комментарий к заказу</Label>
                <Textarea
                  id="comments"
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  placeholder="Дополнительная информация по заказу"
                  className="text-base"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/cart')}
                className="order-2 md:order-1"
              >
                Вернуться в корзину
              </Button>
              
              <div className="order-1 md:order-2 flex flex-col md:flex-row gap-4">
                <Button onClick={() => setShowYooKassa(true)}>
                  Оплатить через ЮKassa
                </Button>
                <Button onClick={proceedToPayment}>
                  Продолжить
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h2 className="text-2xl font-serif mb-6">Способ оплаты</h2>
            <CardForm />
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setPaymentStep('details')}
              >
                Назад
              </Button>
              
              <Button onClick={() => handlePaymentComplete('success')}>
                Завершить оформление
              </Button>
            </div>
          </div>
        )}
        
        {showYooKassa && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-lg w-full">
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="text-lg font-medium">ЮKassa (демо)</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowYooKassa(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-4">
                <YooKassaForm 
                  amount={totalPrice} 
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Checkout;
