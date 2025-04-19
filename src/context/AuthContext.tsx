
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
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('coffee-shop-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user exists in our "database"
      const existingUser = findUserByEmail(email);
      
      if (existingUser) {
        // In a real app, we would verify the password here
        setUser(existingUser);
        localStorage.setItem('coffee-shop-user', JSON.stringify(existingUser));
      } else {
        // For demo purposes, create a new user if not found
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if this is the admin email
      if (email === 'admin@coffee.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email,
          name: 'Администратор',
          role: 'admin',
          orders: []
        };
        
        // Make sure admin exists in our user list
        addUser(adminUser);
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
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        orders: []
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
  
  // Add a new order to the user's order history
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
  
  // Update the status of an existing order
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (!user) return;
    
    const updatedOrders = user.orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    
    const updatedUser = {
      ...user,
      orders: updatedOrders
    };
    
    updateUser(updatedUser);
    setUser(updatedUser);
    localStorage.setItem('coffee-shop-user', JSON.stringify(updatedUser));
  };
  
  // Get all registered users (for admin panel)
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
