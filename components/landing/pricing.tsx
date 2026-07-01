"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function Pricing() {
  const router = useRouter()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  const handleFreeAction = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/register")
    }
  }

  const plans = [
    {
      title: t("landing_pricing_free_title"),
      price: t("landing_pricing_free_price"),
      period: t("landing_pricing_free_period"),
      desc: t("landing_pricing_free_desc"),
      features: [
        t("landing_pricing_free_f1"),
        t("landing_pricing_free_f2"),
        t("landing_pricing_free_f3"),
        t("landing_pricing_free_f4"),
      ],
      btnText: t("landing_pricing_free_btn"),
      action: handleFreeAction,
      popular: false,
      comingSoon: false,
    },
    {
      title: t("landing_pricing_pro_title"),
      price: t("landing_pricing_pro_price"),
      period: t("landing_pricing_pro_period"),
      desc: t("landing_pricing_pro_desc"),
      features: [
        t("landing_pricing_pro_f1"),
        t("landing_pricing_pro_f2"),
        t("landing_pricing_pro_f3"),
        t("landing_pricing_pro_f4"),
        t("landing_pricing_pro_f5"),
      ],
      btnText: t("landing_pricing_pro_btn"),
      action: () => {},
      popular: true,
      comingSoon: true,
    },
    {
      title: t("landing_pricing_enterprise_title"),
      price: t("landing_pricing_enterprise_price"),
      period: "",
      desc: t("landing_pricing_enterprise_desc"),
      features: [
        t("landing_pricing_enterprise_f1"),
        t("landing_pricing_enterprise_f2"),
        t("landing_pricing_enterprise_f3"),
        t("landing_pricing_enterprise_f4"),
        t("landing_pricing_enterprise_f5"),
      ],
      btnText: t("landing_pricing_enterprise_btn"),
      action: handleFreeAction,
      popular: false,
      comingSoon: false,
      enterprise: true,
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-28 bg-background relative select-none">
      <div className="absolute top-1/3 right-1/4 -z-10 w-[400px] h-[400px] bg-violet-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs font-semibold text-violet-600 dark:text-violet-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("landing_pricing_badge")}</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
          >
            {t("landing_pricing_title")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {t("landing_pricing_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`relative rounded-2xl border bg-card/45 backdrop-blur-xs p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md ${
                plan.popular 
                  ? "border-violet-600 dark:border-violet-500/50 shadow-violet-500/[0.02]" 
                  : "border-border/80"
              }`}
            >
              {/* Popular / Coming Soon Badge */}
              {plan.comingSoon && (
                <span className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                  {t("landing_pricing_pro_badge")}
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {plan.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1.5 min-h-[32px] leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-5">
                  {plan.features.map((feat, fidx) => (
                    <li key={fidx} className="flex items-center gap-2.5">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Check className="h-2.5 w-2.5" />
                      </div>
                      <span className="leading-normal">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Button
                  onClick={plan.action}
                  disabled={plan.comingSoon}
                  style={plan.popular && !plan.comingSoon ? { backgroundColor: "#7c3aed" } : {}}
                  className={`w-full h-10 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all ${
                    plan.popular && !plan.comingSoon
                      ? "hover:opacity-95 text-white"
                      : "border-border text-foreground hover:bg-accent/40 bg-transparent border"
                  }`}
                >
                  {plan.btnText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
