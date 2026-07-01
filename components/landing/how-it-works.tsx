"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function HowItWorks() {
  const { t } = useLanguage()

  const steps = [
    {
      step: "01",
      title: t("landing_how_step_1_title"),
      desc: t("landing_how_step_1_desc"),
    },
    {
      step: "02",
      title: t("landing_how_step_2_title"),
      desc: t("landing_how_step_2_desc"),
    },
    {
      step: "03",
      title: t("landing_how_step_3_title"),
      desc: t("landing_how_step_3_desc"),
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-muted/5 border-y border-border/40 relative select-none">
      {/* Background grid/dots */}
      <div className="absolute inset-0 bg-radial-[circle_400px_at_80%_80%] from-violet-500/[0.015] via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs font-semibold text-violet-600 dark:text-violet-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("landing_how_badge")}</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
          >
            {t("landing_how_title")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {t("landing_how_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connector line for large screens */}
          <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-[1px] bg-border/60 -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="text-center space-y-4 flex flex-col items-center"
            >
              {/* Step circle */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border/80 text-violet-600 dark:text-violet-400 font-display text-sm font-bold shadow-xs select-none">
                {step.step}
              </div>

              <h3 className="font-display text-lg font-bold text-foreground pt-2">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
