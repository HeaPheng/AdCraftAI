"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Sparkles,
  PlusCircle,
  History,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  Languages,
  Lightbulb,
  Rocket,
  Trash2,
  Check,
  BellOff,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils/get-initials"
import { PageTransition } from "@/components/ui/page-transition"
import { ToastProvider } from "@/components/ui/toast"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import type { TranslationKey } from "@/lib/translations"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

interface NotificationItem {
  id: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  title: string
  description: string
  time: string
  read: boolean
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Notifications state
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: "1",
      icon: Sparkles,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
      title: "db_notif_title_welcome",
      description: "db_notif_desc_welcome",
      time: "db_notif_time_welcome",
      read: false,
    },
    {
      id: "2",
      icon: Languages,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      title: "db_notif_title_khmer",
      description: "db_notif_desc_khmer",
      time: "db_notif_time_khmer",
      read: false,
    },
    {
      id: "3",
      icon: Lightbulb,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      title: "db_notif_title_suggest",
      description: "db_notif_desc_suggest",
      time: "db_notif_time_suggest",
      read: false,
    },
    {
      id: "4",
      icon: Rocket,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      title: "db_notif_title_coming_soon",
      description: "db_notif_desc_coming_soon",
      time: "db_notif_time_coming_soon",
      read: true,
    },
  ])


  const [hasUnread, setHasUnread] = React.useState(true)

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setHasUnread(false)
  }

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications([])
    setHasUnread(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setHasUnread(false)
    }
  }

  // Route protection: Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Dynamic Navigation Items
  const navItems: NavItem[] = React.useMemo(() => [
    { label: t("db_nav_generator"), href: "/dashboard", icon: PlusCircle },
    { label: t("db_nav_history"), href: "/dashboard/history", icon: History },
    { label: t("db_nav_profile"), href: "/dashboard/profile", icon: UserIcon },
    { label: t("db_nav_settings"), href: "/dashboard/settings", icon: SettingsIcon },
  ], [t])

  // Get active breadcrumb label
  const getBreadcrumbs = (): { label: string; href?: string; active?: boolean }[] => {
    const activeItem = navItems.find((item) => item.href === pathname)
    return [
      { label: activeItem?.label || t("db_nav_generator"), active: true },
    ]
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Render loading state while validating session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
          <span className="text-sm font-medium text-muted-foreground">{t("common_loading")}</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* ─── Sidebar (Desktop) ─── */}
      <aside aria-label="Main navigation" className="hidden lg:flex flex-col h-screen fixed left-0 top-0 bottom-0 w-16 hover:w-64 border-r border-border bg-card/45 select-none shrink-0 group/sidebar transition-all duration-300 ease-in-out z-20">

        {/* Brand header */}
        <div className="flex h-16 items-center px-4 group-hover/sidebar:px-6 border-b border-border/40 gap-2 overflow-hidden transition-all duration-300">
          <Image
            src="/logo.png"
            alt="AdCraft AI Logo"
            width={48}
            height={48}
            className="h-12 w-auto object-contain shrink-0"
          />
          <span className="font-display text-lg font-bold tracking-tight opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 truncate">
            AdCraft<span className="text-[#7c3aed]">AI</span>
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-2.5 group-hover/sidebar:px-4 py-6 space-y-1 transition-all duration-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all duration-200 outline-none w-full overflow-hidden ${
                  isActive
                    ? "bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent font-semibold"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Footer profile & logout */}
        <div className="p-2.5 group-hover/sidebar:p-4 border-t border-border/40 space-y-3 transition-all duration-300">
          <div className="flex items-center gap-3 px-1.5 group-hover/sidebar:px-2 overflow-hidden transition-all duration-300">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-white font-bold text-xs border border-violet-500/10 select-none overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} className="h-full w-full object-cover" alt={user.name || "User"} referrerPolicy="no-referrer" />
              ) : (
                getInitials(user?.name || "Demo User")
              )}
            </div>
            <div className="min-w-0 flex-1 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              <p className="text-xs font-semibold text-foreground truncate leading-none mb-1">
                {user?.name}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground truncate leading-none">
                {user?.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-8 px-2 justify-start gap-3 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-xl cursor-pointer overflow-hidden transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-xs font-semibold">
              {t("db_nav_logout")}
            </span>
          </Button>
        </div>
      </aside>

      {/* ─── Main Content Shell ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative lg:pl-16">
        {/* Header bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/15 px-4 sm:px-6 lg:px-8 select-none z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg border border-border bg-transparent hover:bg-accent/40 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Menu className="h-4.5 w-4.5" />
              <span className="sr-only">Toggle navigation</span>
            </Button>

            {/* Breadcrumbs (Desktop) */}
            <nav className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {getBreadcrumbs().map((bc, idx, arr) => (
                <React.Fragment key={idx}>
                  {bc.href ? (
                    <Link href={bc.href} className="hover:text-foreground transition-colors">
                      {bc.label}
                    </Link>
                  ) : (
                    <span className={bc.active ? "text-foreground font-bold" : ""}>{bc.label}</span>
                  )}
                  {idx < arr.length - 1 && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Topbar actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher align="end" />
            <ThemeToggle />
            
            {/* Notifications Dropdown */}
            <DropdownMenu onOpenChange={handleOpenChange}>
              <DropdownMenuTrigger
                className="w-8 h-8 border border-border rounded-lg bg-transparent hover:bg-accent/40 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center relative focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label={t("db_notif_header_title")}
              >
                <Bell className="h-4 w-4" />
                {hasUnread && notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[360px] sm:w-[400px] p-0 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xl overflow-hidden focus:outline-none z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-muted/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{t("db_notif_header_title")}</span>
                    {notifications.some(n => !n.read) && (
                      <span className="px-1.5 py-0.5 rounded-full bg-violet-600/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold">
                        {notifications.filter(n => !n.read).length} {t("db_notif_new")}
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors flex items-center gap-1 outline-none cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        {t("db_notif_mark_read")}
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-[11px] font-semibold text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 outline-none cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                        {t("db_notif_clear")}
                      </button>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-border/60">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      const IconComponent = notif.icon
                      return (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
                          }}
                          className={`w-full text-left flex items-start gap-3 p-4 hover:bg-accent/30 transition-colors cursor-pointer relative focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                            !notif.read ? "bg-violet-600/[0.015]" : ""
                          }`}
                        >
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notif.iconBg} ${notif.iconColor} border border-current/10`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-0.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs sm:text-[13px] font-semibold text-foreground truncate ${!notif.read ? "font-bold" : ""}`}>
                                {t(notif.title as TranslationKey) || notif.title}
                              </p>
                              {!notif.read && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-muted-foreground leading-normal line-clamp-2">
                              {t(notif.description as TranslationKey) || notif.description}
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 font-medium">
                              {t(notif.time as TranslationKey) || notif.time}
                            </p>
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center text-center p-8 space-y-3 select-none">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 border border-border/60 text-muted-foreground/60">
                        <BellOff className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">{t("db_notif_empty_title")}</p>
                        <p className="text-[11px] text-muted-foreground max-w-[240px] leading-normal">
                          {t("db_notif_empty_desc")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>


            {/* User Avatar badge */}
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7c3aed] text-white font-bold text-xs select-none overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} className="h-full w-full object-cover" alt={user.name || "User"} referrerPolicy="no-referrer" />
              ) : (
                getInitials(user?.name || "Demo User")
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full relative">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* ─── Mobile Sidebar Navigation Drawer ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            />

            {/* Sidebar popup container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border p-5 flex flex-col justify-between shadow-2xl lg:hidden"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="AdCraft AI Logo"
                      width={48}
                      height={48}
                      className="h-12 w-auto object-contain shrink-0"
                    />
                    <span className="font-display text-lg font-bold">
                      AdCraft<span className="text-[#7c3aed]">AI</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-lg border border-border"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Navigation list */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-[#7c3aed]/10 text-[#7c3aed] border border-[#7c3aed]/10 font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent font-medium"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              {/* Drawer footer profile */}
              <div className="border-t border-border/40 pt-4 space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 dark:text-violet-400 font-bold text-sm border border-violet-500/10 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} className="h-full w-full object-cover" alt={user.name || "User"} referrerPolicy="no-referrer" />
                    ) : (
                      getInitials(user?.name || "Demo User")
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate leading-none mb-1">
                      {user?.name}
                    </p>
                    <p className="text-[11px] font-medium text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full justify-start text-xs font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-xl h-9 px-3 gap-2.5 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  {t("db_nav_logout")}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>
    </ToastProvider>
  )
}
