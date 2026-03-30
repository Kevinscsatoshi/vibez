"use client";

import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, Translate } from "@phosphor-icons/react";
import { SearchBar } from "@/components/search-bar";
import { UserNav } from "@/components/user-nav";
import type { Project } from "@/types/database";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n";

export function Header({ projects }: { projects: Project[] }) {
  const { t, language, setLanguage, theme, setTheme } = useUiPreferences();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-foreground/[0.06]">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-3 px-3 sm:px-4 lg:px-6">
        {/* Logo with gradient glow */}
        <Link href="/" className="logo-glow flex shrink-0 items-center gap-2 text-[20px] font-bold tracking-tight">
          <Image
            src="/logo.svg"
            alt="VibeZ"
            width={28}
            height={28}
            className="brand-logo"
          />
          <span className="text-foreground">Vibe<span className="font-black">Z</span></span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* Navigation */}
          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/browse" className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground/90 transition-colors rounded-lg hover:bg-foreground/[0.05]">
              {t("nav.browse")}
            </Link>
            <Link href="/create" className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground/90 transition-colors rounded-lg hover:bg-foreground/[0.05]">
              {t("nav.create")}
            </Link>
            <Link href="/workspace" className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground/90 transition-colors rounded-lg hover:bg-foreground/[0.05]">
              {t("nav.workspace")}
            </Link>
            <Link href="/playground" className="px-3 py-1.5 text-sm text-foreground/50 hover:text-foreground/90 transition-colors rounded-lg hover:bg-foreground/[0.05]">
              {t("nav.playground")}
            </Link>
          </nav>

          {/* Language selector — compact */}
          <div className="hidden md:inline-flex items-center relative">
            <Translate className="absolute left-2.5 h-3.5 w-3.5 text-foreground/30 pointer-events-none" weight="bold" />
            <select
              aria-label={t("ui.language")}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-8 rounded-lg border border-foreground/[0.08] bg-transparent pl-7 pr-3 text-xs text-foreground/50 appearance-none cursor-pointer hover:text-foreground/80 hover:border-foreground/15 transition-colors"
            >
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label={t("ui.theme")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground/40 hover:text-foreground/80 hover:bg-foreground/[0.05] transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" weight="bold" /> : <Moon className="h-4 w-4" weight="bold" />}
          </button>

          <SearchBar projects={projects} variant="header" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
