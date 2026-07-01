import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * X (Twitter) Post prompt configuration.
 * Generates concise, high-impact posts optimized for
 * Twitter's 280-character limit and engagement-driven timeline.
 */
export const twitterPrompt: PlatformPromptConfig = {
  key: "twitter",

  systemContext:
    "You are an X (Twitter) engagement specialist who crafts posts that get retweeted and bookmarked. You know that every character counts in the 280-character limit. You write with surgical precision — punchy, witty, and impossible to scroll past. You understand how to use curiosity, controversy (tastefully), and concise value propositions to maximize impressions.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write an X (Twitter) post for this product.

Requirements:
- MUST be under 280 characters (this is a hard limit)
- Concise, punchy, and immediately engaging
- Strong hook in the opening words
- Create a sense of urgency or curiosity
- One clear idea per tweet — no run-on thoughts
- Optimize for retweets and bookmarks
- Match the "${ctx.writingTone}" writing tone (adapted for Twitter's casual directness)
- Write in ${ctx.language}`,

  outputRequirements: `"twitter": "An X (Twitter) post under 280 characters"`,

  fallbackValue: "This changes everything. Seriously.",
}
