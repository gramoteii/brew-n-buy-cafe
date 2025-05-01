
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  amount: number;
  onPaymentComplete: (status: 'success' | 'error', transactionId?: string) => void;
}

const YooKassaForm: React.FC<PaymentFormProps> = ({ amount, onPaymentComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'number') {
      // Format card number with spaces after every 4 digits
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails({ ...cardDetails, [name]: formatted });
    } else if (name === 'expiry') {
      // Format expiry as MM/YY
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
      }
      
      setCardDetails({ ...cardDetails, [name]: formatted });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
        toast({
          title: "Ошибка",
          description: "Введите корректный номер карты",
          variant: "destructive",
        });
        return false;
      }
      
      if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
        toast({
          title: "Ошибка",
          description: "Введите корректный срок действия карты в формате ММ/ГГ",
          variant: "destructive",
        });
        return false;
      }
      
      if (!cardDetails.cvc || cardDetails.cvc.length !== 3) {
        toast({
          title: "Ошибка",
          description: "Введите корректный CVC/CVV код",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // For demo purposes, always succeed
      const transactionId = `YK_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      toast({
        title: "Оплата успешна",
        description: `Транзакция: ${transactionId}`,
      });
      
      onPaymentComplete('success', transactionId);
    }, 2000);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <img 
            src="https://yoomoney.ru/i/html-letters/marketing-emails/header-logo.png" 
            alt="ЮKassa" 
            className="h-8 mr-2" 
          />
          <CardTitle>Оплата заказа</CardTitle>
        </div>
        <CardDescription>
          Сумма к оплате: {amount} ₽
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="card" onValueChange={(val) => setPaymentMethod(val as 'card' | 'cash')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="card" className="flex items-center">
              <CreditCard size={16} className="mr-2" />
              Картой
            </TabsTrigger>
            <TabsTrigger value="cash" className="flex items-center">
              <DollarSign size={16} className="mr-2" />
              Наличными
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Номер карты</Label>
                <Input
                  id="card-number"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-expiry">Срок действия</Label>
                  <Input
                    id="card-expiry"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-cvc">CVC/CVV</Label>
                  <Input
                    id="card-cvc"
                    name="cvc"
                    type="password"
                    value={cardDetails.cvc}
                    onChange={handleInputChange}
                    placeholder="•••"
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card-name">Имя держателя карты</Label>
                <Input
                  id="card-name"
                  name="name"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                  placeholder="IVAN IVANOV"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={isProcessing}
              >
                {isProcessing ? 'Обработка платежа...' : 'Оплатить'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="cash">
            <div className="space-y-4">
              <div className="bg-secondary p-4 rounded-lg text-center">
                <CheckCircle size={40} className="mx-auto mb-2 text-primary" />
                <p>Оплата наличными при получении</p>
                <p className="text-sm text-muted-foreground">Возможна для доставки и самовывоза</p>
              </div>
              
              <Button 
                onClick={handleSubmit}
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? 'Оформление...' : 'Продолжить'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col items-start text-sm text-muted-foreground">
        <p className="mb-1">Это демонстрационная форма, платеж не будет проведен.</p>
        <p>В рабочем режиме будет использован платежный шлюз ЮKassa.</p>
      </CardFooter>
    </Card>
  );
};

export default YooKassaForm;
