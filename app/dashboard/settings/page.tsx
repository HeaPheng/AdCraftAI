"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sparkles, Sliders, Moon, Sun, Monitor } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { WRITING_TONES } from "@/constants/product"
import type { TranslationKey } from "@/lib/translations"

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsForm />
    </ToastProvider>
  )
}

function SettingsForm() {
  const { user, updateUserSettings } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { t } = useLanguage()

  const [tone, setTone] = React.useState(user?.defaultTone || "Professional")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const success = await updateUserSettings({
        defaultTone: tone,
      })

      if (success) {
        toast(t("db_settings_success_toast"), "success")
      } else {
        toast(t("db_settings_error_save"), "error")
      }
    } catch {
      toast(t("db_settings_error_unexpected"), "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {t("db_settings_title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("db_settings_subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <Card className="lg:col-span-2 p-6 border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className="font-display text-lg font-bold text-foreground pb-2 border-b border-border/30 flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
              {t("db_settings_defaults_title")}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Default Tone */}
              <div className="space-y-1.5">
                <label htmlFor="tone" className="text-xs font-semibold text-foreground/80 tracking-wide block">
                  {t("db_settings_tone_label")}
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={isSaving}
                  className="h-10 w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500 transition-all cursor-pointer"
                >
                  {WRITING_TONES.map((toneObj) => {
                    const toneLabel = t(`db_gen_tone_${toneObj.value}_title` as TranslationKey) || toneObj.label
                    return (
                      <option key={toneObj.value} value={toneObj.label}>
                        {toneLabel}
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 h-10 px-5 rounded-xl cursor-pointer"
              >
                {isSaving ? t("db_settings_saving") : t("db_settings_save_btn")}
              </Button>
            </div>
          </form>
        </Card>

        {/* Theme Settings Sidebar */}
        <Card className="p-6 border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-6">
          <div>
            <h3 className="font-display text-md font-bold text-foreground pb-2 border-b border-border/30 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
              {t("db_settings_appearance_title")}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {t("db_settings_appearance_desc")}
            </p>
          </div>

          {/* Theme buttons grid */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                theme === "light"
                  ? "border-violet-500/30 bg-violet-600/5 text-violet-600 dark:text-violet-400"
                  : "border-border/40 hover:bg-accent/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="h-4.5 w-4.5" />
              <span>{t("db_settings_theme_light")}</span>
            </button>

            <button
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                theme === "dark"
                  ? "border-violet-500/30 bg-violet-600/5 text-violet-600 dark:text-violet-400"
                  : "border-border/40 hover:bg-accent/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="h-4.5 w-4.5" />
              <span>{t("db_settings_theme_dark")}</span>
            </button>

            <button
              onClick={() => setTheme("system")}
              aria-pressed={theme === "system"}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                theme === "system"
                  ? "border-violet-500/30 bg-violet-600/5 text-violet-600 dark:text-violet-400"
                  : "border-border/40 hover:bg-accent/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="h-4.5 w-4.5" />
              <span>{t("db_settings_theme_system")}</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
