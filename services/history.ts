import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"

export interface GenerationHistoryItem {
  id: string
  productName: string
  date: string
  result: GenerationResult
  formData: ProductFormValues
}

const STORAGE_PREFIX = "adcraft_history_"

const isClient = () => typeof window !== "undefined"

export const historyService = {
  /**
   * Retrieves a user's full generation history list.
   */
  getUserHistory(userId: string): GenerationHistoryItem[] {
    if (!isClient()) return []
    const key = `${STORAGE_PREFIX}${userId}`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  },

  /**
   * Appends a new generation result to the user's history list.
   */
  addHistoryItem(
    userId: string,
    productName: string,
    formData: ProductFormValues,
    result: GenerationResult
  ): GenerationHistoryItem {
    if (!isClient()) throw new Error("Client execution required")

    const key = `${STORAGE_PREFIX}${userId}`
    const history = this.getUserHistory(userId)

    const newItem: GenerationHistoryItem = {
      id: `history-${Math.random().toString(36).substr(2, 9)}`,
      productName: productName.trim() || formData.productName || "Unnamed Campaign",
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      result,
      formData,
    }

    history.unshift(newItem) // Add to top of the history list
    localStorage.setItem(key, JSON.stringify(history))
    return newItem
  },

  /**
   * Deletes a specific history item.
   */
  deleteHistoryItem(userId: string, itemId: string): GenerationHistoryItem[] {
    if (!isClient()) return []

    const key = `${STORAGE_PREFIX}${userId}`
    const history = this.getUserHistory(userId)
    const filtered = history.filter((item) => item.id !== itemId)

    localStorage.setItem(key, JSON.stringify(filtered))
    return filtered
  },

  /**
   * Adds an existing item directly into the user's history (e.g. during migrations).
   */
  importHistoryItem(userId: string, item: GenerationHistoryItem): GenerationHistoryItem[] {
    if (!isClient()) return []

    const key = `${STORAGE_PREFIX}${userId}`
    const history = this.getUserHistory(userId)

    // Verify it doesn't already exist to prevent duplicates
    if (!history.some((h) => h.id === item.id)) {
      history.unshift(item)
      localStorage.setItem(key, JSON.stringify(history))
    }
    return history
  },
}
