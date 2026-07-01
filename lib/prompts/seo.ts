import type { PlatformPromptConfig, ProductContext } from "./types"
import { formatProductBlock } from "./types"

/**
 * SEO prompt configuration.
 * Generates keyword-optimized meta description and keyword array
 * designed to maximize search engine click-through rates.
 */
export const seoDescriptionPrompt: PlatformPromptConfig = {
  key: "seoDescription",

  systemContext:
    "You are an SEO specialist with deep expertise in keyword research, search intent analysis, and meta description optimization. You understand how Google renders search snippets and what drives users to click. You craft meta descriptions that balance keyword density with compelling ad-like copywriting, always staying within the 160-character display limit.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Write an SEO meta description for this product.

Requirements:
- Maximum 160 characters (hard limit — Google truncates beyond this)
- Include the primary target keyword naturally in the first 60 characters
- Write like a mini-ad: value proposition + reason to click
- Include an implicit or explicit CTA
- Avoid keyword stuffing — read naturally to humans
- Match the "${ctx.writingTone}" writing tone
- Write in ${ctx.language}`,

  outputRequirements: `"seoDescription": "An SEO meta description under 160 characters"`,

  fallbackValue: "Discover the best solution for your needs. Shop now and experience the difference.",
}

export const seoKeywordsPrompt: PlatformPromptConfig = {
  key: "seoKeywords",

  systemContext:
    "You are an SEO keyword research specialist. You understand search volume distribution, long-tail vs. short-tail keywords, and how to map keywords to search intent. You select keywords that balance competitiveness with relevance.",

  buildUserPrompt: (ctx: ProductContext) => `${formatProductBlock(ctx)}

Generate SEO keywords for this product.

Requirements:
- Return an array of 6–10 relevant SEO keywords
- Mix of short-tail (1–2 words) and long-tail (3–4 words) keywords
- Include the product category and brand name (if available) in at least one keyword
- Focus on commercial and transactional search intent
- Order by estimated relevance (most relevant first)
- Keywords should be in ${ctx.language}`,

  outputRequirements: `"seoKeywords": ["keyword1", "keyword2", ...] (6–10 items)`,

  fallbackValue: ["product", "best solution", "buy online", "top rated", "premium quality", "shop now"],
}
