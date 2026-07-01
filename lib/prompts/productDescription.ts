import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * Product Description prompt configuration.
 * Generates a polished, conversion-optimized product description
 * highlighting value proposition and key benefits.
 */
export const productDescriptionPrompt: PlatformPromptConfig = {
  key: "productDescription",

  systemContext:
    "You are a conversion-focused copywriter specializing in product descriptions that sell. You understand how to weave features into benefits, create desire, and remove buyer objections — all within 2–3 compelling sentences.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write a polished, conversion-optimized product description for this product.

Requirements:
- Brief and engaging
- Lead with the primary value proposition
- For products with key features or specifications, ALWAYS follow the introductory paragraph with 2-3 key features/benefits formatted as markdown bullet points (starting with '- ') so that consumers can easily read and understand them quickly
- Weave in key features as tangible benefits
- Address the target audience's pain points or aspirations
- End with a subtle reason to act now
- Match the "${ctx.writingTone}" writing tone exactly
- Write in ${ctx.language}`,

  outputRequirements: `"productDescription": "A conversion-optimized product description (intro paragraph followed by key feature bullet points using '- ')"`,

  fallbackValue: "A premium product designed to meet your needs.",
}
