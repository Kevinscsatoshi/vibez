"use client";

import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/search-bar";
import { UserNav } from "@/components/user-nav";
import type { Project } from "@/types/database";

export function Header({ projects }: { projects: Project[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight">
          <Image
            src="/logo.svg"
            alt="vibeZ"
            width={32}
            height={32}
          />
          <span>vibe<span className="font-black">Z</span></span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <nav className="hidden items-center gap-4 text-sm sm:flex">
            <Link href="/" className="text-muted hover:text-foreground transition-colors">
              Discover
            </Link>
            <Link href="/create" className="text-muted hover:text-foreground transition-colors">
              Publish
            </Link>
            <Link href="/playground" className="text-muted hover:text-foreground transition-colors">
              Playground
            </Link>
          </nav>
          <SearchBar projects={projects} variant="header" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
