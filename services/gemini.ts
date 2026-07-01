import { GoogleGenerativeAI } from "@google/generative-ai"
import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"
import {
  MARKETING_SYSTEM_PROMPT,
  buildFullGenerationPrompt,
  buildSinglePlatformPrompt,
} from "@/lib/prompts"
import { validateAndSanitize, validateSinglePlatform } from "@/lib/validation"

/** Default configuration for the Gemini service */
const GEMINI_CONFIG = {
  maxRetries: 2,
  timeoutMs: 30_000,
  temperature: 0.9,
  maxOutputTokens: 4096,
} as const

/** Fallback models list to bypass rate limits or service outages on retries */
const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite", // Primary (ultra-fast, low-latency)
  "gemini-2.5-flash",      // Backup 1 (high performance)
  "gemini-2.5-pro",        // Backup 2 (advanced logic)
  "gemini-2.0-flash",      // Backup 3 (resilient Gemini 2.0)
] as const

/**
 * Creates a configured GoogleGenerativeAI instance.
 * Throws immediately if the API key is missing.
 */
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new GeminiServiceError(
      "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.",
      "CONFIG_ERROR"
    )
  }
  return new GoogleGenerativeAI(apiKey)
}

/**
 * Custom error class for the Gemini service.
 * Provides error codes for structured error handling upstream.
 */
export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public code: "CONFIG_ERROR" | "TIMEOUT" | "PARSE_ERROR" | "API_ERROR" | "RATE_LIMITED" | "UNKNOWN"
  ) {
    super(message)
    this.name = "GeminiServiceError"
  }
}

/**
 * Wraps a promise with a timeout. Rejects if the promise doesn't
 * settle within the specified duration.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timeoutId: NodeJS.Timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new GeminiServiceError(
        `Request timed out after ${ms / 1000} seconds. The AI model may be overloaded — please try again.`,
        "TIMEOUT"
      ))
    }, ms)
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId)
  })
}

/**
 * Extracts and cleans JSON from the model's text response.
 * Handles responses wrapped in code fences gracefully.
 */
function extractJson(text: string): unknown {
  let cleaned = text.trim()

  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
  }

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new GeminiServiceError(
      "Failed to parse the AI response. The model returned an unexpected format. Please try again.",
      "PARSE_ERROR"
    )
  }
}

/**
 * Determines if an error is retryable.
 * Rate limits, timeouts, and transient server errors warrant retries.
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof GeminiServiceError) {
    return error.code === "TIMEOUT" || error.code === "RATE_LIMITED"
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    return (
      message.includes("429") ||
      message.includes("503") ||
      message.includes("500") ||
      message.includes("rate limit") ||
      message.includes("overloaded") ||
      message.includes("unavailable") ||
      message.includes("exhausted") ||
      message.includes("quota") ||
      message.includes("limit")
    )
  }
  return false
}

/**
 * Main generation function.
 * Calls Gemini with retry logic and timeout handling.
 *
 * @param formData - Validated product form data
 * @returns Structured generation result validated with Zod + fallbacks
 */
export async function generateMarketingCopy(
  formData: ProductFormValues
): Promise<GenerationResult> {
  const client = getGeminiClient()
  const prompt = buildFullGenerationPrompt(formData)
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= GEMINI_CONFIG.maxRetries; attempt++) {
    try {
      // Exponential backoff on retries (0ms, 1s, 3s)
      // Rollover model on retry attempts
      const modelName = FALLBACK_MODELS[attempt] || FALLBACK_MODELS[0]
      console.debug(`[Gemini] Attempt ${attempt + 1}/${GEMINI_CONFIG.maxRetries + 1} using model: ${modelName}`)
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: MARKETING_SYSTEM_PROMPT,
        generationConfig: {
          temperature: GEMINI_CONFIG.temperature,
          maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          responseMimeType: "application/json",
        },
      })

      const result = await withTimeout(
        model.generateContent(prompt),
        GEMINI_CONFIG.timeoutMs
      )

      const response = result.response
      const text = response.text()

      if (!text) {
        throw new GeminiServiceError(
          "The AI model returned an empty response. Please try again.",
          "API_ERROR"
        )
      }

      // Extract JSON and validate with Zod + fallbacks
      const raw = extractJson(text)
      return validateAndSanitize(raw)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`[Gemini] Attempt ${attempt + 1} failed:`, lastError.message)

      // Check for rate limiting specifically
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.toLowerCase().includes("quota") ||
          error.message.toLowerCase().includes("exhausted") ||
          error.message.toLowerCase().includes("limit") ||
          error.message.toLowerCase().includes("rate limit"))

      if (isRateLimit) {
        lastError = new GeminiServiceError(
          "Rate limited by the AI service. Please wait a moment and try again.",
          "RATE_LIMITED"
        )
      }

      // Only retry on retryable errors
      if (!isRetryableError(error) || attempt === GEMINI_CONFIG.maxRetries) {
        break
      }

      // Add delay before retry
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // Throw the last error with a user-friendly message
  if (lastError instanceof GeminiServiceError) {
    throw lastError
  }

  throw new GeminiServiceError(
    lastError?.message || "An unexpected error occurred while generating content. Please try again.",
    "UNKNOWN"
  )
}

