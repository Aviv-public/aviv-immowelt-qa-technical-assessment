import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Currency = 'USD' | 'EUR';

interface CurrencyState {
  currency: Currency;
  exchangeRate: number;
  setCurrency: (currency: Currency) => void;
  convertPrice: (amount: number, targetCurrency: Currency) => number;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      exchangeRate: 0.92, // 1 USD = 0.92 EUR (fixed rate for demo)
      setCurrency: (currency) => set({ currency }),
      convertPrice: (amount: number, targetCurrency: Currency) => {
        const { currency, exchangeRate } = get();
        if (currency === targetCurrency) return amount;
        return targetCurrency === 'EUR' ? amount * exchangeRate : amount / exchangeRate;
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);