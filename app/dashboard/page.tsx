"use client"

import * as React from "react"
import { Layout } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { ProductForm } from "@/components/marketing/product-form"
import { ResultsDashboard } from "@/components/marketing/results-dashboard"
import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"

export default function DashboardPage() {
  const { addToHistory } = useAuth()
  const { t } = useLanguage()
  
  const [result, setResult] = React.useState<GenerationResult | null>(null)
  const [formData, setFormData] = React.useState<ProductFormValues | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const resultsRef = React.useRef<HTMLDivElement>(null)

  const handleGenerationStart = () => {
    setIsGenerating(true)
    
    // Smooth-scroll down to the results section immediately to display skeletons
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const handleGenerated = (data: GenerationResult, formValues: ProductFormValues) => {
    setResult(data)
    setFormData(formValues)
    setIsGenerating(false)

    // Save generation directly to user history logs
    addToHistory(formValues.productName, formValues, data)

    // Smooth-scroll down to results once copy is ready
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 200)
  }

  const handleGenerationFailed = () => {
    setIsGenerating(false)
  }

  const handleUpdateResult = (updatedResult: GenerationResult) => {
    setResult(updatedResult)
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-16 select-none w-full">
      {/* Page Header */}
      <div className="space-y-1 mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {t("db_header_breadcrumbs_generator")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("db_gen_form_subtitle")}
        </p>
      </div>

      {/* ─── Stacked Layout: Form Card (Top) ─── */}
      <div className="border border-border/60 bg-card rounded-3xl flex flex-col overflow-hidden shadow-xs">
        <ProductForm
          onGenerated={handleGenerated}
          onGenerationStart={handleGenerationStart}
          onGenerationFailed={handleGenerationFailed}
          isLimitReached={false}
        />
      </div>

      {/* ─── Results Anchor Target ─── */}
      <div ref={resultsRef} className="scroll-mt-20" />

      {/* ─── Stacked Layout: Results Card (Bottom) ─── */}
      <div className="border border-border/60 bg-card rounded-3xl flex flex-col overflow-hidden shadow-xs">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/10 shrink-0">
          <span className="text-[13px] font-medium text-foreground">{t("db_results_empty_title")}</span>
          
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            result || isGenerating
              ? "border-[#7c3aed]/20 bg-[#7c3aed]/10 text-[#7c3aed]"
              : "border-border bg-muted/30 text-muted-foreground/80"
          }`}>
            {isGenerating 
              ? t("db_results_status_generating") 
              : result 
              ? t("db_results_status_generated") 
              : t("db_results_status_waiting")
            }
          </span>
        </div>

        {/* Body panel content */}
        <div className="p-6">
          {!result && !isGenerating ? (
            /* Custom Empty state */
            <div className="flex flex-col items-center justify-center text-center py-16">
              {/* Icon box: 48x48, border, 12px radius, layout icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/15 text-muted-foreground/75 mb-4">
                <Layout className="h-6 w-6" />
              </div>
              
              <h3 className="font-display text-sm font-medium text-foreground mb-1.5">
                {t("db_results_empty_hint_title")}
              </h3>
              
              <p className="text-muted-foreground text-xs max-w-[280px] leading-relaxed mb-6">
                {t("db_results_empty_hint_desc")}
              </p>

              {/* Step hints row */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider select-none">
                <span className="px-2.5 py-1 rounded-md border border-border bg-muted/20">{t("db_results_hint_fill")}</span>
                <span className="px-2.5 py-1 rounded-md border border-border bg-muted/20">{t("db_results_hint_platforms")}</span>
                <span className="px-2.5 py-1 rounded-md border border-border bg-muted/20">{t("db_results_hint_generate")}</span>
              </div>
            </div>
          ) : (
            /* Generated results dashboard */
            <ResultsDashboard
              result={result}
              isGenerating={isGenerating}
              formData={formData}
              onUpdateResult={handleUpdateResult}
            />
          )}
        </div>
      </div>

    </div>

  )
}
