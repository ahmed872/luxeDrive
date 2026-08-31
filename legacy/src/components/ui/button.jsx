import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-500 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:shadow-xl hover:shadow-destructive/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[#D4AF37] bg-transparent text-[#D4AF37] shadow-xs hover:bg-[#D4AF37] hover:text-[#0D1B2A] hover:shadow-xl hover:shadow-[#D4AF37]/40 transition-all duration-500 ease-in-out",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-xl hover:shadow-secondary/30",
        ghost:
          "text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:text-[#F5E6A3] hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-500 ease-in-out",
        link: "text-[#D4AF37] underline-offset-4 hover:underline hover:text-[#F5E6A3] transition-all duration-500 ease-in-out",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  // Avoid unintended form submissions: default to type="button" when rendering a native button
  const resolvedProps = asChild
    ? props
    : { type: type ?? 'button', ...props }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...resolvedProps} />
  );
}

export { Button, buttonVariants }
