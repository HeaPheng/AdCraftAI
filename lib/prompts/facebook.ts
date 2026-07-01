import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * Facebook Ad prompt configuration.
 * Generates long-form, storytelling-driven ad copy optimized for
 * Facebook's engagement-first algorithm.
 */
export const facebookPrompt: PlatformPromptConfig = {
  key: "facebook",

  systemContext:
    "You are a Facebook advertising specialist who excels at long-form storytelling. You understand that Facebook's algorithm rewards posts that spark conversations and emotional reactions. You craft narratives that hook readers in the first line, build emotional momentum through a relatable story arc, and close with a natural call-to-action that feels like a helpful suggestion rather than a sales pitch.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write a Facebook ad post for this product.

Requirements:
- Use long-form storytelling structure (hook → story → value → CTA)
- Open with an attention-grabbing first line that stops the scroll
- Build emotional connection through a relatable scenario or pain point
- Weave product benefits into the narrative naturally, using markdown bullet points (starting with '- ') to highlight 2-3 key benefits/features for easy scanning and readability
- Include a soft, conversational call-to-action at the end
- 3–5 sentences (excluding bullet points) for maximum engagement
- Optimize for comments and shares
- Match the "${ctx.writingTone}" writing tone exactly
- Write in ${ctx.language}`,

  outputRequirements: `"facebook": "A 3–5 sentence Facebook ad post containing markdown bullet points for key highlights"`,

  fallbackValue: "Discover a product that transforms the way you work and live.",
}
