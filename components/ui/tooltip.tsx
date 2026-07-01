"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: "top" | "right" | "bottom" | "left"
  sideOffset?: number
}

export function Tooltip({
  content,
  children,
  side = "top",
  sideOffset = 4,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delay={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger render={children} />
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
            <TooltipPrimitive.Popup
              className="z-50 rounded-lg bg-neutral-900 dark:bg-neutral-800 border border-neutral-800 dark:border-neutral-700 px-2.5 py-1.5 text-xs font-medium text-neutral-50 shadow-md transition-opacity duration-100 data-closed:opacity-0"
            >
              {content}
            </TooltipPrimitive.Popup>
          </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
