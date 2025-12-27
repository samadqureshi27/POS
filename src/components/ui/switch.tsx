"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-[30px] w-[52px] shrink-0 items-center rounded-full transition-all outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 p-[3px]",
        "data-[state=checked]:bg-[#11c937]",
        "data-[state=unchecked]:bg-[#cccccc]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-[24px] w-[24px] rounded-full bg-white ring-0 transition-transform",
          "shadow-[0_10px_18px_rgba(0,0,0,0.25)]",
          "data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
