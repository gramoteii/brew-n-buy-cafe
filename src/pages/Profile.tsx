
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { motion } from 'framer-motion';
import { User, LogOut, ShoppingBag, Clock, Package, Check, Truck, X } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const userOrders = getUserOrders(user.id);
  const hasOrders = userOrders && userOrders.length > 0;
  
  console.log('User orders:', userOrders); // For debugging
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-muted-foreground" />;
      case 'processing':
        return <Package size={16} className="text-amber-500" />;
      case 'shipped':
        return <Truck size={16} className="text-blue-500" />;
      case 'delivered':
        return <Check size={16} className="text-green-500" />;
      case 'cancelled':
        return <X size={16} className="text-destructive" />;
      default:
        return <Clock size={16} className="text-muted-foreground" />;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };
  
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-serif mb-8">Личный кабинет</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                    <User size={24} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-medium">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button 
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'profile' ? 'bg-secondary text-primary' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={16} className="inline mr-2" />
                  Профиль
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-secondary text-primary' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <ShoppingBag size={16} className="inline mr-2" />
                  Мои заказы
                </button>
                
                <button 
                  className="w-full text-left p-3 rounded-lg text-destructive hover:bg-secondary/50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="inline mr-2" />
                  Выйти
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg border border-border p-6">
                <h2 className="text-xl font-medium mb-6">Данные пользователя</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full p-3 bg-secondary/50 border border-border rounded-lg"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Выйти из аккаунта
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-medium">История заказов</h2>
                </div>
                
                {hasOrders ? (
                  <div className="divide-y divide-border">
                    {userOrders.map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <span>Заказ {order.id}</span>
                              <span className="ml-3 flex items-center text-sm">
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
                              </span>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <span className="font-medium">{order.totalPrice} ₽</span>
                        </div>
                        
                        <div className="bg-secondary/50 rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-2">Товары в заказе:</h4>
                          <ul className="space-y-2">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-sm flex justify-between">
                                <span>{item.product.name} × {item.quantity}</span>
                                <span>{item.totalPrice} ₽</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">У вас еще нет заказов</h3>
                    <p className="text-muted-foreground mb-4">
                      Начните совершать покупки, чтобы увидеть историю заказов
                    </p>
                    <Button
                      onClick={() => navigate('/products')}
                    >
                      Перейти к товарам
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Profile;
