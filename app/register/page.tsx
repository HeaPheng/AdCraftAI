"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, KeyRound, Mail, User as UserIcon, ArrowRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ToastProvider, useToast } from "@/components/ui/toast"

export default function RegisterPage() {
  return (
    <ToastProvider>
      <RegisterForm />
    </ToastProvider>
  )
}

function RegisterForm() {
  const router = useRouter()
  const { register: registerUser, loginWithGoogle, isAuthenticated, isLoading } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast(t("auth_toast_register_fields_req"), "error")
      return
    }

    setIsSubmitting(true)
    try {
      const success = await registerUser(email, password, name)
      if (success) {
        toast(t("auth_toast_register_success"), "success")
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("auth_toast_register_failed")
      toast(errorMessage, "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    try {
      const success = await loginWithGoogle()
      if (success) {
        toast(t("auth_toast_google_success"), "success")
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "DEMO_MODE_NOTICE") {
        toast(t("auth_toast_google_demo"), "default")
        router.push("/dashboard")
      } else {
        const errorMessage = err instanceof Error ? err.message : t("auth_toast_google_failed")
        toast(errorMessage, "error")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">{t("auth_toast_redirecting")}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 bg-background select-none">
      {/* Floating Back to Home Link (Top Left) */}
      <div className="absolute top-4 left-4 z-50">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/40 rounded-lg transition-all duration-200 border border-transparent hover:border-border/30 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("error_404_back_home")}
        </Link>
      </div>

      {/* Floating Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher align="end" />
      </div>

      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-radial-[circle_800px_at_50%_40%] from-violet-500/[0.03] via-transparent to-transparent" />
      <div className="absolute inset-0 -z-10 bg-radial-[circle_400px_at_10%_10%] from-indigo-500/[0.015] via-transparent to-transparent" />

      <div className="w-full max-w-[440px]">
        {/* Logo and header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-4 outline-none">
            <Image
              src="/logo.png"
              alt="AdCraft AI Logo"
              width={64}
              height={64}
              className="h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-display text-2xl font-bold tracking-tight">
              AdCraft<span className="text-violet-600 dark:text-violet-400">AI</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("auth_register_title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {t("auth_register_subtitle")}
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 border border-border/80 bg-card/60 backdrop-blur-md shadow-xl rounded-2xl relative overflow-hidden">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-foreground/80 tracking-wide block">
                {t("auth_register_name")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <UserIcon className="h-4 w-4" />
                </div>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Carter"
                  className="pl-9 h-10 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-foreground/80 tracking-wide block">
                {t("auth_register_email")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-9 h-10 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-foreground/80 tracking-wide block">
                {t("auth_register_password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/60">
                  <KeyRound className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  className="pl-9 h-10 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 h-10 rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("auth_register_creating")}
                </>
              ) : (
                <>
                  {t("auth_register_btn")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-border/40"></div>
            <span className="flex-shrink mx-3 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
              {t("auth_divider_or")}
            </span>
            <div className="flex-grow border-t border-border/40"></div>
          </div>

          {/* Google Sign In mock */}
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={handleGoogleSignIn}
            className="w-full border-border/80 text-foreground hover:bg-accent/40 h-10 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" width="24" height="24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            {t("auth_register_google")}
          </Button>
        </Card>

        {/* Footer link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("auth_register_has_account")}{" "}
          <Link
            href="/login"
            className="font-semibold text-violet-600 dark:text-violet-400 hover:underline outline-none"
          >
            {t("auth_register_signin_link")}
          </Link>
        </p>
      </div>
    </div>
  )
}
