"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

/** Reusable Platform Card Skeleton Loader */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-border/20 pb-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-border/10">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  )
}
export default CardSkeleton
