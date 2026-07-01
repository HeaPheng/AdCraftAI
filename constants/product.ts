/**
 * Product form constants for AdCraft AI.
 * Centralized options for categories, tones, languages, and platforms.
 */

export const PRODUCT_CATEGORIES = [
  { value: "technology", label: "Technology & Software" },
  { value: "ecommerce", label: "E-Commerce & Retail" },
  { value: "health", label: "Health & Wellness" },
  { value: "finance", label: "Finance & Fintech" },
  { value: "education", label: "Education & Learning" },
  { value: "food", label: "Food & Beverage" },
  { value: "travel", label: "Travel & Hospitality" },
  { value: "fashion", label: "Fashion & Beauty" },
  { value: "real-estate", label: "Real Estate" },
  { value: "entertainment", label: "Entertainment & Media" },
  { value: "automotive", label: "Automotive" },
  { value: "saas", label: "SaaS & B2B" },
  { value: "other", label: "Other" },
] as const

export const WRITING_TONES = [
  { value: "professional", label: "Professional", description: "Formal and business-appropriate" },
  { value: "casual", label: "Casual", description: "Friendly and conversational" },
  { value: "persuasive", label: "Persuasive", description: "Compelling and action-driven" },
  { value: "witty", label: "Witty", description: "Clever and engaging" },
  { value: "urgent", label: "Urgent", description: "Time-sensitive and high-energy" },
  { value: "luxurious", label: "Luxurious", description: "Premium and exclusive" },
  { value: "empathetic", label: "Empathetic", description: "Warm and understanding" },
  { value: "bold", label: "Bold", description: "Confident and daring" },
] as const

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
  { value: "ar", label: "Arabic" },
  { value: "hi", label: "Hindi" },
  { value: "th", label: "Thai" },
] as const

export const PLATFORMS = [
  { value: "product-description", label: "Product Description", icon: "FileText" },
  { value: "facebook", label: "Facebook", icon: "Facebook" },
  { value: "instagram", label: "Instagram", icon: "Instagram" },
  { value: "tiktok", label: "TikTok", icon: "Clapperboard" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "twitter", label: "X (Twitter)", icon: "Twitter" },
  { value: "seo", label: "SEO", icon: "Search" },
] as const
