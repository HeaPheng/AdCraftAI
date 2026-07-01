import type { ProductFormValues } from "@/types/product"

/**
 * Subset of product form data passed into prompt template builders.
 * Keeps prompt modules decoupled from the full form schema.
 */
export type ProductContext = Pick<
  ProductFormValues,
  | "productName"
  | "productDescription"
  | "productCategory"
  | "brandName"
  | "targetAudience"
  | "writingTone"
  | "language"
  | "features"
  | "platforms"
>

/**
 * Contract that each platform prompt module must implement.
 * Ensures consistency across all prompt files.
 */
export interface PlatformPromptConfig {
  /** Platform identifier key matching GenerationResult fields */
  key: string

  /** Platform-specific context appended to the system prompt */
  systemContext: string

  /** Builds the user-facing prompt from product context */
  buildUserPrompt: (ctx: ProductContext) => string

  /** Structured output requirements for the JSON response */
  outputRequirements: string

  /** Default fallback value if the AI omits this field */
  fallbackValue: string | string[]
}

/**
 * Formats product context into a reusable prompt block.
 * Shared across all platform prompt builders.
 */
export function formatProductBlock(ctx: ProductContext): string {
  const brand = ctx.brandName ? `Brand Name: ${ctx.brandName}` : "Brand Name: Not specified"

  const features =
    ctx.features.length > 0
      ? `Key Features:\n${ctx.features.map((f, i) => `  ${i + 1}. ${f}`).join("\n")}`
      : "No specific features listed."

  return `Product Information:
- Product Name: ${ctx.productName}
- ${brand}
- Category: ${ctx.productCategory}
- Target Audience: ${ctx.targetAudience}
- Writing Tone: ${ctx.writingTone}
- Output Language: ${ctx.language}

Product Description:
${ctx.productDescription}

${features}

Selected Platforms: ${ctx.platforms.join(", ")}`
}
