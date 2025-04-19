
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartLine, Users, ChartBar } from 'lucide-react';

export const AdminStatistics = () => {
  const { getAllUsers } = useAuth();
  const users = getAllUsers();
  
  // Calculate total orders across all users
  const totalOrders = users.reduce((total, user) => 
    total + (user.orders?.length || 0), 0);
  
  // Calculate active users (those with orders)
  const activeUsers = users.filter(user => user.orders?.length > 0).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{users.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
          <ChartBar className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
          <ChartLine className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
};
