import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * LinkedIn Sponsored Post prompt configuration.
 * Generates professional, business-focused content optimized for
 * LinkedIn's thought-leadership and B2B engagement model.
 */
export const linkedinPrompt: PlatformPromptConfig = {
  key: "linkedin",

  systemContext:
    "You are a LinkedIn thought-leadership strategist who crafts posts that establish authority and drive professional engagement. You understand that LinkedIn audiences value data-driven insights, business impact, and credible expertise. You write content that reads like a trusted industry advisor's recommendation — not a sales pitch.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write a LinkedIn sponsored post for this product.

Requirements:
- Professional and business-focused tone throughout
- Lead with a thought-leadership angle or industry insight
- Quantify value where possible (ROI, efficiency, productivity)
- Position the product as a strategic business decision, using markdown bullet points (starting with '- ') to list 2-3 key strategic highlights/benefits for easy professional reading
- 2–3 sentences (excluding bullet points) that feel authoritative and credible
- Include a professional CTA (e.g., "Learn how...", "See why leading teams...")
- Avoid casual language, slang, or emojis
- Match the "${ctx.writingTone}" writing tone (adapt to LinkedIn's professional context)
- Write in ${ctx.language}`,

  outputRequirements: `"linkedin": "A professional LinkedIn sponsored post containing markdown bullet points for strategic highlights"`,

  fallbackValue: "Leading teams are already leveraging this solution to drive measurable results.",
}
