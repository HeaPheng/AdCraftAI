"use client"

import * as React from "react"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FeatureListProps {
  features: string[]
  onChange: (features: string[]) => void
  disabled?: boolean
}

export function FeatureList({ features, onChange, disabled = false }: FeatureListProps) {
  const [newFeature, setNewFeature] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    const trimmed = newFeature.trim()
    if (trimmed && !features.includes(trimmed)) {
      onChange([...features, trimmed])
      setNewFeature("")
      // Keep focus on input for fast multi-word entry
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (index: number) => {
    onChange(features.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {/* Permanent, static input box and Add button side-by-side */}
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Waterproof, 30-day battery life..."
          disabled={disabled}
          className="h-9 flex-1 border-border"
        />
        <Button
          type="button"
          disabled={disabled || !newFeature.trim()}
          onClick={handleAdd}
          style={{ borderColor: "#7c3aed", color: "#7c3aed" }}
          className="h-9 gap-1 rounded-xl border border-dashed bg-[#7c3aed]/5 hover:bg-[#7c3aed]/10 text-xs font-semibold px-4 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {/* Render chips below */}
      <div className="flex flex-wrap gap-2 items-center min-h-[24px]">
        {features.map((feature, index) => (
          <div
            key={`${feature}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/20 px-3 py-1 text-xs font-semibold text-foreground select-none"
          >
            <span>{feature}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="rounded-full p-0.5 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              aria-label={`Remove ${feature}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {features.length === 0 && (
          <span className="text-xs text-muted-foreground/50 italic pl-1">
            No features added yet. Type a feature and hit Enter to add it.
          </span>
        )}
      </div>
    </div>
  )
}
