import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { MoveRight } from 'lucide-react';
import CurrencySelection from '@/components/currency-selection';
import { cn } from '@/lib/utils';

type Props = {
  onCurrencySelected: (currency: { from: string; to: string }) => void;
};

type Currency = {
  code: string;
  image: string;
};

const getCurrencyImage = (code: string) => {
  return `https://github.com/Switcheo/token-icons/blob/main/tokens/${code.toUpperCase()}.svg?raw=true`;
};

export default function CurrencyForm(props: Props) {
  const { onCurrencySelected } = props;

  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);
  const [error, setError] = useState('');

  const onSelectCurrency = (code: string, type: 'from' | 'to') => {
    const selectedCurrencyCode = type === 'from' ? toCurrency?.code : fromCurrency?.code;
    if (selectedCurrencyCode === code) {
      setError('Please select different currency.');
      return;
    }
    const currency = { from: '', to: '', [type]: code };
    if (type === 'from') {
      setFromCurrency({ code, image: getCurrencyImage(code) });
      currency.to = toCurrency?.code ?? '';
    } else {
      setToCurrency({ code, image: getCurrencyImage(code) });
      currency.from = fromCurrency?.code ?? '';
    }
    onCurrencySelected(currency);
    setError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <CurrencySelection onSelected={(code) => onSelectCurrency(code, 'from')}>
          <Avatar className="h-20 w-20">
            <AvatarImage src={fromCurrency?.image} alt={fromCurrency?.code ?? ''} />
            <AvatarFallback>{fromCurrency?.code ?? '$$$'}</AvatarFallback>
          </Avatar>
          <span className={cn(fromCurrency?.code ? '' : 'text-transparent')}>
            {fromCurrency?.code ?? 'none'}
          </span>
        </CurrencySelection>
        <MoveRight className="h-20 w-20" />
        <CurrencySelection onSelected={(code) => onSelectCurrency(code, 'to')}>
          <Avatar className="h-20 w-20">
            <AvatarImage src={toCurrency?.image} alt={toCurrency?.code ?? ''} />
            <AvatarFallback>{toCurrency?.code ?? '$$$'}</AvatarFallback>
          </Avatar>
          <span className={cn(toCurrency?.code ? '' : 'text-transparent')}>
            {toCurrency?.code ?? 'none'}
          </span>
        </CurrencySelection>
      </div>
      {error && <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
