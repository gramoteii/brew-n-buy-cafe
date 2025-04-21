
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CardForm = () => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <Label htmlFor="cardNumber">Номер карты</Label>
        <Input
          id="cardNumber"
          type="text"
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          className="font-mono"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = formattedValue;
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Срок действия</Label>
          <Input
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            className="font-mono"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length >= 2) {
                const month = value.slice(0, 2);
                const year = value.slice(2);
                e.target.value = `${month}/${year}`;
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="***"
            maxLength={3}
            className="font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default CardForm;
