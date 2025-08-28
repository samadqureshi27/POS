"use client"

import * as React from "react"
import {
  CartesianGrid,
  LineChart,
  Tooltip as RechartsTooltip,
  Dot,
} from "recharts"

// Simple cn helper
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactNode
}

export function ChartContainer({
  config,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        "w-full h-[300px] [&_.recharts-cartesian-grid-horizontal]:stroke-muted [&_.recharts-cartesian-grid-vertical]:stroke-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  content: React.ComponentType<any>
  cursor?: boolean
}

export function ChartTooltip({ content, cursor = true }: ChartTooltipProps) {
  return (
    <RechartsTooltip
      cursor={cursor}
      wrapperStyle={{ outline: "none" }}
      content={React.createElement(content)}
    />
  )
}

interface ChartTooltipContentProps {
  indicator?: "line" | "dot"
  nameKey?: string
  hideLabel?: boolean
}

export function ChartTooltipContent({
  indicator = "dot",
  nameKey,
  hideLabel = false,
}: ChartTooltipContentProps) {
  return (
    <div>
      {/* This component will actually get props injected by Recharts */}
    </div>
  )
}

// TS-friendly wrapper so <ChartTooltip content={ChartTooltipContent} /> works
export const ChartTooltipContentWrapper: React.FC<any> = ({
  active,
  payload,
  label,
  indicator = "dot",
  nameKey,
  hideLabel = false,
}: any) => {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border bg-background px-3 py-2 shadow-sm">
      {!hideLabel && (
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}
      {payload.map((item: any, index: number) => (
        <div key={index} className="flex items-center text-sm">
          <span
            className="mr-2 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: item.stroke || item.fill }}
          />
          <span>{nameKey ? item.payload[nameKey] : item.name}</span>:{" "}
          <span className="ml-1 font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
