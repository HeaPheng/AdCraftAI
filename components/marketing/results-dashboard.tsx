"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Facebook,
  Instagram,
  Clapperboard,
  Linkedin,
  Twitter,
  Search,
  Sparkles,
  Hash,
  Lightbulb,
  MousePointerClick,
  Copy,
  Check,
  RefreshCw,
  LayoutGrid,
} from "lucide-react"

import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"
import { regeneratePlatformCopy } from "@/services/api"
import { useLanguage } from "@/hooks/use-language"
import { useToast } from "@/components/ui/toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { CardSkeleton } from "@/components/ui/card-skeleton"
import type { TranslationKey } from "@/lib/translations"

/** Platform formatting configuration */
const PLATFORM_CONFIG: Record<
  string,
  { icon: React.ElementType; label: string; color: string; borderHover: string; glow: string }
> = {
  productDescription: {
    icon: FileText,
    label: "Product Description",
    color: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-500/30",
    glow: "bg-violet-500/5",
  },
  facebook: {
    icon: Facebook,
    label: "Facebook Ad",
    color: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-500/30",
    glow: "bg-blue-500/5",
  },
  instagram: {
    icon: Instagram,
    label: "Instagram Caption",
    color: "text-pink-600 dark:text-pink-400",
    borderHover: "hover:border-pink-500/30",
    glow: "bg-pink-500/5",
  },
  tiktok: {
    icon: Clapperboard,
    label: "TikTok Caption/Hook",
    color: "text-neutral-900 dark:text-neutral-200",
    borderHover: "hover:border-neutral-500/30",
    glow: "bg-neutral-500/5",
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn Sponsored Post",
    color: "text-sky-700 dark:text-sky-400",
    borderHover: "hover:border-sky-500/30",
    glow: "bg-sky-500/5",
  },
  twitter: {
    icon: Twitter,
    label: "X (Twitter) Post",
    color: "text-neutral-900 dark:text-neutral-200",
    borderHover: "hover:border-neutral-500/30",
    glow: "bg-neutral-500/5",
  },
  seoDescription: {
    icon: Search,
    label: "SEO Meta Description",
    color: "text-emerald-600 dark:text-emerald-400",
    borderHover: "hover:border-emerald-500/30",
    glow: "bg-emerald-500/5",
  },
  seoKeywords: {
    icon: Search,
    label: "SEO Keywords",
    color: "text-emerald-600 dark:text-emerald-400",
    borderHover: "hover:border-emerald-500/30",
    glow: "bg-emerald-500/5",
  },
  hashtags: {
    icon: Hash,
    label: "Trending Hashtags",
    color: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-500/30",
    glow: "bg-violet-500/5",
  },
  cta: {
    icon: MousePointerClick,
    label: "Call to Action Variations",
    color: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-amber-500/30",
    glow: "bg-amber-500/5",
  },
  headlines: {
    icon: Lightbulb,
    label: "Headline Variations",
    color: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-500/30",
    glow: "bg-violet-500/5",
  },
}

/** Reusable Dashboard Results Card */
interface DashboardCardProps {
  platformKey: string
  content: string | string[]
  formData: ProductFormValues | null
  onUpdate: (key: string, value: string | string[]) => void
  index: number
}

