import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"
import { productDescriptionPrompt } from "./productDescription"
import { facebookPrompt } from "./facebook"
import { instagramPrompt } from "./instagram"
import { tiktokPrompt } from "./tiktok"
import { linkedinPrompt } from "./linkedin"
import { twitterPrompt } from "./twitter"
import { seoDescriptionPrompt, seoKeywordsPrompt } from "./seo"
import { headlinesPrompt } from "./headlines"
import { ctaPrompt, hashtagsPrompt } from "./extras"

// ─── Re-exports ────────────────────────────────────────────────
export { MARKETING_SYSTEM_PROMPT } from "./system"
export type { PlatformPromptConfig, ProductContext } from "./types"

// ─── Prompt Registry ───────────────────────────────────────────

/** Map of all platform keys to their prompt configuration */
export const PROMPT_REGISTRY: Record<string, PlatformPromptConfig> = {
  headlines: headlinesPrompt,
  productDescription: productDescriptionPrompt,
  facebook: facebookPrompt,
  instagram: instagramPrompt,
  tiktok: tiktokPrompt,
  linkedin: linkedinPrompt,
  twitter: twitterPrompt,
  seoDescription: seoDescriptionPrompt,
  seoKeywords: seoKeywordsPrompt,
  hashtags: hashtagsPrompt,
  cta: ctaPrompt,
}

// ─── Prompt Builders ───────────────────────────────────────────

/**
 * Builds the full generation prompt combining all platform requirements
 * into a single structured request for one-shot generation.
 */
export function buildFullGenerationPrompt(ctx: ProductContext): string {
  const platformRequirements = Object.values(PROMPT_REGISTRY)
    .map((config) => {
      return `### ${config.key}
Platform context: ${config.systemContext}

${config.outputRequirements}`
    })
    .join("\n\n")

  return `Generate high-converting marketing content for the following product. Each platform's content MUST be uniquely crafted for that platform's specific audience, format, and best practices. NEVER reuse the same wording across platforms.

${formatProductBlock(ctx)}

───────────────────────────────────────────
OUTPUT REQUIREMENTS FOR EACH PLATFORM:
───────────────────────────────────────────

${platformRequirements}

───────────────────────────────────────────
RESPONSE FORMAT:
───────────────────────────────────────────

Respond with ONLY a valid JSON object matching this exact structure:
{
  "headlines": ["Benefit-driven headline", "Curiosity-driven headline", "Authority-driven headline"],
  "productDescription": "",
  "facebook": "",
  "instagram": "",
  "tiktok": "",
  "linkedin": "",
  "twitter": "",
  "seoDescription": "",
  "seoKeywords": [],
  "hashtags": [],
  "cta": ["", "", ""]
}

Critical reminders:
- "headlines" MUST be an array of exactly 3 strings, each a distinct angle
- "cta" MUST be an array of exactly 3 strings, each a different persuasion technique
- "seoKeywords" MUST be an array of 6–10 strings
- "hashtags" MUST be an array of 5–8 strings (without # symbol)
- "twitter" MUST be under 280 characters
- "seoDescription" MUST be under 160 characters
- ALL text content must be in ${ctx.language}
- ALL text content must match the "${ctx.writingTone}" writing tone

Do NOT wrap the JSON in code fences or add any text outside the JSON object.`
}

/**
 * Builds a regeneration prompt for a single platform key.
 * Uses the platform-specific prompt config for targeted instructions.
 */
export function buildSinglePlatformPrompt(
  ctx: ProductContext,
  platformKey: string,
  currentCopy: string
): string {
  const config = PROMPT_REGISTRY[platformKey]

  if (!config) {
    throw new Error(`Unknown platform key: "${platformKey}"`)
  }

  const isArrayOutput = Array.isArray(config.fallbackValue)

  return `Regenerate a completely new variation of marketing content for the platform: "${platformKey}".

Platform context: ${config.systemContext}

${formatProductBlock(ctx)}

Previous version (generate something COMPLETELY DIFFERENT):
"${currentCopy}"

Requirements:
${config.outputRequirements}

Do NOT reuse any wording from the previous version. Create a fresh, original variation while keeping the requested tone and targeting the specified audience.

Respond with ONLY a valid JSON object:
{
  "${platformKey}": ${isArrayOutput ? "[...]" : '"..."'}
}

Do NOT wrap the JSON in code fences or add any text outside the JSON object.`
}
