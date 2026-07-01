import { en } from "@/locales/en";

/**
 * Strictly-typed key dictionary derived from the base English translations.
 * Prevents typos and catches missing or invalid translation keys at compile-time.
 */
export type TranslationKey = keyof typeof en;
