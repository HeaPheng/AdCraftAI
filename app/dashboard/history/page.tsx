"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Calendar, Trash2, Copy, FileText, LayoutGrid, Eye, HelpCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { Modal } from "@/components/ui/modal"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { ResultsDashboard } from "@/components/marketing/results-dashboard"
import type { GenerationHistoryItem } from "@/services/history"
import type { TranslationKey } from "@/lib/translations"

export default function GenerationHistoryPage() {
  return (
    <ToastProvider>
      <HistoryList />
    </ToastProvider>
  )
}

function HistoryList() {
  const router = useRouter()
  const { history, deleteHistoryItem, setPreloadedFormData } = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedItem, setSelectedItem] = React.useState<GenerationHistoryItem | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)

  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  // Keyboard shortcut listener to focus search with '/' key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search input on '/' key if not active in another input/textarea
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        history.length > 0
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [history])

  // Filter history based on search query
  const filteredHistory = React.useMemo(() => {
    return history.filter((item) => {
      const matchName = item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory = item.formData?.productCategory?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchTone = item.formData?.writingTone?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchName || matchCategory || matchTone
    })
  }, [history, searchQuery])

  const handleOpenViewModal = (item: GenerationHistoryItem) => {
    setSelectedItem(item)
    setIsViewModalOpen(true)
  }

  const handleDuplicate = (item: GenerationHistoryItem) => {
    setPreloadedFormData(item.formData)
    toast(t("db_history_duplicate_toast"), "success")
    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  const confirmDelete = (id: string) => {
    setItemToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = () => {
    if (itemToDelete) {
      deleteHistoryItem(itemToDelete)
      toast(t("db_history_delete_toast"), "success")
      setIsDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          {t("db_history_title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("db_history_subtitle")}
        </p>
      </div>

      {/* Filter and Search Bar */}
      {history.length > 0 && (
        <div className="relative max-w-md flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/60">
            <Search className="h-4 w-4" />
          </div>
          <Input
            ref={searchInputRef}
            placeholder={t("db_history_search_placeholder")}
            className="pl-9 pr-10 h-10 rounded-xl bg-card/40 border-border/85 focus-visible:ring-2 focus-visible:ring-violet-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {!isFocused && !searchQuery && (
            <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-border/40 bg-muted/40 text-[9px] font-medium text-muted-foreground uppercase select-none pointer-events-none">
              /
            </kbd>
          )}
        </div>
      )}

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={LayoutGrid}
            title={t("db_history_empty_title")}
            description={t("db_history_empty_desc")}
            actionLabel={t("db_nav_generator")}
            onAction={() => router.push("/dashboard")}
          />
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={Search}
            title={t("db_history_no_results_title")}
            description={t("db_history_no_results_desc")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="p-5 border-border/70 bg-card/50 backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet-500/20 transition-colors duration-200"
            >
              {/* Item Info */}
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-foreground truncate max-w-[280px]">
                    {item.productName}
                  </h3>
                  <Badge variant="secondary" className="font-normal text-[10px] px-2 py-0.5 rounded-md shrink-0">
                    {item.formData?.productCategory}
                  </Badge>
                  <Badge variant="outline" className="font-normal text-[10px] px-2 py-0.5 rounded-md shrink-0 border-violet-500/20 text-violet-600 dark:text-violet-400">
                    {t("db_gen_form_tone_label")}: {t(`db_gen_tone_${item.formData?.writingTone?.toLowerCase()}_title` as TranslationKey) || item.formData?.writingTone}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                    <FileText className="h-3.5 w-3.5" />
                    {item.formData?.platforms?.length || 0} {t("db_history_card_platforms")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 md:justify-end">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleOpenViewModal(item)}
                  className="h-8 text-xs gap-1 hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("db_history_btn_view")}
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleDuplicate(item)}
                  className="h-8 text-xs gap-1 hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {t("db_history_btn_duplicate")}
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => confirmDelete(item.id)}
                  className="h-8 text-xs gap-1 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("db_history_btn_delete")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Read-Only Results Viewer Modal */}
      {selectedItem && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={setIsViewModalOpen}
          title={`${t("db_history_modal_title")}: ${selectedItem.productName}`}
          size="4xl"
        >
          <div className="max-h-[75vh] overflow-y-auto px-1 py-2 scrollbar-thin">
            <ResultsDashboard
              result={selectedItem.result}
              isGenerating={false}
              formData={selectedItem.formData}
              onUpdateResult={() => {}} // Read-only mode inside history details
              hideHeader={true}
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={setIsDeleteModalOpen}
        title={t("db_history_delete_title")}
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/[0.03] dark:bg-red-500/[0.015] border border-red-500/10">
            <HelpCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">{t("db_history_delete_subtitle")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("db_history_delete_desc")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-border text-muted-foreground hover:text-foreground h-9 rounded-xl cursor-pointer"
            >
              {t("common_cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold h-9 rounded-xl cursor-pointer"
            >
              {t("db_history_delete_confirm_btn")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
