"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  id?: string
  className?: string
  style?: React.CSSProperties
  container?: boolean
  animate?: boolean
  delay?: number
}

export function Section({
  children,
  className,
  id,
  style,
  container = true,
  animate = true,
  delay = 0,
}: SectionProps) {
  const content = (
    <div className={cn(container && "container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl")}>
      {children}
    </div>
  )

  if (animate) {
    return (
      <motion.section
        id={id}
        style={style}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay }}
        className={cn("py-16 md:py-24 relative overflow-hidden", className)}
      >
        {content}
      </motion.section>
    )
  }

  return (
    <section id={id} style={style} className={cn("py-16 md:py-24 relative overflow-hidden", className)}>
      {content}
    </section>
  )
}
