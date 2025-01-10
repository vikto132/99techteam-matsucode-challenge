'use client';

import { useState } from 'react';
import CurrencyForm from '@/components/currency-form';
import { Input } from '@/components/ui/input';
import PredictConvertAmount from '@/components/predict-convert-amount';

export default function Home() {
  const [formData, setFormData] = useState({
    fromCurrency: '',
    toCurrency: '',
    amount: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fromCurrency, toCurrency, amount } = formData;

    if (!fromCurrency || !toCurrency || !amount) {
      setError('Please fill out all fields.');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setError('');
    // Handle form submission, e.g., API call to exchange cryptocurrency
  };

  const onCurrencySelected = (currency: { from: string; to: string }) => {
    setFormData((prev) => ({ ...prev, toCurrency: currency.to, fromCurrency: currency.from }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Cryptocurrency Exchange
        </h2>
        <CurrencyForm onCurrencySelected={onCurrencySelected} />
        <div className="mb-4">
          <Input
            id="amount"
            name="amount"
            type="text"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            className="mt-1 w-full rounded border-gray-300 p-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <PredictConvertAmount
            amount={Number(formData.amount)}
            from={formData.fromCurrency}
            to={formData.toCurrency}
          />
        </div>
        {error && <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Exchange
        </button>
      </form>
    </div>
  );
}
