
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
        <CardTitle>{isEditing ? 'Редактировать товар' : 'Добавить новый товар'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Внесите изменения в информацию о товаре'
            : 'Заполните форму для добавления нового товара в магазин'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Название</Label>
            <Input 
              id="productName" 
              value={product.name || ''} 
              onChange={onChange}
              placeholder="Введите название товара" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productPrice">Цена (₽)</Label>
            <Input 
              id="productPrice" 
              type="number" 
              value={product.price || 0} 
              onChange={onChange}
              placeholder="0" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productShortDescription">Краткое описание</Label>
          <Input 
            id="productShortDescription" 
            value={product.shortDescription || ''} 
            onChange={onChange}
            placeholder="Краткое описание товара" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productCategory">Категория</Label>
          <select 
            id="productCategory"
            className="w-full px-3 py-2 border border-border rounded-md"
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
          <Label htmlFor="productDescription">Описание</Label>
          <Textarea 
            id="productDescription"
            value={product.description || ''}
            onChange={onChange}
            placeholder="Введите подробное описание товара"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productImage">Изображение</Label>
          <Input 
            id="productImage" 
            value={product.image || ''} 
            onChange={onChange}
            placeholder="URL изображения"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="productInStock"
            checked={product.inStock || false}
            onChange={onChange}
            className="h-4 w-4"
          />
          <Label htmlFor="productInStock">В наличии</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="productCustomizable"
            checked={product.customizable || false}
            onChange={onChange}
            className="h-4 w-4"
          />
          <Label htmlFor="productCustomizable">Можно настроить</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <Button variant="outline" onClick={onCancel}>Отмена</Button>
        ) : (
          <Button variant="outline" onClick={onClear}>Очистить</Button>
        )}
        <Button onClick={onSubmit}>
          {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
