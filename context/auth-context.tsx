"use client"

import * as React from "react"
import { authService, type User, type TempGeneration } from "@/services/auth"
import { historyService, type GenerationHistoryItem } from "@/services/history"
import type { GenerationResult } from "@/types/generation"
import type { ProductFormValues } from "@/types/product"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  anonymousCount: number
  history: GenerationHistoryItem[]
  tempGeneration: TempGeneration | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  loginWithGoogle: () => Promise<boolean>
  incrementAnonymousCount: () => void
  saveTempGeneration: (productName: string, formData: ProductFormValues, result: GenerationResult) => void
  addToHistory: (productName: string, formData: ProductFormValues, result: GenerationResult) => void
  deleteHistoryItem: (id: string) => void
  updateUserSettings: (updates: Partial<User>) => Promise<boolean>
  preloadedFormData: ProductFormValues | null
  setPreloadedFormData: (data: ProductFormValues | null) => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [anonymousCount, setAnonymousCount] = React.useState(0)
  const [history, setHistory] = React.useState<GenerationHistoryItem[]>([])
  const [tempGeneration, setTempGeneration] = React.useState<TempGeneration | null>(null)
  const [preloadedFormData, setPreloadedFormData] = React.useState<ProductFormValues | null>(null)

  // Load session on mount
  React.useEffect(() => {
    const initSession = () => {
      try {
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)

        const count = authService.getAnonymousGenerationCount()
        setAnonymousCount(count)

        const temp = authService.getTempGeneration()
        setTempGeneration(temp)

        if (currentUser) {
          const userHistory = historyService.getUserHistory(currentUser.id)
          setHistory(userHistory)
        }
      } catch (err) {
        console.error("Failed to restore session:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()
  }, [])

  // Load Google Identity Services script
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
      return () => {
        try {
          document.head.removeChild(script)
        } catch {}
      }
    }
  }, [])

  // Transfer guest generation to user's history if any exists after successful login/auth
  const handleAuthSuccess = async (authUser: User) => {
    setUser(authUser)
    setIsLoading(true)

    try {
      // Fetch user's existing history
      let userHistory = historyService.getUserHistory(authUser.id)

      // Check for temporary guest generation
      const temp = authService.getTempGeneration()
      if (temp) {
        // Add to history
        const importedItem = historyService.addHistoryItem(
          authUser.id,
          temp.productName,
          temp.formData,
          temp.result
        )
        // Clear from service & local storage
        authService.clearTempGeneration()
        setTempGeneration(null)
        // Prepend to history state
        userHistory = [importedItem, ...userHistory.filter((item) => item.id !== importedItem.id)]
      }

      setHistory(userHistory)
    } catch (err) {
      console.error("Failed during auth transition:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authUser = await authService.login(email, password)
      await handleAuthSuccess(authUser)
      return true
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const authUser = await authService.register(email, password, name)
      await handleAuthSuccess(authUser)
      return true
    } catch (error) {
      throw error
    }
  }

  const logout = React.useCallback(() => {
    authService.logout()
    setUser(null)
    setHistory([])
    // We retain anonymousCount and tempGeneration in memory/storage
  }, [])

  const loginWithGoogle = async (): Promise<boolean> => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    // Fallback/Demo Mode if Client ID is not configured
    if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
      console.warn("[AdCraft Auth] Google Client ID is not configured. Running mock authentication.")
      
      await new Promise((resolve) => setTimeout(resolve, 800))
      
      const mockGoogleUser: User = {
        id: "mock-google-user",
        name: "Demo Gmail User",
        email: "demo@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
        joinedDate: new Date().toISOString().split("T")[0],
        defaultTone: "Professional",
        defaultLanguage: "English",
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("adcraft_user_session", JSON.stringify(mockGoogleUser))
      }
      
      await handleAuthSuccess(mockGoogleUser)
      throw new Error("DEMO_MODE_NOTICE")
    }

    interface GoogleTokenResponse {
      error?: string
      error_description?: string
      access_token?: string
    }

    interface GooglePopupError {
      message?: string
    }

    interface GoogleOAuthClient {
      requestAccessToken: () => void
    }

    interface GoogleOAuth {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (tokenResponse: GoogleTokenResponse) => Promise<void>
            error_callback?: (err: GooglePopupError) => void
          }) => GoogleOAuthClient
        }
      }
    }

    return new Promise((resolve, reject) => {
      const google = (window as unknown as { google?: GoogleOAuth }).google
      if (!google || !google.accounts || !google.accounts.oauth2) {
        reject(new Error("Google Identity SDK is loading. Please try again in 2 seconds."))
        return
      }

      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          callback: async (tokenResponse: GoogleTokenResponse) => {
            if (tokenResponse.error) {
              reject(new Error(`Google Sign-In failed: ${tokenResponse.error_description || tokenResponse.error}`))
              return
            }

            try {
              const userInfoResponse = await fetch(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
              )
              
              if (!userInfoResponse.ok) {
                reject(new Error("Failed to retrieve Google profile info."))
                return
              }

              const profile = await userInfoResponse.json()
              
              const googleUser: User = {
                id: profile.sub,
                name: profile.name || profile.given_name || "Google User",
                email: profile.email,
                avatar: profile.picture,
                joinedDate: new Date().toISOString().split("T")[0],
                defaultTone: "Professional",
                defaultLanguage: "English",
              }

              if (typeof window !== "undefined") {
                localStorage.setItem("adcraft_user_session", JSON.stringify(googleUser))
              }

              await handleAuthSuccess(googleUser)
              resolve(true)
            } catch {
              reject(new Error("An error occurred during Google profile verification."))
            }
          },
          error_callback: (err: GooglePopupError) => {
            reject(new Error(`Google Sign-In Popup Error: ${err.message || "Consent closed."}`))
          }
        })

        client.requestAccessToken()
      } catch (error: unknown) {
        reject(new Error(`Failed to initialize Google Login Client: ${(error as Error).message}`))
      }
    })
  }

  const incrementAnonymousCount = () => {
    const newCount = authService.incrementAnonymousGenerationCount()
    setAnonymousCount(newCount)
  }

  const saveTempGeneration = (
    productName: string,
    formData: ProductFormValues,
    result: GenerationResult
  ) => {
    authService.saveTempGeneration(productName, formData, result)
    setTempGeneration({ productName, formData, result })
  }

  const addToHistory = (
    productName: string,
    formData: ProductFormValues,
    result: GenerationResult
  ) => {
    if (!user) return
    const newItem = historyService.addHistoryItem(user.id, productName, formData, result)
    setHistory((prev) => [newItem, ...prev])
  }

  const deleteHistoryItem = (id: string) => {
    if (!user) return
    const updatedHistory = historyService.deleteHistoryItem(user.id, id)
    setHistory(updatedHistory)
  }

  const updateUserSettings = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false
    try {
      const updatedUser = await authService.updateUserSettings(user.id, updates)
      setUser(updatedUser)
      return true
    } catch (err) {
      console.error("Failed to update user settings:", err)
      return false
    }
  }

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      anonymousCount,
      history,
      tempGeneration,
      login,
      register,
      logout,
      loginWithGoogle,
      incrementAnonymousCount,
      saveTempGeneration,
      addToHistory,
      deleteHistoryItem,
      updateUserSettings,
      preloadedFormData,
      setPreloadedFormData,
    }),
    [user, isLoading, anonymousCount, history, tempGeneration, preloadedFormData, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
