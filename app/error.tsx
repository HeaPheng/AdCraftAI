"use client"

import * as React from "react"
import { Sparkles, RefreshCw, Home } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const { t } = useLanguage()

  React.useEffect(() => {
    // Log the error to an analytics service or console in development
    console.error("[Global Boundary Error]:", error)
  }, [error])

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-background select-none">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-radial-[circle_800px_at_50%_40%] from-violet-500/[0.03] via-transparent to-transparent" />

      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {t("error_global_title")}
          </h1>
          
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {t("error_global_desc")}
          </p>

          {error.message && (
            <div className="w-full p-3 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive text-[11px] font-mono text-left overflow-x-auto max-h-[120px] select-text">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-5 h-10 gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            {t("error_global_retry")}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/"
            }}
            className="border-border text-muted-foreground hover:text-foreground rounded-xl px-5 h-10 gap-2 cursor-pointer transition-all"
          >
            <Home className="h-4 w-4" />
            {t("error_404_back_home")}
          </Button>
        </div>
      </div>
    </div>
  )
}
