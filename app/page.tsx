"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { ProductForm } from "@/components/marketing/product-form"
import { ResultsDashboard } from "@/components/marketing/results-dashboard"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/layout/footer"
import { ToastProvider } from "@/components/ui/toast"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"
import { Section } from "@/components/ui/section"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading, anonymousCount, tempGeneration, incrementAnonymousCount, saveTempGeneration } = useAuth()
  const isLimitReached = anonymousCount >= 1
  
  const [result, setResult] = React.useState<GenerationResult | null>(null)
  const [formData, setFormData] = React.useState<ProductFormValues | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  // Redirect if logged in
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  // Load temp guest generation if available
  React.useEffect(() => {
    if (tempGeneration) {
      const timer = setTimeout(() => {
        setResult(tempGeneration.result)
        setFormData(tempGeneration.formData)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [tempGeneration])

  const handleGenerationStart = () => {
    setIsGenerating(true)
  }

  const handleGenerated = (data: GenerationResult, formValues: ProductFormValues) => {
    setResult(data)
    setFormData(formValues)
    setIsGenerating(false)

    // Save temporary generation details and increment anonymous count
    saveTempGeneration(formValues.productName, formValues, data)
    incrementAnonymousCount()

    // Scroll to results
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

  const { t } = useLanguage()

  // Prevent flash of landing page content while loading authenticated redirects
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">{t("common_loading")}</span>
        </div>
      </div>
    )
  }


  return (
    <ToastProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        {/* Navigation bar */}
        <Navbar />

        {/* Main marketing landing */}
        <main className="flex-1">
          <Hero />
          
          {/* Features Section */}
          <Features />

          {/* How It Works Section */}
          <HowItWorks />
          
          <Section id="generate" className="py-12 md:py-16 bg-muted/5 border-t border-border/40" container={true}>
            <div className="max-w-[1200px] mx-auto border border-border bg-card rounded-2xl flex flex-col shadow-xs relative z-10 w-full">
              <ProductForm 
                onGenerated={handleGenerated}
                onGenerationStart={handleGenerationStart}
                onGenerationFailed={handleGenerationFailed}
                isLimitReached={isLimitReached}
              />
            </div>
          </Section>

          {/* Results Dashboard Section */}
          <div ref={resultsRef}>
            <ResultsDashboard 
              result={result}
              isGenerating={isGenerating}
              formData={formData}
              onUpdateResult={handleUpdateResult}
            />
          </div>

          {/* Pricing Section */}
          <Pricing />

          {/* FAQ Section */}
          <FAQ />
        </main>

        {/* Page footer */}
        <Footer />
      </div>
    </ToastProvider>
  )
}
