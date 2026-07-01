import { NextResponse } from "next/server"
import { generateProductSuggestions } from "@/services/gemini"

/**
 * POST /api/suggest
 *
 * Accepts a productName and returns AI-suggested details to auto-fill form parameters.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { productName } = body

    if (!productName || typeof productName !== "string" || !productName.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Product name is required to generate suggestions.",
        },
        { status: 400 }
      )
    }

    const suggestions = await generateProductSuggestions(productName.trim())

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error("[API /api/suggest] Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate suggestions. Please try again.",
      },
      { status: 500 }
    )
  }
}
