"use client";

import Link from "next/link";
import Image from "next/image";
import { Sun, Moon, GearSix, Translate } from "@phosphor-icons/react";
import { SearchBar } from "@/components/search-bar";
import { UserNav } from "@/components/user-nav";
import type { Project } from "@/types/database";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n";

export function Header({ projects }: { projects: Project[] }) {
  const { t, language, setLanguage, theme, setTheme } = useUiPreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[20px] font-bold tracking-tight">
          <Image
            src="/logo.svg"
            alt="VibeZ"
            width={32}
            height={32}
            className="brand-logo"
          />
          <span>Vibe<span className="font-black">Z</span></span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 md:gap-4">
          <nav className="hidden items-center gap-5 text-[18px] sm:flex">
            <Link href="/browse" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.browse")}
            </Link>
            <Link href="/create" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.create")}
            </Link>
            <Link href="/workspace" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.workspace")}
            </Link>
            <Link href="/playground" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.playground")}
            </Link>
          </nav>
          <div className="hidden md:inline-flex items-center relative">
            <Translate className="absolute left-2.5 h-4 w-4 text-muted pointer-events-none" weight="bold" />
            <select
              aria-label={t("ui.language")}
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-9 rounded-md border border-border bg-surface pl-8 pr-3 text-[14px] text-muted appearance-none cursor-pointer hover:border-foreground/20 transition-colors"
            >
              {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            aria-label={t("ui.theme")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4.5 w-4.5" weight="bold" /> : <Moon className="h-4.5 w-4.5" weight="bold" />}
          </button>
          <Link
            href="/profile/me"
            aria-label="Settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted hover:text-foreground hover:border-foreground/20 transition-colors"
          >
            <GearSix className="h-4.5 w-4.5" weight="bold" />
          </Link>
          <SearchBar projects={projects} variant="header" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
