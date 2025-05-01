
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Product, ProductCategory } from '@/types';

interface ProductFormProps {
  product: Partial<Product>;
  isEditing: boolean;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCancel: () => void;
  onClear?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isEditing,
  onSubmit,
  onChange,
  onCancel,
  onClear
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{isEditing ? 'Редактировать товар' : 'Добавить новый товар'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Внесите изменения в информацию о товаре'
            : 'Заполните форму для добавления нового товара в магазин'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Название</Label>
            <Input 
              id="name" 
              name="name"
              value={product.name || ''} 
              onChange={onChange}
              placeholder="Введите название товара" 
              className="text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-base">Цена (₽)</Label>
            <Input 
              id="price" 
              name="price"
              type="number" 
              value={product.price || 0} 
              onChange={onChange}
              placeholder="0" 
              className="text-base"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="shortDescription" className="text-base">Краткое описание</Label>
          <Input 
            id="shortDescription" 
            name="shortDescription"
            value={product.shortDescription || ''} 
            onChange={onChange}
            placeholder="Краткое описание товара" 
            className="text-base"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-base">Категория</Label>
          <select 
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-border rounded-md text-base"
            value={product.category || 'coffee'}
            onChange={onChange}
          >
            <option value="coffee">Кофе</option>
            <option value="sweets">Сладости</option>
            <option value="accessory">Аксессуары</option>
            <option value="gift">Подарки</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">Описание</Label>
          <Textarea 
            id="description"
            name="description"
            value={product.description || ''}
            onChange={onChange}
            placeholder="Введите подробное описание товара"
            rows={4}
            className="text-base"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image" className="text-base">Изображение</Label>
          <Input 
            id="image" 
            name="image"
            value={product.image || ''} 
            onChange={onChange}
            placeholder="URL изображения"
            className="text-base"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={product.inStock || false}
            onChange={onChange}
            className="h-5 w-5"
          />
          <Label htmlFor="inStock" className="text-base">В наличии</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="customizable"
            name="customizable"
            checked={product.customizable || false}
            onChange={onChange}
            className="h-5 w-5"
          />
          <Label htmlFor="customizable" className="text-base">Можно настроить</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <Button variant="outline" onClick={onCancel} className="text-base">Отмена</Button>
        ) : (
          <Button variant="outline" onClick={onClear} className="text-base">Очистить</Button>
        )}
        <Button onClick={onSubmit} className="text-base">
          {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
