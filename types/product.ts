import { z } from "zod/v4"

/**
 * Static Zod schema for the AdCraft AI product information form.
 * Used for backend server-side validation.
 */
export const productFormSchema = z.object({
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be 100 characters or fewer"),

  productDescription: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be 2000 characters or fewer"),

  productCategory: z
    .string()
    .min(1, "Please select a product category"),

  brandName: z
    .string()
    .max(100, "Brand name must be 100 characters or fewer")
    .optional()
    .or(z.literal("")),

  targetAudience: z
    .string()
    .min(3, "Target audience must be at least 3 characters")
    .max(200, "Target audience must be 200 characters or fewer"),

  writingTone: z
    .string()
    .min(1, "Please select a writing tone"),

  language: z
    .string()
    .min(1, "Please select a language"),

  platforms: z
    .array(z.string())
    .min(1, "Select at least one platform"),

  features: z
    .array(z.string().min(1, "Feature cannot be empty")),
})

/**
 * Dynamic translated schema helper.
 * Provides localized validation messages in the user's active interface language.
 */
export const getProductFormSchema = (t: (key: any) => string) =>
  z.object({
    productName: z
      .string()
      .min(2, t("val_product_name_min"))
      .max(100, t("val_product_name_max")),

    productDescription: z
      .string()
      .min(20, t("val_desc_min"))
      .max(2000, t("val_desc_max")),

    productCategory: z
      .string()
      .min(1, t("val_category")),

    brandName: z
      .string()
      .max(100, t("val_brand_max"))
      .optional()
      .or(z.literal("")),

    targetAudience: z
      .string()
      .min(3, t("val_audience_min"))
      .max(200, t("val_audience_max")),

    writingTone: z
      .string()
      .min(1, t("val_tone")),

    language: z
      .string()
      .min(1, t("val_language")),

    platforms: z
      .array(z.string())
      .min(1, t("val_platforms")),

    features: z
      .array(z.string().min(1, t("val_feature_empty"))),
  })

export type ProductFormValues = z.infer<typeof productFormSchema>
