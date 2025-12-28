import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  showRequiredStar?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showRequiredStar, required, ...props }, ref) => {
    const isRequired = showRequiredStar ?? required;

    return (
      <div className="relative w-full">
        <input
          type={type}
          data-slot="input"
          required={required}
          ref={ref}
          className={cn(
            "file:text-foreground placeholder:text-[#9AA0A6] selection:bg-primary selection:text-primary-foreground",
            "border border-[#e5e5e5] bg-white",
            "flex h-14 w-full min-w-0 rounded-sm px-4 text-[15px] leading-6",
            "transition-[background-color,box-shadow] outline-none shadow-none duration-200 ease-in-out",
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#c5c5c5]",
            "focus:outline-none focus:border-[#c5c5c5]",
            "hover:border-[#d5d5d5]",
            className
          )}
          {...props}
        />
        {isRequired && (
          <span className="absolute right-3 top-2 text-gray-400 text-[10px] pointer-events-none">
            *
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
