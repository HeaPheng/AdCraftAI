import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * TikTok Caption/Hook prompt configuration.
 * Generates hook-driven, trendy content optimized for
 * TikTok's short-attention-span, entertainment-first audience.
 */
export const tiktokPrompt: PlatformPromptConfig = {
  key: "tiktok",

  systemContext:
    "You are a TikTok viral content strategist who lives on the For You Page. You understand that TikTok content must hook viewers within the first 1–2 seconds or they scroll. You write in a casual, Gen-Z-friendly tone with trend awareness. You create captions and hooks that feel native to the platform — never corporate, always authentic and slightly provocative.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write a TikTok video hook/caption for this product.

Requirements:
- Hook-driven: the first line MUST stop the scroll (use curiosity gaps, bold claims, or pattern interrupts)
- 1–2 sentences maximum — brevity is king
- Casual, conversational, and trend-aware language
- Feel native to TikTok (not like a traditional ad)
- Use language patterns popular on TikTok (e.g., "POV:", "This is your sign to...", "Nobody told me about...")
- Include a soft engagement hook at the end
- Match the "${ctx.writingTone}" writing tone (adapt it to feel TikTok-native)
- Write in ${ctx.language}`,

  outputRequirements: `"tiktok": "A 1–2 sentence TikTok hook/caption that stops the scroll"`,

  fallbackValue: "POV: You just found the thing you didn't know you needed 👀",
}
