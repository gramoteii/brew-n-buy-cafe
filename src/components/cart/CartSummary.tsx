
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Button from '@/components/Button';

interface CartSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
  onClearCart: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  totalPrice,
  onCheckout,
  onClearCart
}) => {
  return (
    <div className="bg-white rounded-lg border border-border shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-medium mb-6">Ваш заказ</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Сумма товаров</span>
          <span>{totalPrice} ₽</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Стоимость доставки</span>
          <span>Бесплатно</span>
        </div>
        
        <div className="border-t border-border pt-4 flex justify-between font-medium">
          <span>Итого</span>
          <span>{totalPrice} ₽</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button
          fullWidth
          onClick={onCheckout}
        >
          <ShoppingBag size={16} className="mr-2" />
          Оформить заказ
        </Button>
        
        <Button
          variant="outline"
          fullWidth
          onClick={onClearCart}
        >
          Очистить корзину
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