/**
 * Regenerates copy for a single platform individually.
 * Validates the returned value with per-platform Zod + fallback logic.
 */
export async function regenerateSinglePlatformCopy(
  formData: ProductFormValues,
  platformKey: string,
  currentCopy: string
): Promise<string | string[]> {
  const client = getGeminiClient()
  const prompt = buildSinglePlatformPrompt(formData, platformKey, currentCopy)
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= GEMINI_CONFIG.maxRetries; attempt++) {
    try {
      // Rollover model on retry attempts
      const modelName = FALLBACK_MODELS[attempt] || FALLBACK_MODELS[0]
      console.debug(`[Gemini Single Platform] Attempt ${attempt + 1}/${GEMINI_CONFIG.maxRetries + 1} using model: ${modelName}`)
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: MARKETING_SYSTEM_PROMPT,
        generationConfig: {
          temperature: GEMINI_CONFIG.temperature,
          maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
          responseMimeType: "application/json",
        },
      })

      const result = await withTimeout(
        model.generateContent(prompt),
        GEMINI_CONFIG.timeoutMs
      )

      const response = result.response
      const text = response.text()

      if (!text) {
        throw new GeminiServiceError(
          "The AI model returned an empty response. Please try again.",
          "API_ERROR"
        )
      }

      const raw = extractJson(text) as Record<string, unknown>

      if (raw[platformKey] === undefined) {
        throw new GeminiServiceError(
          `Missing key "${platformKey}" in AI response. Please try again.`,
          "PARSE_ERROR"
        )
      }

      // Validate per-platform value with fallback
      return validateSinglePlatform(raw[platformKey], platformKey)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`[Gemini Single Platform] Attempt ${attempt + 1} failed:`, lastError.message)

      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.toLowerCase().includes("quota") ||
          error.message.toLowerCase().includes("exhausted") ||
          error.message.toLowerCase().includes("limit") ||
          error.message.toLowerCase().includes("rate limit"))

      if (isRateLimit) {
        lastError = new GeminiServiceError(
          "Rate limited by the AI service. Please wait a moment and try again.",
          "RATE_LIMITED"
        )
      }

      if (!isRetryableError(error) || attempt === GEMINI_CONFIG.maxRetries) {
        break
      }

      // Add delay before retry
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  if (lastError instanceof GeminiServiceError) {
    throw lastError
  }

  throw new GeminiServiceError(
    lastError?.message || "An unexpected error occurred while regenerating content. Please try again.",
    "UNKNOWN"
  )
}

/**
 * Generates marketing suggestions for a given product name to auto-fill the form.
 */
export async function generateProductSuggestions(productName: string): Promise<{
  brandName?: string
  productCategory?: string
  productDescription?: string
  features?: string[]
  targetAudience?: string
  writingTone?: string
}> {
  let lastError: Error | null = null
  const client = getGeminiClient()

  for (let attempt = 0; attempt < FALLBACK_MODELS.length; attempt++) {
    const modelName = FALLBACK_MODELS[attempt]
    try {
      const model = client.getGenerativeModel({ model: modelName })

      const systemPrompt = `You are a digital marketing strategist. Given a product name, suggest standard details to auto-fill a copywriting form.
Respond ONLY with a valid JSON object matching this schema. Do not add markdown wrappers around the JSON, just return raw JSON text:
{
  "brandName": "Logical brand name or company for this product (optional, e.g. 'FitTech')",
  "productCategory": "Must be exactly one of: technology, ecommerce, health, finance, education, food, travel, fashion, real-estate, entertainment, automotive, saas, other",
  "productDescription": "Short compelling product description, 1 to 2 sentences. You can optionally use markdown bullet points (starting with '- ') if appropriate to list features (e.g. 'An adjustable desk lamp. - 3 brightness levels - Flexible gooseneck')",
  "features": ["Standout feature 1", "Standout feature 2", "Standout feature 3"],
  "targetAudience": "Logical target demographic, 2-5 words (e.g. 'Busy professionals & fitness enthusiasts')",
  "writingTone": "Must be exactly one of: professional, friendly, persuasive, bold, luxury, witty, empathetic"
}`

      const prompt = `Product Name: "${productName}"`

      const responseText = await withTimeout(
        (async () => {
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
            systemInstruction: systemPrompt,
          })
          return result.response.text()
        })(),
        15_000
      )

      let cleanJson = responseText.trim()
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim()
      }

      const suggestions = JSON.parse(cleanJson)
      return {
        brandName: suggestions.brandName || "",
        productCategory: suggestions.productCategory || "",
        productDescription: suggestions.productDescription || "",
        features: Array.isArray(suggestions.features) ? suggestions.features : [],
        targetAudience: suggestions.targetAudience || "",
        writingTone: suggestions.writingTone || "",
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`[generateProductSuggestions] Attempt ${attempt} failed with ${modelName}. Retrying...`)
    }
  }

  console.error("[generateProductSuggestions] All fallback models failed. Last error:", lastError)
  return {}
}
