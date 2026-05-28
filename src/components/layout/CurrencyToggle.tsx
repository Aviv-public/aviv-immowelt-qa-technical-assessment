import React from 'react';
import { DollarSign } from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import { Select } from '../ui/Select';

export const CurrencyToggle = () => {
  const { currency, setCurrency } = useCurrency();

  const currencyOptions = [
    { value: 'USD', label: '$ USD' },
    { value: 'EUR', label: '€ EUR' },
  ];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as 'USD' | 'EUR');
  };

  return (
    <div className="flex items-center">
      <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
      <Select
        options={currencyOptions}
        value={currency}
        onChange={handleCurrencyChange}
        className="w-24 text-sm"
      />
    </div>
  );
};