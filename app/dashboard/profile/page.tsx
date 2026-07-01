"use client"

/* eslint-disable @next/next/no-img-element */

import * as React from "react"
import { Mail, Calendar, Sparkles, Check } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils/get-initials"
import type { TranslationKey } from "@/lib/translations"

export default function ProfilePage() {
  const { user, history } = useAuth()
  const { t } = useLanguage()

  const totalGenerations = history.length

  const preferredTone = React.useMemo(() => {
    if (history.length === 0) return user?.defaultTone || "Professional"
    const tones: Record<string, number> = {}
    history.forEach((item) => {
      const tone = item.formData?.writingTone
      if (tone) tones[tone] = (tones[tone] || 0) + 1
    })
    const entries = Object.entries(tones)
    if (entries.length === 0) return user?.defaultTone || "Professional"
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }, [history, user])

  const preferredLanguage = React.useMemo(() => {
    if (history.length === 0) return user?.defaultLanguage || "English"
    const languages: Record<string, number> = {}
    history.forEach((item) => {
      const lang = item.formData?.language
      if (lang) languages[lang] = (languages[lang] || 0) + 1
    })
    const entries = Object.entries(languages)
    if (entries.length === 0) return user?.defaultLanguage || "English"
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }, [history, user])


  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {t("db_profile_title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("db_profile_subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 border-border/80 bg-card/60 backdrop-blur-md shadow-xs flex flex-col items-center text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-600/10 text-violet-600 dark:text-violet-400 font-extrabold text-2xl border border-violet-500/10 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} className="h-full w-full object-cover" alt={user.name || "User"} referrerPolicy="no-referrer" />
            ) : (
              getInitials(user?.name || "Demo User")
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground truncate max-w-[220px]">
              {user?.name}
            </h2>
            <Badge variant="secondary" className="font-semibold text-[10px] px-2 py-0.5 rounded-full">
              {t("db_profile_card_tier")}
            </Badge>
          </div>

          <div className="w-full border-t border-border/40 pt-4 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Mail className="h-4.5 w-4.5 text-violet-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-foreground/80 block">{t("db_profile_email")}</span>
                <span className="truncate block mt-0.5">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Calendar className="h-4.5 w-4.5 text-violet-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-foreground/80 block">{t("db_profile_joined")}</span>
                <span className="truncate block mt-0.5">{user?.joinedDate}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Copywriting Statistics */}
        <Card className="lg:col-span-2 p-6 border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-6">
          <h3 className="font-display text-lg font-bold text-foreground pb-2 border-b border-border/30 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
            {t("db_profile_history_stats")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-border/40 bg-muted/10 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                {t("db_profile_total_gen")}
              </span>
              <span className="text-2xl font-extrabold text-foreground block">
                {totalGenerations}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border/40 bg-muted/10 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                {t("db_profile_primary_tone")}
              </span>
              <span className="text-base font-extrabold text-foreground block truncate">
                {t(`db_gen_tone_${preferredTone.toLowerCase()}_title` as TranslationKey) || preferredTone}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-border/40 bg-muted/10 space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                {t("db_profile_primary_lang")}
              </span>
              <span className="text-base font-extrabold text-foreground block truncate">
                {preferredLanguage === "Khmer" ? t("common_khmer") : preferredLanguage === "English" ? t("common_english") : preferredLanguage}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-foreground/90 uppercase tracking-widest">
              {t("db_profile_benefits_title")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <span>{t("db_profile_benefit_unlimited")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <span>{t("db_profile_benefit_regen")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <span>{t("db_profile_benefit_history")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <span>{t("db_profile_benefit_seo")}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
