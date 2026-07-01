"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Sparkles } from "lucide-react"

export type ToastType = "success" | "error" | "default"

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback((message: string, type: ToastType = "default") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      dismiss(id)
    }, 3500)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4 sm:px-0"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`
                pointer-events-auto flex items-center justify-between gap-3 w-full
                rounded-xl border p-4 shadow-lg backdrop-blur-md transition-colors
                ${
                  t.type === "success"
                    ? "bg-emerald-50/95 dark:bg-emerald-950/90 border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                    : t.type === "error"
                    ? "bg-destructive/5 dark:bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-background/95 dark:bg-card/95 border-border/80 text-foreground"
                }
              `}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {t.type === "success" && (
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                )}
                {t.type === "error" && (
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                )}
                {t.type === "default" && (
                  <Sparkles className="h-5 w-5 text-violet-500 shrink-0" />
                )}
                <p className="text-sm font-medium leading-tight truncate-two-lines">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-muted-foreground/60 hover:text-foreground p-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Dismiss toast"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
