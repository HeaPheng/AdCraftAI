"use client"

import * as React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ErrorStateProps extends React.ComponentProps<"div"> {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 border border-destructive/20 rounded-2xl bg-destructive/5 max-w-lg mx-auto text-center gap-4",
        className
      )}
      {...props}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-5 w-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-destructive">{title}</h4>
        <p className="text-xs text-destructive/80 mt-1 leading-relaxed max-w-sm">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-1.5 h-8.5 rounded-xl cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
