"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  align?: "start" | "end" | "center";
}

export function LanguageSwitcher({ align = "end" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="h-8 px-2.5 rounded-lg border border-border hover:bg-accent/40 flex items-center gap-1.5 cursor-pointer relative group transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring text-xs font-medium text-muted-foreground hover:text-foreground"
        aria-label="Switch Language"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
        <span>{language === "km" ? "ខ្មែរ" : "English"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="bg-popover/80 backdrop-blur-md border border-border shadow-lg min-w-[8rem] rounded-xl p-1"
      >
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className="gap-2 cursor-pointer focus:bg-accent/60 justify-between"
        >
          <span className="flex items-center gap-1.5">
            <span role="img" aria-label="English">🇺🇸</span> English
          </span>
          {language === "en" && <Check className="h-3.5 w-3.5 text-violet-500" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("km")}
          className="gap-2 cursor-pointer focus:bg-accent/60 justify-between"
        >
          <span className="flex items-center gap-1.5">
            <span role="img" aria-label="Khmer">🇰🇭</span> ខ្មែរ
          </span>
          {language === "km" && <Check className="h-3.5 w-3.5 text-violet-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
