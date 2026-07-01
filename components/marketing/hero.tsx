"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, Check, Play, Search, Facebook, Linkedin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export function Hero() {
  const { t } = useLanguage()
  const [step, setStep] = React.useState<"input" | "generating" | "output">("input")

  // Auto-cycle the demo animation
  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep("generating")
    }, 4500)

    const timer2 = setTimeout(() => {
      setStep("output")
    }, 6500)

    const timer3 = setTimeout(() => {
      setStep("input")
    }, 14000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [step])

  return (
    <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-36 lg:pb-32 glow-ambient grid-backdrop">
      {/* Background radial overlays */}
      <div className="absolute inset-0 pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
            {/* Tag/Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs font-semibold text-violet-600 dark:text-violet-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("hero_badge_version")}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground"
            >
              {t("hero_title")}
            </motion.h1>

            {/* Subdescription */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
            >
              {t("hero_subtitle")}
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all rounded-xl gap-2 font-semibold h-12 cursor-pointer"
                >
                  {t("hero_cta_free")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#generate" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-border/80 text-foreground hover:bg-accent/40 rounded-xl gap-2 h-12 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-foreground/10 text-foreground" /> {t("hero_cta_demo")}
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 border-t border-border/60 w-full"
            >
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {t("hero_trust_title")}
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 opacity-50 dark:opacity-40">
                <span className="font-display font-bold text-lg text-foreground tracking-tight">Stripe</span>
                <span className="font-display font-bold text-lg text-foreground tracking-tight">Linear</span>
                <span className="font-display font-bold text-lg text-foreground tracking-tight">Vercel</span>
                <span className="font-display font-bold text-lg text-foreground tracking-tight">Notion</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Showcase Animation */}
          <div className="lg:col-span-5 relative w-full h-[450px] flex items-center justify-center">
            {/* Background glowing circle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl -z-10" />

            <AnimatePresence mode="wait">
              {/* STAGE 1: Product Input Form */}
              {step === "input" && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-[420px] rounded-2xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-violet-600" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {t("hero_showcase_workspace")}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-violet-600 dark:text-violet-400">{t("hero_showcase_step")}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        {t("db_gen_form_name_label")}
                      </label>
                      <div className="w-full rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-sm text-foreground">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          FitTrack Pro
                        </motion.span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        {t("db_gen_form_desc_label")}
                      </label>
                      <div className="w-full rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-sm text-foreground min-h-[90px] leading-relaxed">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5, delay: 1.2 }}
                        >
                          Smart wellness tracker with personalized health insights, heart rate monitoring, and sleep coaching. Designed for active professionals.
                        </motion.span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        {t("db_gen_form_audience_label")}
                      </label>
                      <div className="w-full rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-sm text-foreground">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 2.8 }}
                        >
                          Active Professionals
                        </motion.span>
                      </div>
                    </div>

                    <Button className="w-full bg-violet-600 text-white font-medium gap-2 mt-2 rounded-lg">
                      {t("hero_showcase_generate_btn")} <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 2: Scanning / Generating */}
              {step === "generating" && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-[420px] rounded-2xl border border-border/80 bg-card/80 p-8 shadow-xl backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center min-h-[350px]"
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <Sparkles className="h-8 w-8 animate-spin duration-3000" />
                    {/* Glowing pulse ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/30 animate-ping" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground text-base">{t("hero_showcase_working")}</h3>
                    <p className="text-xs text-muted-foreground max-w-[240px]">
                      {t("hero_showcase_working_desc")}
                    </p>
                  </div>
                  {/* Progress bar container */}
                  <div className="w-48 h-1.5 bg-border/40 rounded-full overflow-hidden relative mt-2">
                    <motion.div
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: Ad Outputs Preview */}
              {step === "output" && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="w-full max-w-[440px] flex flex-col gap-3.5 z-20"
                >
                  {/* Title Indicator */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {t("hero_showcase_channels")}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {t("hero_showcase_ready")}
                    </span>
                  </div>

                  {/* Facebook Preview Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-xl border border-border/80 bg-card p-3 shadow-md hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <Facebook className="h-3.5 w-3.5 fill-current" />
                      <span>{t("hero_showcase_fb")}</span>
                    </div>
                    <p className="text-[11px] text-foreground leading-relaxed">
                      {t("hero_showcase_fb_text")}
                    </p>
                  </motion.div>

                  {/* Google Preview Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    className="rounded-xl border border-border/80 bg-card p-3 shadow-md hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-amber-600 dark:text-amber-500">
                      <Search className="h-3.5 w-3.5" />
                      <span>{t("hero_showcase_google")}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">Ad · www.fittrack.com/pro</div>
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      {t("hero_showcase_google_title")}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                      {t("hero_showcase_google_desc")}
                    </p>
                  </motion.div>

                  {/* LinkedIn Preview Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="rounded-xl border border-border/80 bg-card p-3 shadow-md hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-sky-700 dark:text-sky-400">
                      <Linkedin className="h-3.5 w-3.5 fill-current" />
                      <span>{t("hero_showcase_linkedin")}</span>
                    </div>
                    <p className="text-[11px] text-foreground leading-relaxed">
                      {t("hero_showcase_linkedin_text")}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
