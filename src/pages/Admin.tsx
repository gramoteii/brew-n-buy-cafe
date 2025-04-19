
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminStatistics } from '@/components/admin/AdminStatistics';
import { AdminUsersList } from '@/components/admin/AdminUsersList';
import { AdminOrderHistory } from '@/components/admin/AdminOrderHistory';

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Панель администратора</h1>
            <p className="text-muted-foreground">
              Добро пожаловать, {user?.name}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>

        {/* Statistics Section */}
        <div className="mb-8">
          <AdminStatistics />
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersList />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
