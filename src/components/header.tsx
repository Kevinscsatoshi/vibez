"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/search-bar";
import { UserNav } from "@/components/user-nav";
import type { Project } from "@/types/database";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n";

export function Header({ projects }: { projects: Project[] }) {
  const { t, language, setLanguage, theme, setTheme } = useUiPreferences();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <Image
            src="/logo.svg"
            alt="vibeZ"
            width={32}
            height={32}
            className="brand-logo"
          />
          <span>vibe<span className="font-black">Z</span></span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3 md:gap-4">
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link href="/" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.discover")}
            </Link>
            <Link href="/create" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.publish")}
            </Link>
            <Link href="/playground" className="font-bitcount text-muted hover:text-foreground transition-colors">
              {t("nav.playground")}
            </Link>
          </nav>
          <select
            aria-label={t("ui.language")}
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="hidden md:inline-flex h-8 rounded-md border border-border bg-surface px-2 text-xs text-muted"
          >
            {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            aria-label={t("ui.theme")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex h-8 items-center justify-center rounded-md border border-border bg-surface px-2 text-xs text-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? t("ui.light") : t("ui.dark")}
          </button>
          <SearchBar projects={projects} variant="header" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
