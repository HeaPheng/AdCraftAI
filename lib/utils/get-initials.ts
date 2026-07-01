/**
 * Get initials from a user's name.
 * e.g., "Demo User" -> "DU"
 */
export function getInitials(name?: string): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