function DashboardCard({
  platformKey,
  content,
  formData,
  onUpdate,
  index,
}: DashboardCardProps) {
  const config = PLATFORM_CONFIG[platformKey]
  const { toast } = useToast()
  const { t } = useLanguage()
  const [copied, setCopied] = React.useState(false)
  const [regenerating, setRegenerating] = React.useState(false)

  if (!config || !content) return null

  const isArray = Array.isArray(content)
  const Icon = config.icon
  const localizedLabel = t(`db_results_platform_${platformKey}` as TranslationKey) || config.label

  // Count display helper
  const countDisplay = isArray
    ? `${content.length} ${
        platformKey === "cta"
          ? t("db_results_card_variations")
          : platformKey === "hashtags"
          ? t("db_results_card_hashtags")
          : t("db_results_card_keywords")
      }`
    : `${content.length} ${t("db_results_card_characters")}`

  const handleCopy = async () => {
    try {
      const textToCopy = isArray
        ? platformKey === "hashtags"
          ? content.map((h) => `#${h}`).join(" ")
          : content.join("\n")
        : content

      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast(t("db_results_card_copied_toast"), "success")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast("Failed to copy.", "error")
    }
  }

  const handleRegenerate = async () => {
    if (!formData || regenerating) return
    setRegenerating(true)

    const flatCopy = isArray ? content.join("\n") : content
    const response = await regeneratePlatformCopy(formData, platformKey, flatCopy)

    setRegenerating(false)

    if (response.success && response.data) {
      onUpdate(platformKey, response.data)
      toast(`Regenerated ${localizedLabel}!`, "success")
    } else {
      toast(response.error || "Regeneration failed.", "error")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      className={`relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition-all duration-200 ${config.borderHover}`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
          <div className={`flex items-center gap-2.5 text-sm font-semibold ${config.color}`}>
            <Icon className="h-4.5 w-4.5" />
            <span>{localizedLabel}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full shrink-0">
            {countDisplay}
          </span>
        </div>

        {/* Card Body with Regeneration Overlay */}
        <div className="relative min-h-[80px]">
          <AnimatePresence>
            {regenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-xs rounded-xl gap-2 text-center"
              >
                <RefreshCw className="h-5 w-5 text-violet-500 animate-spin" />
                <span className="text-xs font-semibold text-muted-foreground">{t("db_gen_form_suggest_loading")}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render strings or arrays differently */}
          {!isArray ? (
            <MarkdownRenderer content={content} />
          ) : platformKey === "seoKeywords" ? (
            <div className="flex flex-wrap gap-1.5">
              {content.map((kw, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs font-normal">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : platformKey === "hashtags" ? (
            <div className="flex flex-wrap gap-1.5">
              {content.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs font-normal text-violet-600 dark:text-violet-400 border-violet-500/20"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {content.map((variation, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm text-foreground/90"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-xs font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{variation}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
        <span className="text-muted-foreground/60 select-none">{t("db_results_card_verified")}</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="h-7 text-xs gap-1 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${regenerating ? "animate-spin" : ""}`} />
            {t("db_results_card_regen_btn")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleCopy}
            className="h-7 text-xs border-border text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer flex items-center justify-center overflow-hidden min-w-[70px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-3 w-3 text-emerald-500" />
                  {t("db_results_card_copied_btn")}
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  {t("db_results_card_copy_btn")}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

/** Custom component for the global headlines banner */
function HeadlineBanner({
  headlines,
  formData,
  onUpdate,
}: {
  headlines: string[]
  formData: ProductFormValues | null
  onUpdate: (key: string, value: string | string[]) => void
}) {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null)
  const [regenerating, setRegenerating] = React.useState(false)

  const headlineAngles = React.useMemo(() => [
    { label: t("db_results_angle_benefit"), color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: t("db_results_angle_curiosity"), color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: t("db_results_angle_authority"), color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  ], [t])

  const handleCopySingle = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIdx(idx)
      toast("Headline copied!", "success")
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch {
      toast("Failed to copy headline.", "error")
    }
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(headlines.join("\n"))
      setCopiedIdx(-1)
      toast("All headlines copied!", "success")
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch {
      toast("Failed to copy headlines.", "error")
    }
  }

  const handleRegenerate = async () => {
    if (!formData || regenerating) return
    setRegenerating(true)

    const response = await regeneratePlatformCopy(formData, "headlines", headlines.join("\n"))

    setRegenerating(false)

    if (response.success && response.data) {
      onUpdate("headlines", response.data as string[])
      toast("Headlines regenerated!", "success")
    } else {
      toast(response.error || "Regeneration failed.", "error")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-6 md:p-8 overflow-hidden group"
    >
      <AnimatePresence>
        {regenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-xs rounded-2xl gap-2 text-center"
          >
            <RefreshCw className="h-5 w-5 text-violet-500 animate-spin" />
            <span className="text-xs font-semibold text-muted-foreground">{t("db_gen_form_suggest_loading")}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-6">
        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest block mb-1 select-none">
          {t("db_results_platform_headlines")}
        </span>
        <p className="text-xs text-muted-foreground">
          {headlines.length} {t("db_results_card_variations")} — {t("db_results_headlines_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {headlines.map((headline, idx) => {
          const angle = headlineAngles[idx] || headlineAngles[0]
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className={`relative flex flex-col items-center text-center rounded-xl border ${angle.border} bg-card/60 p-5 hover:shadow-md transition-all duration-200`}
            >
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-3 px-2.5 py-1 rounded-full ${angle.bg} ${angle.color}`}>
                <Lightbulb className="h-3 w-3" />
                {angle.label}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-foreground leading-tight mb-4 flex-1 flex items-center">
                &ldquo;{headline}&rdquo;
              </h3>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleCopySingle(headline, idx)}
                className={`h-7 text-xs border ${angle.border} ${angle.color} hover:${angle.bg} cursor-pointer flex items-center justify-center overflow-hidden min-w-[70px]`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {copiedIdx === idx ? (
                    <motion.span
                      key="copied"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3 w-3 text-emerald-500" />
                      {t("db_results_card_copied_btn")}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      {t("db_results_card_copy_btn")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 text-xs">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="h-7 text-xs gap-1 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            {t("db_results_headlines_regen_all")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleCopyAll}
            className="h-7 text-xs border border-violet-500/20 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 cursor-pointer flex items-center justify-center overflow-hidden min-w-[90px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copiedIdx === -1 ? (
                <motion.span
                  key="copied"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Check className="h-3 w-3 text-emerald-500" />
                  {t("db_results_headlines_all_copied")}
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  {t("db_results_headlines_copy_all")}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

interface ResultsDashboardProps {
  result: GenerationResult | null
  isGenerating: boolean
  formData: ProductFormValues | null
  onUpdateResult: (updatedResult: GenerationResult) => void
  hideHeader?: boolean
}

export function ResultsDashboard({
  result,
  isGenerating,
  formData,
  onUpdateResult,
  hideHeader = false,
}: ResultsDashboardProps) {
  const { t } = useLanguage()

  const handleCardUpdate = (key: string, value: string | string[]) => {
    if (!result) return
    onUpdateResult({
      ...result,
      [key]: value,
    })
  }

  // Determine platforms to show based on form inputs, or default list
  const activePlatforms = formData?.platforms || [
    "productDescription",
    "facebook",
    "instagram",
    "tiktok",
    "linkedin",
    "twitter",
    "seoDescription",
  ]

  const standardPlatforms = [
    { key: "productDescription", show: activePlatforms.includes("product-description") },
    { key: "facebook", show: activePlatforms.includes("facebook") },
    { key: "instagram", show: activePlatforms.includes("instagram") },
    { key: "tiktok", show: activePlatforms.includes("tiktok") },
    { key: "linkedin", show: activePlatforms.includes("linkedin") },
    { key: "twitter", show: activePlatforms.includes("twitter") },
    { key: "seoDescription", show: activePlatforms.includes("seo") },
  ]

  const visibleStandardPlatforms = standardPlatforms.filter((p) => p.show)

  return (
    <Section id="results" className="border-t border-border/30 relative" container={true}>
      <div className="absolute inset-0 -z-10 bg-radial-[circle_800px_at_50%_100%] from-violet-500/[0.015] via-transparent to-transparent" />
        {/* ──────── EMPTY STATE ──────── */}
        {!result && !isGenerating && (
          <EmptyState
            icon={LayoutGrid}
            title={t("db_results_empty_title")}
            description={t("db_results_empty_desc")}
          />
        )}

        {/* ──────── LOADING SKELETONS ──────── */}
        {isGenerating && (
          <div className="space-y-10">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
              <Skeleton className="h-6 w-44 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>

            {/* Headline Skeleton */}
            <Skeleton className="h-28 rounded-2xl border border-border/40 bg-muted/20" />

            {/* Cards Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <CardSkeleton key={idx} />
              ))}
            </div>
          </div>
        )}

        {/* ──────── DYNAMIC RESULTS ACTIVE STATE ──────── */}
        {result && !isGenerating && (
          <div className="space-y-10">
            {/* Header description */}
            {!hideHeader && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-xl mx-auto mb-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  <span>{t("db_results_dashboard_ready")}</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                  {t("db_results_marketing_suite")}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("db_results_suite_desc")}
                </p>
              </motion.div>
            )}

            {/* 1. Headline Variations Banner */}
            <HeadlineBanner
              headlines={result.headlines}
              formData={formData}
              onUpdate={handleCardUpdate}
            />

            {/* 2. Platform Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {visibleStandardPlatforms.map((p, idx) => (
                <DashboardCard
                  key={p.key}
                  platformKey={p.key}
                  content={result[p.key as keyof GenerationResult]}
                  formData={formData}
                  onUpdate={handleCardUpdate}
                  index={idx + 1}
                />
              ))}
            </div>

            {/* 3. Bottom Row: Keywords, Hashtags, CTAs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <DashboardCard
                platformKey="seoKeywords"
                content={result.seoKeywords}
                formData={formData}
                onUpdate={handleCardUpdate}
                index={visibleStandardPlatforms.length + 1}
              />
              <DashboardCard
                platformKey="hashtags"
                content={result.hashtags}
                formData={formData}
                onUpdate={handleCardUpdate}
                index={visibleStandardPlatforms.length + 2}
              />
              <DashboardCard
                platformKey="cta"
                content={result.cta}
                formData={formData}
                onUpdate={handleCardUpdate}
                index={visibleStandardPlatforms.length + 3}
              />
            </div>
          </div>
        )}
    </Section>
  )
}
