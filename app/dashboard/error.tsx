"use client"

import * as React from "react"
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  const { t } = useLanguage()

  React.useEffect(() => {
    console.error("[Dashboard Boundary Error]:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 space-y-6 max-w-md mx-auto select-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-xs">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-lg font-bold text-foreground">
          {t("error_dashboard_title")}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("error_dashboard_desc")}
        </p>
        {error.message && (
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-mono text-left max-h-[100px] overflow-y-auto select-text mt-2">
            {error.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={() => reset()}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-4 h-9 gap-2 cursor-pointer transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t("error_global_retry")}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = "/dashboard"
          }}
          className="border-border text-muted-foreground hover:text-foreground rounded-xl px-4 h-9 gap-2 cursor-pointer transition-all"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          {t("error_global_back")}
        </Button>
      </div>
    </div>
  )
}
