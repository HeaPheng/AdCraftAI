import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * CTA (Call-to-Action) prompt configuration.
 * Generates three unique, action-oriented CTA phrases.
 */
export const ctaPrompt: PlatformPromptConfig = {
  key: "cta",

  systemContext:
    "You are a conversion optimization specialist who writes calls-to-action that drive clicks. You understand the psychology of action — urgency, benefit clarity, and low-friction language. Every CTA you write feels like the natural next step, not a demand.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Generate 3 unique call-to-action phrases for this product.

Requirements:
- Each CTA must use a different persuasion angle:
  1. Urgency-driven — creates time pressure or scarcity
  2. Benefit-driven — highlights what the user gains by clicking
  3. Curiosity-driven — makes them want to explore further
- 3–7 words per CTA
- Action-oriented verbs (Start, Get, Discover, Unlock, Claim, etc.)
- Match the "${ctx.writingTone}" writing tone
- Write in ${ctx.language}`,

  outputRequirements: `"cta": ["Urgency CTA", "Benefit CTA", "Curiosity CTA"] (exactly 3 items)`,

  fallbackValue: ["Get Started Now", "See What's Possible", "Learn More Today"],
}

/**
 * Hashtags prompt configuration.
 * Generates trending, relevant hashtags for social media posts.
 */
export const hashtagsPrompt: PlatformPromptConfig = {
  key: "hashtags",

  systemContext:
    "You are a social media hashtag strategist. You understand hashtag discoverability, trending topics, and the balance between broad reach tags and niche-specific tags. You always return hashtags without the # symbol.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Generate hashtag suggestions for this product.

Requirements:
- Return an array of 5–8 relevant hashtags
- DO NOT include the # symbol (just the text)
- Mix of broad-reach tags and niche-specific tags
- Include at least one branded tag if a brand name is provided
- Include at least one trending/general engagement tag
- Relevant to the product category and target audience
- Hashtags should work across Instagram, TikTok, and LinkedIn`,

  outputRequirements: `"hashtags": ["hashtag1", "hashtag2", ...] (5–8 items, without # symbol)`,

  fallbackValue: ["marketing", "business", "growth", "innovation", "trending"],
}
