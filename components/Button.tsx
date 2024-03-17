import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 
          "bg-[#319795] hover:bg-[#2C7A7B] p-2 gap-2 my-4 text-center text-white dark:bg-[#81e6d9] dark:hover:bg-[#4FD1C5] dark:text-[#244148]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        toggle:
          "bg-[#805ad5] hover:bg-[#6B46C1] dark:bg-[#fbd38d] dark:hover:bg-[#F6AD55]",
        outline:
          "p-3 mr-3 border-2 border-[#E2E8F0] hover:bg-[#EDF2F7] dark:text-[#C1C1C1] dark:hover:bg-[#323235] dark:border-[#525255]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary hover:underline underline-offset-4",
        auth:
          "py-2 border border-black hover:bg-[#F5F0E8] dark:border-[#525252] rounded-3xl dark:text-[#f8f7f7] dark:hover:bg-[#323235]",
      },
      size: {
        default: "px-3",
        sm: "p-[10px] rounded-[0.375rem]",
        md: "w-[6rem] outline-none px-0",
        lg: "h-11  px-8",
        wide: 'px-5',
        icon: "h-10 w-10",
        link: "py-2"

      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
