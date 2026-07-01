"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  trigger?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  trigger,
  size = "lg",
}: ModalProps) {
  const widthClass = sizeClasses[size] || "max-w-lg"

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs transition-opacity duration-150 data-closed:opacity-0" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Popup
            className={`w-full ${widthClass} rounded-2xl border border-border/80 bg-background p-6 shadow-xl outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <Dialog.Title className="text-base font-bold text-foreground">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="text-xs text-muted-foreground mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close
                className="rounded-lg p-1 text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>
            <div className="text-sm">{children}</div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
