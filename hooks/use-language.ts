import { useLanguageContext } from "@/context/language-context";

/**
 * Custom React Hook to access global translation context.
 * Exposes:
 * - `language`: Active language ("en" | "km")
 * - `setLanguage`: Setter function to switch active language
 * - `t`: Type-safe translations resolver
 */
export function useLanguage() {
  return useLanguageContext();
}
