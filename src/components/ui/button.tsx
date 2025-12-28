import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-300 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "h-12 bg-[#1f1f1f] text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:bg-[#262626]",
        destructive:
          "bg-primary text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "h-12 border border-[#d4d7dd] bg-white text-[#1f2937] shadow-none hover:bg-[#1f1f1f] hover:text-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:border-[#1f1f1f]",
        secondary:
          "h-11 bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "h-11 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        filter: "h-9 bg-white text-gray-500 hover:bg-[#e9e9ec] hover:text-black shadow-none",
        filterActive: "h-9 bg-[#e9e9ec] text-gray-900 shadow-none font-medium",
      },
      size: {
        default: "h-12 px-6 py-2 has-[>svg]:px-5",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
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
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
