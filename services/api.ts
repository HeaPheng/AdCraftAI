import type { ProductFormValues } from "@/types/product"
import type { GenerationApiResponse } from "@/types/generation"

/**
 * Client-side service to call the /api/generate endpoint.
 * Handles fetch errors, timeouts, and non-OK responses with
 * user-friendly error messages.
 */
export async function generateAdCopy(
  formData: ProductFormValues
): Promise<GenerationApiResponse> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60_000) // 60s client timeout

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data: GenerationApiResponse = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || getErrorMessageForStatus(response.status),
      }
    }

    return data
  } catch (error) {
    // Handle abort (timeout)
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        error: "The request timed out. The AI model may be busy — please try again.",
      }
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error. Please check your internet connection and try again.",
      }
    }

    return {
      success: false,
      error: "Something went wrong. Please try again in a few moments.",
    }
  }
}

/**
 * Maps HTTP status codes to user-friendly error messages.
 */
function getErrorMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your form inputs."
    case 429:
      return "Too many requests. Please wait a moment and try again."
    case 500:
      return "Server error. Please try again in a few moments."
    case 502:
      return "The AI service returned an unexpected response. Please try again."
    case 504:
      return "The AI service took too long to respond. Please try again."
    default:
      return "An unexpected error occurred. Please try again."
  }
}

/**
 * Client-side service to regenerate ad copy for a single platform.
 */
export async function regeneratePlatformCopy(
  formData: ProductFormValues,
  platform: string,
  currentCopy: string
): Promise<{ success: boolean; data?: string | string[]; error?: string }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60_000) // 60s client timeout

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        platform,
        currentCopy,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || getErrorMessageForStatus(response.status),
      }
    }

    return data
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        error: "The request timed out. The AI model may be busy — please try again.",
      }
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error. Please check your internet connection and try again.",
      }
    }

    return {
      success: false,
      error: "Something went wrong. Please try again in a few moments.",
    }
  }
}

/**
 * Client-side service to fetch suggestions for a product name.
 */
export async function suggestProductDetails(productName: string): Promise<{
  success: boolean
  data?: {
    brandName?: string
    productCategory?: string
    productDescription?: string
    features?: string[]
    targetAudience?: string
    writingTone?: string
  }
  error?: string
}> {
  try {
    const response = await fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to generate suggestions.",
      }
    }

    return data
  } catch {
    return {
      success: false,
      error: "Something went wrong fetching suggestions. Please try again.",
    }
  }
}
