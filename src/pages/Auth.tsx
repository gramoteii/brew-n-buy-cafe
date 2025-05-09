
import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

type AuthTab = 'login' | 'register' | 'admin';

const Auth = () => {
  const { isAuthenticated, isAdmin, login, register, adminLogin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect after login
  const from = location.state?.from || '/';
  
  // If already authenticated, redirect
  if (isAuthenticated) {
    // Redirect admin to admin dashboard
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    // Redirect regular user to previous page or home
    return <Navigate to={from} replace />;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'login') {
        await login(email, password);
        toast({
          title: 'Вход выполнен успешно',
          description: 'Добро пожаловать в наш магазин!',
        });
        navigate(from, { replace: true });
      } else if (activeTab === 'register') {
        await register(email, password, name);
        toast({
          title: 'Регистрация завершена',
          description: 'Ваш аккаунт успешно создан!',
        });
        navigate(from, { replace: true });
      } else if (activeTab === 'admin') {
        await adminLogin(email, password);
        toast({
          title: 'Вход администратора выполнен',
          description: 'Добро пожаловать в панель управления!',
        });
        navigate('/admin', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при входе или регистрации',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-border shadow-sm p-8"
        >
          <h1 className="text-2xl font-serif text-center mb-6">
            {activeTab === 'login' ? 'Вход в аккаунт' : 
             activeTab === 'register' ? 'Регистрация' : 
             'Вход для администратора'}
          </h1>
          
          {/* Tab navigation */}
          <div className="flex mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={cn(
                "flex-1 text-center py-2.5 border-b-2 transition-colors text-sm font-medium",
                activeTab === 'login'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Вход
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={cn(
                "flex-1 text-center py-2.5 border-b-2 transition-colors text-sm font-medium",
                activeTab === 'register'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Регистрация
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={cn(
                "flex-1 text-center py-2.5 border-b-2 transition-colors text-sm font-medium",
                activeTab === 'admin'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Админ
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Имя
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Введите ваш email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Введите ваш пароль"
                required
              />
            </div>
            
            {activeTab === 'admin' && (
              <div className="text-sm text-muted-foreground">
                <p>Для демо-версии:</p>
                <p>Email: admin@coffee.com</p>
                <p>Пароль: admin123</p>
              </div>
            )}
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              {activeTab === 'login' ? 'Войти' : 
               activeTab === 'register' ? 'Зарегистрироваться' : 
               'Войти как администратор'}
            </Button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Auth;
