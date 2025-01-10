import { CryptoCurrency } from '@/types/currency';
import { uniqBy } from 'lodash';
import { NextResponse } from 'next/server';

async function fetchDistinctCryptoCurrencies() {
  const response = (await fetch('https://interview.switcheo.com/prices.json').then((res) =>
    res.json(),
  )) as CryptoCurrency[];

  return uniqBy(response, (e) => e.currency);
}

export async function GET(request: Request) {
  const currencies = await fetchDistinctCryptoCurrencies();

  const queryParams = new URLSearchParams(request.url);
  const currencyCode = queryParams.get('currency');
  if (!currencyCode) {
    return Response.json(currencies);
  }

  return Response.json(
    currencies
      .filter(({ currency }) => currency.toLowerCase().includes(currencyCode.toLowerCase()))
      .slice(0, 10),
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { amount, from, to } = body;
  if (!amount || !from || !to) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const currencies = await fetchDistinctCryptoCurrencies();

  const fromCurrency = currencies.find(
    ({ currency }) => currency.toLowerCase() === from.toLowerCase(),
  );
  if (!fromCurrency) {
    return NextResponse.json({ error: 'Not found currency' }, { status: 400 });
  }
  const toCurrency = currencies.find(({ currency }) => currency.toLowerCase() === to.toLowerCase());
  if (!toCurrency) {
    return NextResponse.json({ error: 'Not found currency' }, { status: 400 });
  }
  const convertedAmount = (amount * fromCurrency.price) / toCurrency.price;
  return NextResponse.json(convertedAmount);
}
