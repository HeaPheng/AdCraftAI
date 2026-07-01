import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * Headlines prompt configuration.
 * Generates three distinct headline variations, each with a different
 * angle and persuasion technique.
 */
export const headlinesPrompt: PlatformPromptConfig = {
  key: "headlines",

  systemContext:
    "You are a brand strategist and headline writer with a knack for distilling complex value propositions into punchy, memorable taglines. You understand the psychology of attention — curiosity, benefit-driven language, and emotional triggers. You never write generic headlines; every headline has a clear angle and strategic purpose.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Generate 3 distinct headline variations for this product.

Requirements:
- Each headline MUST be a different angle (do not rephrase the same idea):
  1. Benefit-driven headline — focuses on what the customer gains
  2. Curiosity-driven headline — creates intrigue, makes them want to learn more
  3. Authority-driven headline — positions the product as the best/leading choice
- Maximum 10 words per headline
- Punchy, memorable, and immediately understandable
- Could work as a universal tagline across platforms
- Match the "${ctx.writingTone}" writing tone
- Write in ${ctx.language}`,

  outputRequirements: `"headlines": ["Benefit headline", "Curiosity headline", "Authority headline"] (exactly 3 items)`,

  fallbackValue: ["Your Solution Starts Here", "What If Everything Changed Today?", "The #1 Choice for Smart Buyers"],
}
