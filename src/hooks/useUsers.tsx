
import { useState, useEffect } from 'react';
import { User } from '../types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  
  // Load users from localStorage on initial render
  useEffect(() => {
    const savedUsers = localStorage.getItem('coffee-shop-users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        // Ensure each user has an orders array
        const usersWithOrders = parsedUsers.map((user: User) => ({
          ...user,
          orders: user.orders || []
        }));
        setUsers(Array.isArray(parsedUsers) ? usersWithOrders : []);
      } catch (error) {
        console.error('Error parsing users:', error);
        setUsers([]);
      }
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('coffee-shop-users', JSON.stringify(users));
    }
  }, [users]);
  
  // Add a new user
  const addUser = (user: User) => {
    setUsers(prev => {
      // Check if user already exists
      const existingUser = prev.find(u => u.id === user.id || u.email === user.email);
      if (existingUser) return prev;
      
      // Ensure the new user has an orders array
      const userWithOrders = {
        ...user,
        orders: user.orders || []
      };
      
      return [...prev, userWithOrders];
    });
  };
  
  // Update an existing user
  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };
  
  // Find user by email
  const findUserByEmail = (email: string) => {
    return users.find(user => user.email === email);
  };
  
  // Find user by ID
  const findUserById = (id: string) => {
    return users.find(user => user.id === id);
  };
  
  return { 
    users, 
    addUser, 
    updateUser, 
    findUserByEmail,
    findUserById
  };
}
