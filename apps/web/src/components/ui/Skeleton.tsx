import { type HTMLAttributes } from 'react';
import { cn } from '@insight/ui';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn('animate-pulse rounded-md bg-line/60', className)} {...props} />;
}
