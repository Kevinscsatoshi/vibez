"use client";

import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <Image
            src="/logo.svg"
            alt="vibeZ"
            width={32}
            height={32}
          />
          <span>vibe<span className="font-black">Z</span></span>
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
