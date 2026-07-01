"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronDown } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

interface FaqItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}

function FaqItem({ question, answer, isOpen, onToggle, index }: FaqItemProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-border/60 py-4 sm:py-5 text-left"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 text-left font-display text-sm sm:text-base font-bold text-foreground hover:text-violet-600 dark:hover:text-violet-400 outline-hidden cursor-pointer transition-colors duration-200"
      >
        <span>{question}</span>
        <ChevronDown 
          className={`h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-violet-500" : ""
          }`} 
        />
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 8 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pr-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const faqs = [
    { q: t("landing_faq_q1"), a: t("landing_faq_a1") },
    { q: t("landing_faq_q2"), a: t("landing_faq_a2") },
    { q: t("landing_faq_q3"), a: t("landing_faq_a3") },
    { q: t("landing_faq_q4"), a: t("landing_faq_a4") },
    { q: t("landing_faq_q5"), a: t("landing_faq_a5") },
  ]

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/5 border-t border-border/40 relative select-none">
      <div className="absolute bottom-1/4 left-1/4 -z-10 w-[300px] h-[300px] bg-violet-600/[0.015] rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-xs font-semibold text-violet-600 dark:text-violet-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t("landing_faq_badge")}</span>
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground"
          >
            {t("landing_faq_title")}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
          >
            {t("landing_faq_subtitle")}
          </motion.p>
        </div>

        <div className="border-t border-border/60 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => (
            <FaqItem
              key={idx}
              index={idx}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === idx}
              onToggle={() => handleToggle(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
