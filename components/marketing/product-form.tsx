"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Loader2,
  Info,
  Tag,
  Users,
  LayoutGrid,
  CheckCircle2,
  X,
} from "lucide-react"

import { getProductFormSchema, type ProductFormValues } from "@/types/product"
import type { GenerationResult } from "@/types/generation"
import { generateAdCopy, suggestProductDetails } from "@/services/api"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FeatureList } from "./feature-list"
import { PlatformSelector } from "./platform-selector"
import { PRODUCT_CATEGORIES, WRITING_TONES } from "@/constants/product"
import type { TranslationKey } from "@/lib/translations"

interface ProductFormProps {
  onGenerated: (result: GenerationResult, formData: ProductFormValues) => void
  onGenerationStart: () => void
  onGenerationFailed: () => void
  isLimitReached?: boolean
}

export function ProductForm({
  onGenerated,
  onGenerationStart,
  onGenerationFailed,
  isLimitReached = false,
}: ProductFormProps) {
  const router = useRouter()
  const { preloadedFormData, setPreloadedFormData } = useAuth()
  const { t, language: uiLanguage } = useLanguage()
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)
  
  // Track if output language has been manually touched by the user
  const [outputLanguageTouched, setOutputLanguageTouched] = React.useState(false)

  const schema = React.useMemo(() => getProductFormSchema(t), [t])

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: "",
      productDescription: "",
      productCategory: "",
      brandName: "",
      targetAudience: "",
      writingTone: "",
      language: "",
      platforms: [],
      features: [],
    },
  })

  // Watch selected platforms for the sticky CTA count
  const selectedPlatforms = watch("platforms") || []

  // Sync default output language with active UI language preference (until user manual interaction)
  React.useEffect(() => {
    if (!outputLanguageTouched) {
      setValue("language", uiLanguage === "km" ? "Khmer" : "English")
    }
  }, [uiLanguage, setValue, outputLanguageTouched])

  const [shouldShake, setShouldShake] = React.useState(false)
  const [progressStep, setProgressStep] = React.useState("")

  const onInvalid = () => {
    setShouldShake(true)
    setTimeout(() => setShouldShake(false), 500)
  }

  React.useEffect(() => {
    if (preloadedFormData) {
      reset(preloadedFormData)
      setPreloadedFormData(null)
    }
  }, [preloadedFormData, reset, setPreloadedFormData])

  const onSubmit = async (data: ProductFormValues) => {
    setIsGenerating(true)
    setIsSuccess(false)
    setApiError(null)
    onGenerationStart()

    setProgressStep(t("db_gen_progress_connecting"))
    const t1 = setTimeout(() => setProgressStep(t("db_gen_progress_generating")), 1500)
    const t2 = setTimeout(() => setProgressStep(t("db_gen_progress_processing")), 4000)

    try {
      const response = await generateAdCopy(data)
      setIsGenerating(false)
      clearTimeout(t1)
      clearTimeout(t2)

      if (response.success && response.data) {
        setIsSuccess(true)
        onGenerated(response.data, data)
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        setApiError(response.error || "An unexpected error occurred. Please try again.")
        onGenerationFailed()
      }
    } catch {
      setIsGenerating(false)
      clearTimeout(t1)
      clearTimeout(t2)
      setApiError("Something went wrong. Please try again.")
      onGenerationFailed()
    }
  }

  const [isSuggesting, setIsSuggesting] = React.useState(false)

  const handleSuggestDetails = async () => {
    const name = getValues("productName")
    if (!name || !name.trim()) {
      setApiError(t("db_gen_form_error_suggest"))
      return
    }

    setIsSuggesting(true)
    setApiError(null)

    try {
      const response = await suggestProductDetails(name)
      if (response.success && response.data) {
        const suggestions = response.data
        if (suggestions.brandName) setValue("brandName", suggestions.brandName)
        if (suggestions.productCategory) setValue("productCategory", suggestions.productCategory)
        if (suggestions.productDescription) setValue("productDescription", suggestions.productDescription)
        if (suggestions.targetAudience) setValue("targetAudience", suggestions.targetAudience)
        if (suggestions.writingTone) setValue("writingTone", suggestions.writingTone)
        if (suggestions.features && suggestions.features.length > 0) {
          setValue("features", suggestions.features)
        }
      } else {
        setApiError(response.error || t("db_gen_form_error_suggest_failed"))
      }
    } catch {
      setApiError(t("db_gen_form_error_suggest_network"))
    } finally {
      setIsSuggesting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="flex flex-col select-none"
    >
      {/* ─── Panel Header ─── */}
      <div className="px-8 py-6 border-b border-border/80 shrink-0 space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{t("db_gen_form_title")}</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t("db_gen_form_subtitle")}
        </p>
      </div>

      {/* ─── Form Body ─── */}
      <div className="p-8 space-y-8">
        
        {/* SECTION 1: Product info */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/80 mb-3">
            <Info className="h-3.5 w-3.5 text-violet-500" />
            <span>{t("db_gen_form_sec_product")}</span>
          </div>

          {/* Product Name + Brand Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-[13px] font-semibold text-foreground/90 block mb-2">
                {t("db_gen_form_name_label")} <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="productName"
                  placeholder={t("db_gen_form_name_placeholder")}
                  disabled={isGenerating || isSuggesting}
                  className="h-11 border-border flex-1 focus-visible:ring-violet-500/20"
                  {...register("productName")}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGenerating || isSuggesting}
                  onClick={handleSuggestDetails}
                  className="h-11 border-border hover:bg-[#7c3aed]/5 hover:text-[#7c3aed] hover:border-[#7c3aed]/30 rounded-xl px-3 flex gap-1 cursor-pointer text-xs font-semibold text-muted-foreground shrink-0 transition-colors"
                >
                  {isSuggesting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 text-[#7c3aed]" />
                  )}
                  <span>{isSuggesting ? t("db_gen_form_suggest_loading") : t("db_gen_form_suggest_btn")}</span>
                </Button>
              </div>
              {errors.productName?.message && (
                <p className="text-[10px] text-destructive font-medium mt-1">{errors.productName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-[13px] font-semibold text-foreground/90 block mb-2">
                {t("db_gen_form_brand_label")}
              </Label>
              <Input
                id="brandName"
                placeholder={t("db_gen_form_brand_placeholder")}
                disabled={isGenerating}
                className="h-11 border-border focus-visible:ring-violet-500/20"
                {...register("brandName")}
              />
            </div>
          </div>

          {/* Category + Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-foreground/90 block mb-2">
                {t("db_gen_form_category_label")} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="productCategory"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isGenerating}>
                    <SelectTrigger className="h-11 border-border focus:ring-violet-500/20">
                      <SelectValue placeholder={t("db_gen_form_category_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.productCategory?.message && (
                <p className="text-[10px] text-destructive font-medium mt-1">{errors.productCategory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-foreground/90 block mb-2">
                {t("db_gen_form_output_lang_label")} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val)
                      setOutputLanguageTouched(true)
                    }}
                    disabled={isGenerating}
                  >
                    <SelectTrigger className="h-11 border-border focus:ring-violet-500/20">
                      <SelectValue placeholder={t("db_gen_form_output_lang_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">🇺🇸 English</SelectItem>
                      <SelectItem value="Khmer">🇰🇭 ខ្មែរ</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.language?.message && (
                <p className="text-[10px] text-destructive font-medium mt-1">{errors.language.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="productDescription" className="text-[13px] font-semibold text-foreground/90 block mb-2">
              {t("db_gen_form_desc_label")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="productDescription"
              placeholder={t("db_gen_form_desc_placeholder")}
              disabled={isGenerating}
              className="h-24 min-h-[96px] max-h-[160px] resize-y border-border focus-visible:ring-violet-500/20"
              {...register("productDescription")}
            />
            {errors.productDescription?.message && (
              <p className="text-[10px] text-destructive font-medium mt-1">{errors.productDescription.message}</p>
            )}
          </div>
        </div>

        {/* SECTION 2: Key features */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/80 mb-3">
            <Tag className="h-3.5 w-3.5 text-violet-500" />
            <span>{t("db_gen_form_sec_features")}</span>
          </div>
          <Controller
            name="features"
            control={control}
            render={({ field }) => (
              <FeatureList
                features={field.value || []}
                onChange={field.onChange}
                disabled={isGenerating}
              />
            )}
          />
        </div>

        {/* SECTION 3: Audience & tone */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/80 mb-3">
            <Users className="h-3.5 w-3.5 text-violet-500" />
            <span>{t("db_gen_form_sec_audience")}</span>
          </div>

          {/* Target Audience + Writing Tone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="targetAudience" className="text-[13px] font-semibold text-foreground/90 block mb-2">
                {t("db_gen_form_audience_label")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="targetAudience"
                placeholder={t("db_gen_form_audience_placeholder")}
                disabled={isGenerating}
                className="h-11 border-border focus-visible:ring-violet-500/20"
                {...register("targetAudience")}
              />
              {errors.targetAudience?.message && (
                <p className="text-[10px] text-destructive font-medium mt-1">{errors.targetAudience.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-foreground/90 block mb-2">
                {t("db_gen_form_tone_label")} <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="writingTone"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isGenerating}>
                    <SelectTrigger className="h-11 border-border focus:ring-violet-500/20">
                      <SelectValue placeholder={t("db_gen_form_tone_placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {WRITING_TONES.map((tone) => {
                        // Dynamically resolve tone label & description translations
                        const toneLabel = t(`db_gen_tone_${tone.value}_title` as TranslationKey) || tone.label
                        const toneDesc = t(`db_gen_tone_${tone.value}_desc` as TranslationKey) || tone.description
                        return (
                          <SelectItem key={tone.value} value={tone.value}>
                            <div className="flex flex-col items-start text-left py-0.5">
                              <span className="font-semibold text-xs sm:text-sm">{toneLabel}</span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground leading-normal mt-0.5">
                                {toneDesc}
                              </span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.writingTone?.message && (
                <p className="text-[10px] text-destructive font-medium mt-1">{errors.writingTone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Output platforms */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/80 mb-3">
            <LayoutGrid className="h-3.5 w-3.5 text-violet-500" />
            <span>{t("db_gen_form_sec_platforms")}</span>
          </div>
          <Controller
            name="platforms"
            control={control}
            render={({ field }) => (
              <PlatformSelector
                selected={field.value || []}
                onChange={field.onChange}
                disabled={isGenerating}
                error={errors.platforms?.message}
              />
            )}
          />
        </div>

        {/* ─── API Error Banner ─── */}
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center justify-between gap-2 overflow-hidden"
            >
              <div className="flex items-start gap-2">
                <span className="font-semibold shrink-0">{t("common_error")}:</span>
                <span className="leading-relaxed">{apiError}</span>
              </div>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="p-1 rounded-md hover:bg-destructive/15 text-destructive cursor-pointer transition-colors"
                aria-label="Dismiss error"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Sticky CTA bar ─── */}
      {isLimitReached ? (
        <div className="px-6 py-4 border-t border-border bg-violet-500/[0.02] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-medium text-[#7c3aed]">{t("upgrade_title")}</span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-xl cursor-pointer"
              onClick={() => router.push("/login")}
            >
              {t("upgrade_btn_login")}
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white font-semibold h-9 px-4 rounded-xl cursor-pointer"
              onClick={() => router.push("/register")}
            >
              {t("upgrade_btn_register")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 border-t border-border bg-muted/15 shrink-0 flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground font-medium">
            {isSuccess ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                {t("common_success")}!
              </span>
            ) : (
              `${selectedPlatforms.length} platform${selectedPlatforms.length === 1 ? "" : "s"} selected`
            )}
          </span>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              disabled={isGenerating || isSuggesting}
              onClick={() => reset({
                productName: "",
                productDescription: "",
                productCategory: "",
                brandName: "",
                targetAudience: "",
                writingTone: "",
                language: uiLanguage === "km" ? "Khmer" : "English",
                platforms: [],
                features: [],
              })}
              className="border-border hover:bg-accent/40 rounded-xl h-10 px-4 cursor-pointer text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
            >
              {t("db_gen_form_clear_btn")}
            </Button>
            
            <motion.div
              animate={shouldShake ? { x: [-10, 10, -10, 10, -5, 5, -2, 2, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isGenerating || isSuggesting}
                style={{ backgroundColor: "#7c3aed" }}
                className="hover:opacity-90 text-white font-semibold rounded-xl h-10 px-5 flex items-center gap-1.5 shadow-none cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{progressStep}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {t("db_gen_form_generate_btn")}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      )}
    </form>
  )
}
