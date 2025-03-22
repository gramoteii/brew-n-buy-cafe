
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('coffee-shop-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real application, this would call an API
    // For demo purposes, we're creating a mock user
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data
      const mockUser: User = {
        id: '1',
        email,
        name: 'Уважаемый Клиент',
        role: 'user',
        orders: []
      };
      
      setUser(mockUser);
      localStorage.setItem('coffee-shop-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    // In a real application, this would verify admin credentials
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if this is the admin email (in a real app, this would be verified on the server)
      if (email === 'admin@coffee.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email,
          name: 'Администратор',
          role: 'admin',
          orders: []
        };
        
        setUser(adminUser);
        localStorage.setItem('coffee-shop-user', JSON.stringify(adminUser));
      } else {
        throw new Error('Неверные учетные данные администратора');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    // In a real application, this would call an API
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user data
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        orders: []
      };
      
      setUser(mockUser);
      localStorage.setItem('coffee-shop-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coffee-shop-user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading, 
        login,
        adminLogin,
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
