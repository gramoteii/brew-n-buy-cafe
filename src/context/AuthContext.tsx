import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Order } from '../types';
import { useUsers } from '../hooks/useUsers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUserOrders: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => User | null;
  getAllUsers: () => User[];
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
  const { users, addUser, updateUser, findUserByEmail } = useUsers();

  useEffect(() => {
    const storedUser = localStorage.getItem('coffee-shop-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        if (!parsedUser.orders) {
          parsedUser.orders = [];
        }
        
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user:', error);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const existingUser = findUserByEmail(email);
      
      if (existingUser) {
        if (!existingUser.orders) {
          existingUser.orders = [];
        }
        
        setUser(existingUser);
        localStorage.setItem('coffee-shop-user', JSON.stringify(existingUser));
      } else {
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name: 'Уважаемый Клиент',
          role: 'user',
          orders: []
        };
        
        addUser(newUser);
        setUser(newUser);
        localStorage.setItem('coffee-shop-user', JSON.stringify(newUser));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (email === 'admin@coffee.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email,
          name: 'Администратор',
          role: 'admin',
          orders: []
        };
        
        addUser(adminUser);
        setUser(adminUser);
        localStorage.setItem('coffee-shop-user', JSON.stringify(adminUser));
      } else {
        throw new Error('Неверные учетные данные администрат��ра');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        orders: [],
        createdAt: new Date().toISOString(),
      };
      
      addUser(newUser);
      setUser(newUser);
      localStorage.setItem('coffee-shop-user', JSON.stringify(newUser));
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
  
  const updateUserOrders = (order: Order) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      orders: [...(user.orders || []), order]
    };
    
    updateUser(updatedUser);
    setUser(updatedUser);
    localStorage.setItem('coffee-shop-user', JSON.stringify(updatedUser));
  };
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const allUsers = users;
    let updatedUserWithOrder: User | null = null;
    
    for (const currentUser of allUsers) {
      if (!currentUser.orders) continue;
      
      const orderIndex = currentUser.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        const updatedOrders = [...currentUser.orders];
        updatedOrders[orderIndex] = {
          ...updatedOrders[orderIndex],
          status
        };
        
        const updatedUser = {
          ...currentUser,
          orders: updatedOrders
        };
        
        updateUser(updatedUser);
        
        if (user && user.id === currentUser.id) {
          setUser(updatedUser);
          localStorage.setItem('coffee-shop-user', JSON.stringify(updatedUser));
        }
        
        updatedUserWithOrder = updatedUser;
        break;
      }
    }
    
    return updatedUserWithOrder;
  };
  
  const getAllUsers = () => {
    return users;
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
        logout,
        updateUserOrders,
        updateOrderStatus,
        getAllUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
