
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { debounce } from '@/lib/utils';

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
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);
  
  // Debounced search handler
  const debouncedSearchChange = debounce((value: string) => {
    onSearchChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
  }, 300);
  
  // Handle local search input changes
  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearchChange(value);
  };
  
  // Filter products when searchTerm or products change
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setDisplayedProducts(filtered);
    } else {
      setDisplayedProducts(products);
    }
  }, [searchTerm, products]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Управление товарами</CardTitle>
        <CardDescription className="text-base">
          Редактирование и удаление существующих товаров
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <Input 
            placeholder="Поиск товаров..." 
            value={localSearchTerm}
            onChange={handleLocalSearchChange}
            className="text-base"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base">Название</TableHead>
                <TableHead className="text-base">Категория</TableHead>
                <TableHead className="text-base">Цена</TableHead>
                <TableHead className="text-base">В наличии</TableHead>
                <TableHead className="text-base">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-base">{product.name}</TableCell>
                  <TableCell className="text-base">
                    {product.category === 'coffee' && 'Кофе'}
                    {product.category === 'sweets' && 'Сладости'}
                    {product.category === 'accessory' && 'Аксессуары'}
                    {product.category === 'gift' && 'Подарки'}
                  </TableCell>
                  <TableCell className="text-base">{product.price} ₽</TableCell>
                  <TableCell className="text-base">{product.inStock ? 'Да' : 'Нет'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => onEdit(product)}
                      className="text-base"
                    >
                      Изменить
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="text-base">Удалить</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl">Удалить товар?</AlertDialogTitle>
                          <AlertDialogDescription className="text-base">
                            Вы уверены, что хотите удалить товар "{product.name}"? Это действие нельзя отменить.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="text-base">Отмена</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(product.id)}
                            className="text-base"
                          >
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
