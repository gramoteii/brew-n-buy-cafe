
import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const displayedProducts = searchTerm 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление товарами</CardTitle>
        <CardDescription>
          Редактирование и удаление существующих товаров
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <Input 
            placeholder="Поиск товаров..." 
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>В наличии</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.category === 'coffee' && 'Кофе'}
                    {product.category === 'sweets' && 'Сладости'}
                    {product.category === 'accessory' && 'Аксессуары'}
                    {product.category === 'gift' && 'Подарки'}
                  </TableCell>
                  <TableCell>{product.price} ₽</TableCell>
                  <TableCell>{product.inStock ? 'Да' : 'Нет'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => onEdit(product)}
                    >
                      Изменить
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">Удалить</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить товар?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить товар "{product.name}"? Это действие нельзя отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(product.id)}>
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
