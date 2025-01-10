import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { CryptoCurrency } from '@/types/currency';
import { debounce } from 'lodash';

type Props = {
  children: ReactNode;
  onSelected: (currency: string) => void;
};

export default function CurrencySelection(props: Props) {
  const { children, onSelected } = props;
  const [open, setOpen] = useState(false);
  const [currencies, setCurrencies] = useState<CryptoCurrency[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`/api/currencies?currency=${search}`)
      .then((res) => res.json())
      .then((currencies) => setCurrencies(currencies));
  }, [search]);

  const onSearch = useCallback(
    debounce((search: string) => {
      setSearch(search);
    }, 300),
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="p-0" side="right" align="start">
        <Command>
          <CommandInput placeholder="Select currency..." onValueChange={onSearch} />
          <CommandList className="max-h-[200px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.currency}
                  value={currency.currency}
                  onSelect={() => onSelected(currency.currency)}
                >
                  {currency.currency}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
