"use client"

import * as React from "react"
import {
  FileText,
  Facebook,
  Instagram,
  Linkedin,
  Search,
} from "lucide-react"
import { PLATFORMS } from "@/constants/product"

interface PlatformSelectorProps {
  selected: string[]
  onChange: (platforms: string[]) => void
  disabled?: boolean
  error?: string
}

// Map database value keys to the specific display names requested
const DISPLAY_NAMES: Record<string, string> = {
  "product-description": "Product page",
  "facebook": "Facebook",
  "instagram": "Instagram",
  "tiktok": "TikTok",
  "linkedin": "LinkedIn",
  "twitter": "X / Twitter",
  "seo": "SEO",
}

// Sub-component to render clean outline icons for each platform
function PlatformIcon({ value, isSelected }: { value: string; isSelected: boolean }) {
  const iconClass = `h-3.5 w-3.5 shrink-0 ${
    isSelected ? "text-[#7c3aed]" : "text-muted-foreground/80"
  }`

  switch (value) {
    case "product-description":
      return <FileText className={iconClass} />
    case "facebook":
      return <Facebook className={iconClass} />
    case "instagram":
      return <Instagram className={iconClass} />
    case "tiktok":
      // Clean TikTok outline SVG
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      )
    case "linkedin":
      return <Linkedin className={iconClass} />
    case "twitter":
      // Clean X outline SVG
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      )
    case "seo":
      return <Search className={iconClass} />
    default:
      return null
  }
}

export function PlatformSelector({
  selected,
  onChange,
  disabled = false,
  error,
}: PlatformSelectorProps) {
  const toggle = (value: string) => {
    if (disabled) return
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-3 gap-2">
        {PLATFORMS.map((platform) => {
          const isSelected = selected.includes(platform.value)
          const displayName = DISPLAY_NAMES[platform.value] || platform.label

          return (
            <button
              key={platform.value}
              type="button"
              onClick={() => toggle(platform.value)}
              disabled={disabled}
              className={`
                flex items-center justify-center gap-2 rounded-xl border px-3 py-2
                text-xs font-semibold select-none transition-all duration-150 cursor-pointer
                focus:outline-hidden disabled:pointer-events-none disabled:opacity-50
                ${
                  isSelected
                    ? "border-[#7c3aed] bg-[#7c3aed]/[0.08] text-[#7c3aed]"
                    : "border-border bg-transparent text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                }
              `}
            >
              <PlatformIcon value={platform.value} isSelected={isSelected} />
              <span>{displayName}</span>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="text-xs text-destructive font-medium pl-0.5 mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
