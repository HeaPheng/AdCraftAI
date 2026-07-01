"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-background select-none">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-radial-[circle_800px_at_50%_40%] from-violet-500/[0.03] via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-radial-[circle_400px_at_10%_10%] from-indigo-500/[0.015] via-transparent to-transparent" />

      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex flex-col items-center space-y-3">
          {/* Animated Glow Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/20 animate-pulse">
            <Sparkles className="h-8 w-8" />
          </div>
          
          <h1 className="font-display text-7xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            404
          </h1>
          
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {t("error_404_title")}
          </h2>
          
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {t("error_404_desc")}
          </p>
        </div>

        <div className="flex justify-center pt-2">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                className: "bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-5 h-10 gap-2 cursor-pointer transition-all inline-flex items-center justify-center",
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("error_404_back_dashboard")}
            </Link>
          ) : (
            <Link
              href="/"
              className={buttonVariants({
                variant: "default",
                className: "bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-5 h-10 gap-2 cursor-pointer transition-all inline-flex items-center justify-center",
              })}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("error_404_back_home")}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
