"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          vibe<span className="font-black">Z</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6 text-sm">
          <Link href="/" className="hidden sm:block text-muted hover:text-foreground transition-colors">
            Discover
          </Link>
          <Link href="/create" className="hidden sm:block text-muted hover:text-foreground transition-colors">
            Publish
          </Link>
          <Link
            href="/signin"
            className="bg-foreground text-background px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap rounded-full"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
