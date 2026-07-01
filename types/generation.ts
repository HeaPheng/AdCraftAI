/**
 * Structured JSON response from the Gemini AI generation.
 * Each field maps to a specific marketing output channel.
 */
export interface GenerationResult {
  headlines: string[]
  productDescription: string
  facebook: string
  instagram: string
  tiktok: string
  linkedin: string
  twitter: string
  seoDescription: string
  seoKeywords: string[]
  hashtags: string[]
  cta: string[]
}

/**
 * API response wrapper with success/error handling.
 */
export interface GenerationApiResponse {
  success: boolean
  data?: GenerationResult
  error?: string
}
