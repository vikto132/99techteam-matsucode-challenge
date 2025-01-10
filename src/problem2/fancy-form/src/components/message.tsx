import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Message(props: Props) {
  const { children, className } = props;
  return <div className={cn('rounded p-2 text-sm', className)}>{children}</div>;
}
