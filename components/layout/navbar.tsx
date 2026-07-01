"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Menu, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  const navItems = [
    { label: t("nav_features"), href: "#features" },
    { label: t("nav_pricing"), href: "#pricing" },
    { label: t("nav_faq"), href: "#faq" },
  ]

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const targetId = href.replace("#", "")
      const elem = document.getElementById(targetId)
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" })
        setIsOpen(false)
      }
    }
  }

  // Escape key close listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Scroll position listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-border/80 bg-background/70 backdrop-blur-md shadow-xs"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-0.5" aria-label="AdCraft AI Home">
          <Image
            src="/logo.png"
            alt="AdCraft AI Logo"
            width={52}
            height={52}
            className="h-[52px] w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            AdCraft<span className="text-violet-600 dark:text-violet-400">AI</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleAnchorClick(e, item.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-1 outline-none focus-visible:text-foreground focus-visible:underline decoration-violet-500 decoration-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher align="end" />
          <ThemeToggle />
          {isLoading ? (
            <div className="h-8 w-24 rounded-xl bg-muted animate-pulse" />
          ) : isAuthenticated ? (
            <Button
              onClick={() => router.push("/dashboard")}
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-200 rounded-xl px-4.5 cursor-pointer"
            >
              {t("nav_dashboard")}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => router.push("/login")}
              >
                {t("nav_sign_in")}
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/register")}
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-200 rounded-xl px-4.5 cursor-pointer"
              >
                {t("nav_get_started")}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation controls */}
        <div className="flex items-center gap-2.5 md:hidden">
          <LanguageSwitcher align="end" />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-full border border-border/40 hover:bg-accent/50 cursor-pointer"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-b border-border/80 bg-background md:hidden overflow-hidden h-[calc(100vh-4rem)]"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col gap-6 max-w-7xl h-full">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-border/20 outline-none focus-visible:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="flex flex-col gap-4 mt-auto pb-12">
                {isLoading ? (
                  <div className="h-11 w-full rounded-xl bg-muted animate-pulse" />
                ) : isAuthenticated ? (
                  <Button
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 rounded-xl cursor-pointer"
                    onClick={() => {
                      setIsOpen(false)
                      router.push("/dashboard")
                    }}
                  >
                    {t("nav_dashboard")}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-border/80 text-foreground hover:bg-accent/50 h-11 rounded-xl cursor-pointer"
                      onClick={() => {
                        setIsOpen(false)
                        router.push("/login")
                      }}
                    >
                      {t("nav_sign_in")}
                    </Button>
                    <Button
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 rounded-xl cursor-pointer"
                      onClick={() => {
                        setIsOpen(false)
                        router.push("/register")
                      }}
                    >
                      {t("nav_get_started")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
