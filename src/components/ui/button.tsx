import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * The first component of the design system.
 *
 * Every colour, radius and spacing value comes from a token — there is not a
 * single hardcoded hex value, and the ESLint rule added in P02 makes that a
 * build error rather than a convention. The full component set is P02 work;
 * this one exists so the token pipeline is proven end to end.
 */

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-(--radius-control) text-sm font-medium ' +
    'transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-(--color-brand) disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-(--color-brand) text-(--color-brand-foreground) hover:opacity-90',
        outline:
          'border border-(--color-border) bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-raised)',
        ghost: 'text-(--color-text) hover:bg-(--color-surface-raised)',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot.Root : 'button';
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
