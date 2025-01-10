import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { RefreshCcw } from 'lucide-react';

type Props = {
  amount: number;
  from: string;
  to: string;
};

export default function PredictConvertAmount(props: Props) {
  const { amount, from, to } = props;
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const predictPrice = useCallback(
    debounce((amount: number, from: string, to: string) => {
      if (isNaN(amount) || amount <= 0 || !from || !to) {
        setPrediction(null);
        setLoading(false);
        return;
      }
      fetch(`/api/currencies`, { method: 'POST', body: JSON.stringify({ amount, from, to }) })
        .then((res) => res.json())
        .then((predictions) => {
          setPrediction(predictions);
          setLoading(false);
        })
        .catch((e) => console.log(e));
    }, 300),
    [],
  );

  useEffect(() => {
    setLoading(true);
    predictPrice(amount, from, to);
  }, [amount, from, to]);

  if (isNaN(amount) || amount <= 0)
    return (
      <span className="text-sm text-red-500">
        Invalid amount.
      </span>
    );
  if (loading)
    return (
      <span className="flex items-center gap-2 text-sm text-green-600">
        <RefreshCcw className="h-4 w-4" />
        Converting...
      </span>
    );
  return (
    <span className="text-sm">
      {amount} {from} = <span className="text-red-500">{prediction}</span> {to}
    </span>
  );
}
