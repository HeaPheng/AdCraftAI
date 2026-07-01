"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Sparkles, 
  FileText, 
  Search, 
  Globe, 
  Cpu, 
  History, 
  Zap 
} from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Features() {
  const { t } = useLanguage()

  const featuresList = [
    {
      icon: FileText,
      title: t("landing_features_1_title"),
      desc: t("landing_features_1_desc"),
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500",
    },
    {
      icon: Search,
      title: t("landing_features_2_title"),
      desc: t("landing_features_2_desc"),
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    },
    {
      icon: Globe,
      title: t("landing_features_3_title"),
      desc: t("landing_features_3_desc"),
      color: "from-violet-500/20 to-purple-500/20 text-violet-500",
    },
    {
      icon: Cpu,
      title: t("landing_features_4_title"),
      desc: t("landing_features_4_desc"),
      color: "from-amber-500/20 to-orange-500/20 text-amber-500",
    },
    {
      icon: History,
      title: t("landing_features_5_title"),
      desc: t("landing_features_5_desc"),
      color: "from-pink-500/20 to-rose-500/20 text-pink-500",
    },
    {
      icon: Zap,
      title: t("landing_features_6_title"),
      desc: t("landing_features_6_desc"),
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500",
    },
  ]

  return (
    <section id="features" className="py-20 md:py-28 bg-background relative select-none">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[500px] h-[300px] bg-violet-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs font-semibold text-violet-600 dark:text-violet-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("landing_features_badge")}</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
          >
            {t("landing_features_title")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {t("landing_features_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuresList.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-border/80 bg-card/45 backdrop-blur-xs p-6 md:p-8 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-violet-500/20 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Icon Wrapper */}
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} border border-white/5 shadow-xs group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
