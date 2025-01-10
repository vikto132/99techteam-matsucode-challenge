'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import CurrencyForm from '@/components/currency-form';
import { Input } from '@/components/ui/input';
import PredictConvertAmount from '@/components/predict-convert-amount';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCcw } from 'lucide-react';
import Message from '@/components/message';

export default function Home() {
  const [formData, setFormData] = useState({
    fromCurrency: '',
    toCurrency: '',
    amount: '',
  });

  const [error, setError] = useState('');
  const [exchangeSuccess, setExchangeSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData({ ...formData, amount: value });
    setExchangeSuccess(false);
    if (isNaN(+value) || +value <= 0) {
      setError('Please enter a valid amount 🙂.');
      return;
    }
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fromCurrency, toCurrency, amount } = formData;

    if (!fromCurrency || !toCurrency || !amount) {
      setError('Please fill out all fields 😒.');
      return;
    }

    if (isNaN(+amount) || +amount <= 0) {
      setError('Please enter a valid amount 🙂.');
      return;
    }

    setError('');
    setLoading(true);
    // Handle form submission, e.g., API call to exchange cryptocurrency
    try {
      await fetch('/api/exchange', {
        method: 'POST',
        body: JSON.stringify({ from: fromCurrency, to: toCurrency, amount }),
      }).then((res) => res.json());
      setExchangeSuccess(true);
      setFormData((prev) => ({ ...prev, amount: '' }));
    } catch (e) {
      setError('Something went wrong. Please try again later 😶‍🌫️.');
      setExchangeSuccess(false);
    }
    setLoading(false);
  };

  const onCurrencySelected = (currency: { from: string; to: string }) => {
    setFormData((prev) => ({ ...prev, toCurrency: currency.to, fromCurrency: currency.from }));
  };

  const { fromCurrency, toCurrency, amount } = formData;
  const disabled = !fromCurrency || !toCurrency || !amount || isNaN(+amount) || +amount <= 0;

  const isSelectCurrency = fromCurrency && toCurrency;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Cryptocurrency Exchange
        </h2>
        <CurrencyForm onCurrencySelected={onCurrencySelected} />
        <div className={cn(isSelectCurrency ? 'block' : 'hidden')}>
          <Input
            id="amount"
            name="amount"
            type="text"
            value={amount}
            onChange={handleChange}
            disabled={loading}
            placeholder="Enter amount"
            className="mt-1 w-full rounded border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="py-2">
          <PredictConvertAmount amount={+amount} from={fromCurrency} to={toCurrency} />
          {error && <Message className="bg-red-100 text-red-600">{error}</Message>}
          {exchangeSuccess && (
            <Message className="bg-green-100 text-green-600">Exchange success! 🎉🎉🎉</Message>
          )}
        </div>
        <Button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={disabled || loading}
        >
          Exchange {loading && <RefreshCcw className="h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </div>
  );
}
