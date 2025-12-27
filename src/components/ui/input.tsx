import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#9AA0A6] selection:bg-primary selection:text-primary-foreground",
        "border border-[#d5d5dd] bg-white",
        "flex h-14 w-full min-w-0 rounded-sm px-4 text-[15px] leading-6",
        "transition-[background-color,box-shadow] outline-none shadow-none duration-200 ease-in-out",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_2px_#d5d5dd]",
        "focus:outline-none focus:shadow-[0_0_0_2px_#d5d5dd]",
        "hover:border-[#d5d5dd] hover:bg-[#f8f8fa]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
