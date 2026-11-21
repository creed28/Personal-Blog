import type { ComponentProps } from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'my-4 gap-2 rounded-full bg-brand p-2 text-center text-brand-foreground hover:bg-brand-hover',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        toggle:
          'rounded-full bg-[#4B4453] hover:bg-[#3A3441] dark:bg-[#F6C177] dark:hover:bg-[#F2AE52]',
        outline:
          'rounded-full border-2 border-black/10 p-3 hover:bg-[#EDF2F7] dark:border-[#525255] dark:text-[#C1C1C1] dark:hover:bg-[#323235]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        social:
          'gap-x-1.5 p-2 font-medium text-brand hover:bg-brand-soft'
      },
      size: {
        default: 'px-3',
        sm: 'p-[10px]',
        md: 'w-24 px-0 outline-none',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
