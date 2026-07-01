import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * Instagram Caption prompt configuration.
 * Generates short, engaging captions with emojis optimized
 * for Instagram's visual-first, scroll-stopping format.
 */
export const instagramPrompt: PlatformPromptConfig = {
  key: "instagram",

  systemContext:
    "You are an Instagram content creator and caption specialist. You understand that Instagram captions must complement visual content — they should be punchy, aspirational, and emoji-rich. You know how to create micro-stories in 2–3 lines that evoke lifestyle and emotion, driving saves and shares. You never write captions that feel like traditional ads.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write an Instagram caption for this product.

Requirements:
- Short and punchy — 2–3 sentences maximum
- Use relevant emojis strategically (not excessively, 3–5 emojis total)
- Aspirational and lifestyle-oriented language
- Create visual imagery through words
- Include a micro-CTA (e.g., "Link in bio", "Double tap if you agree")
- Break lines for readability (Instagram-native formatting)
- Match the "${ctx.writingTone}" writing tone exactly
- Write in ${ctx.language}`,

  outputRequirements: `"instagram": "A 2–3 sentence Instagram caption with strategic emoji usage"`,

  fallbackValue: "✨ Something incredible just dropped. You don't want to miss this.",
}
