import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';

import { cn } from '@insight/ui';

const variants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none uppercase tracking-wide',
  {
    variants: {
      tone: {
        default: 'bg-line text-ink',
        success: 'bg-success/15 text-success',
        warning: 'bg-warning/15 text-warning',
        danger: 'bg-danger/15 text-danger',
        info: 'bg-info/15 text-info',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof variants> {}

export function Badge({ className, tone, ...props }: BadgeProps): JSX.Element {
  return <span className={cn(variants({ tone, className }))} {...props} />;
}
