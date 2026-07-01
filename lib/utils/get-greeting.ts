import type { TranslationKey } from "@/lib/translations";

/**
 * Returns the appropriate greeting translation key based on the local time.
 */
export function getGreetingKey(hours: number = new Date().getHours()): TranslationKey {
  if (hours >= 5 && hours < 12) {
    return "db_welcome_morning";
  } else if (hours >= 12 && hours < 17) {
    return "db_welcome_afternoon";
  } else {
    return "db_welcome_evening";
  }
}
