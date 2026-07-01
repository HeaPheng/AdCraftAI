import { z } from "zod"
import type { GenerationResult } from "@/types/generation"
import { PROMPT_REGISTRY } from "@/lib/prompts"

// ─── Zod Schema ────────────────────────────────────────────────

/**
 * Zod schema for validating the complete AI generation response.
 * Uses `.catch()` on every field to provide fallback values
 * instead of throwing on missing or malformed fields.
 */
export const generationResultSchema = z.object({
  headlines: z
    .array(z.string().min(1))
    .min(1)
    .max(10)
    .catch(PROMPT_REGISTRY.headlines.fallbackValue as string[]),

  productDescription: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.productDescription.fallbackValue as string),

  facebook: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.facebook.fallbackValue as string),

  instagram: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.instagram.fallbackValue as string),

  tiktok: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.tiktok.fallbackValue as string),

  linkedin: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.linkedin.fallbackValue as string),

  twitter: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.twitter.fallbackValue as string),

  seoDescription: z
    .string()
    .min(1)
    .catch(PROMPT_REGISTRY.seoDescription.fallbackValue as string),

  seoKeywords: z
    .array(z.string().min(1))
    .min(1)
    .catch(PROMPT_REGISTRY.seoKeywords.fallbackValue as string[]),

  hashtags: z
    .array(z.string().min(1))
    .min(1)
    .catch(PROMPT_REGISTRY.hashtags.fallbackValue as string[]),

  cta: z
    .array(z.string().min(1))
    .min(1)
    .max(10)
    .catch(PROMPT_REGISTRY.cta.fallbackValue as string[]),
})

// ─── Validation & Sanitization ─────────────────────────────────

/**
 * Validates and sanitizes the raw AI JSON response.
 * Uses Zod's `.catch()` chaining so every field gracefully
 * falls back to its platform-defined default when missing or malformed.
 *
 * @param raw - The parsed JSON object from the AI response
 * @returns A guaranteed-complete GenerationResult
 */
export function validateAndSanitize(raw: unknown): GenerationResult {
  // Handle legacy `headline` (string) → `headlines` (string[]) migration
  if (
    raw &&
    typeof raw === "object" &&
    "headline" in raw &&
    !("headlines" in raw)
  ) {
    const legacy = raw as Record<string, unknown>
    legacy.headlines = typeof legacy.headline === "string"
      ? [legacy.headline]
      : legacy.headline
    delete legacy.headline
  }

  const result = generationResultSchema.parse(raw)
  return result as GenerationResult
}

// ─── Single-Platform Validation ────────────────────────────────

/**
 * Validates a single-platform regeneration response.
 * Returns the validated value or the platform's fallback.
 */
export function validateSinglePlatform(
  raw: unknown,
  platformKey: string
): string | string[] {
  const config = PROMPT_REGISTRY[platformKey]
  if (!config) {
    throw new Error(`Unknown platform key: "${platformKey}"`)
  }

  if (raw === null || raw === undefined) {
    return config.fallbackValue
  }

  // Array fields
  if (Array.isArray(config.fallbackValue)) {
    if (Array.isArray(raw) && raw.length > 0 && raw.every((v) => typeof v === "string" && v.length > 0)) {
      return raw as string[]
    }
    return config.fallbackValue
  }

  // String fields
  if (typeof raw === "string" && raw.length > 0) {
    return raw
  }

  return config.fallbackValue as string
}
