import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-[#9AA0A6] border border-[#d5d5dd] bg-white",
        "flex field-sizing-content min-h-16 w-full rounded-sm px-4 py-3 text-[15px] leading-6 transition-[border,background-color,shadow] outline-none shadow-none",
        "hover:border-[#d5d5dd] hover:bg-[#f8f8fa]",
        "focus-visible:border-[#d5d5dd] focus-visible:ring-0 focus-visible:shadow-[0_0_0_2px_#d5d5dd]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
