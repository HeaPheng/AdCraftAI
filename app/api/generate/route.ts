import { NextResponse } from "next/server"
import { productFormSchema } from "@/types/product"
import { generateMarketingCopy, regenerateSinglePlatformCopy, GeminiServiceError } from "@/services/gemini"

/**
 * POST /api/generate
 *
 * Accepts validated product form data and returns AI-generated
 * marketing copy structured as JSON for each platform.
 * Supports single-platform regeneration if "platform" is provided.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { platform, currentCopy, ...formData } = body

    // Validate the product form data
    const parseResult = productFormSchema.safeParse(
      platform ? formData : body
    )

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data. Please check your form inputs and try again.",
        },
        { status: 400 }
      )
    }

    // Single-platform regeneration route
    if (platform) {
      const regeneratedContent = await regenerateSinglePlatformCopy(
        parseResult.data,
        platform,
        currentCopy || ""
      )
      return NextResponse.json({
        success: true,
        platform,
        data: regeneratedContent,
      })
    }

    // Full marketing copy generation route
    const result = await generateMarketingCopy(parseResult.data)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[API /generate] Error:", error)

    if (error instanceof GeminiServiceError) {
      const statusMap: Record<GeminiServiceError["code"], number> = {
        CONFIG_ERROR: 500,
        TIMEOUT: 504,
        PARSE_ERROR: 502,
        API_ERROR: 502,
        RATE_LIMITED: 429,
        UNKNOWN: 500,
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: statusMap[error.code] }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong on our end. Please try again in a few moments.",
      },
      { status: 500 }
    )
  }
}
