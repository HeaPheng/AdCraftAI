import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinedDate: string
  defaultTone?: string
  defaultLanguage?: string
}

export interface DbUser extends User {
  password?: string
}

export interface TempGeneration {
  productName: string
  formData: ProductFormValues
  result: GenerationResult
}

const STORAGE_KEYS = {
  USER_SESSION: "adcraft_user_session",
  USERS_DB: "adcraft_users_db",
  ANON_COUNT: "adcraft_anon_count",
  TEMP_GEN: "adcraft_temp_gen",
} as const

// Helper to check if window is defined (for server-side rendering safety)
const isClient = () => typeof window !== "undefined"

// Default mock database with demo user
const DEFAULT_USERS: User[] & { password?: string }[] = [
  {
    id: "demo-user-123",
    name: "Alex Carter",
    email: "demo@adcraft.ai",
    joinedDate: "2026-06-15",
    defaultTone: "Professional",
    defaultLanguage: "English",
  },
]

// Initialize the database in localStorage if not already present
function initUsersDb() {
  if (!isClient()) return
  if (!localStorage.getItem(STORAGE_KEYS.USERS_DB)) {
    const db = DEFAULT_USERS.map((user) => ({
      ...user,
      password: "password123", // Simple plain-text password for mock/testing
    }))
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db))
  }
}

export const authService = {
  /**
   * Logs a user in with email and password.
   */
  async login(email: string, password: string): Promise<User> {
    initUsersDb()
    if (!isClient()) throw new Error("Client execution required")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    const dbRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB)
    const users: DbUser[] = dbRaw ? JSON.parse(dbRaw) : []

    const normalizedEmail = email.toLowerCase().trim()
    const match = users.find(
      (u) => u.email.toLowerCase().trim() === normalizedEmail && u.password === password
    )

    if (!match) {
      throw new Error("Invalid email or password. Use demo@adcraft.ai / password123.")
    }

    // Strip password before returning and storing in session
    const user: DbUser = { ...match }
    delete user.password
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user))
    return user
  },

  /**
   * Registers a new user.
   */
  async register(email: string, password: string, name: string): Promise<User> {
    initUsersDb()
    if (!isClient()) throw new Error("Client execution required")

    await new Promise((resolve) => setTimeout(resolve, 800))

    const dbRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB)
    const users: DbUser[] = dbRaw ? JSON.parse(dbRaw) : []

    const normalizedEmail = email.toLowerCase().trim()
    const exists = users.some((u) => u.email.toLowerCase().trim() === normalizedEmail)

    if (exists) {
      throw new Error("An account with this email address already exists.")
    }

    const newUser: User = {
      id: `user-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: normalizedEmail,
      joinedDate: new Date().toISOString().split("T")[0],
      defaultTone: "Professional",
      defaultLanguage: "English",
    }

    // Append to local mock database
    users.push({ ...newUser, password })
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users))

    // Set active session
    localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(newUser))
    return newUser
  },

  /**
   * Clears the current user session.
   */
  logout(): void {
    if (!isClient()) return
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
  },

  /**
   * Retrieves the current user session, if active.
   */
  getCurrentUser(): User | null {
    if (!isClient()) return null
    const session = localStorage.getItem(STORAGE_KEYS.USER_SESSION)
    return session ? JSON.parse(session) : null
  },

  /**
   * Gets the number of generations done as a guest.
   */
  getAnonymousGenerationCount(): number {
    if (!isClient()) return 0
    const count = localStorage.getItem(STORAGE_KEYS.ANON_COUNT)
    return count ? parseInt(count, 10) : 0
  },

  /**
   * Increments the anonymous generation counter.
   */
  incrementAnonymousGenerationCount(): number {
    if (!isClient()) return 0
    const count = this.getAnonymousGenerationCount() + 1
    localStorage.setItem(STORAGE_KEYS.ANON_COUNT, count.toString())
    return count
  },

  /**
   * Saves a guest generation temporarily before registration.
   */
  saveTempGeneration(productName: string, formData: ProductFormValues, result: GenerationResult): void {
    if (!isClient()) return
    const temp: TempGeneration = { productName, formData, result }
    localStorage.setItem(STORAGE_KEYS.TEMP_GEN, JSON.stringify(temp))
  },

  /**
   * Gets the temporarily saved guest generation.
   */
  getTempGeneration(): TempGeneration | null {
    if (!isClient()) return null
    const temp = localStorage.getItem(STORAGE_KEYS.TEMP_GEN)
    return temp ? JSON.parse(temp) : null
  },

  /**
   * Clears the temporary guest generation.
   */
  clearTempGeneration(): void {
    if (!isClient()) return
    localStorage.removeItem(STORAGE_KEYS.TEMP_GEN)
  },

  /**
   * Updates user settings in the session and mock database.
   */
  async updateUserSettings(userId: string, updates: Partial<User>): Promise<User> {
    if (!isClient()) throw new Error("Client execution required")

    const dbRaw = localStorage.getItem(STORAGE_KEYS.USERS_DB)
    const users: DbUser[] = dbRaw ? JSON.parse(dbRaw) : []

    const userIdx = users.findIndex((u) => u.id === userId)
    if (userIdx === -1) {
      throw new Error("User not found")
    }

    const updatedUser = {
      ...users[userIdx],
      ...updates,
    }

    users[userIdx] = updatedUser
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users))

    // Update active session if it matches current user
    const current = this.getCurrentUser()
    if (current && current.id === userId) {
      const sessionUser: DbUser = { ...updatedUser }
      delete sessionUser.password
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionUser))
      return sessionUser
    }

    return updatedUser
  },
}
