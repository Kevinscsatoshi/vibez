"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/types/database";
import { filterProjectsByQuery } from "@/lib/search-projects";
import { useUiPreferences } from "@/components/providers/ui-preferences-provider";

interface SearchBarProps {
  projects: Project[];
  /** Header: compact width, dropdown right-aligned */
  variant?: "default" | "header";
}

export function SearchBar({ projects, variant = "default" }: SearchBarProps) {
  const router = useRouter();
  const { t } = useUiPreferences();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered =
    query.trim().length > 0 ? filterProjectsByQuery(projects, query) : [];
  const results = filtered.slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const pick = results[selectedIndex];
      if (pick) {
        router.push(`/project/${pick.id}`);
        setIsOpen(false);
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    }
  };

  const isHeader = variant === "header";
  const panelClass = isHeader
    ? "absolute top-full right-0 mt-1 w-[min(22rem,calc(100vw-2rem))] z-50"
    : "absolute top-full left-0 right-0 mt-1 z-50";

  return (
    <div
      ref={containerRef}
      className={
        isHeader
          ? "relative w-32 sm:w-40 md:w-48 lg:w-52 xl:w-56 shrink-0"
          : "relative w-full max-w-xl mx-auto"
      }
    >
      <div className="relative flex items-center bg-surface border border-border rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 focus-within:border-muted focus-within:shadow-[0_0_0_1px_rgba(55,53,47,0.09)] transition-shadow">
          <svg
            className="h-4 w-4 text-muted shrink-0 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder={
              isHeader ? t("search.placeholder") : t("search.placeholder")
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted/60"
          />
        </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className={`${panelClass} bg-surface border border-border rounded-md shadow-[0_4px_12px_rgba(15,15,15,0.08)] overflow-hidden animate-dropdown-in`}
        >
          {results.map((project, i) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 transition-colors ${
                i === selectedIndex
                  ? "bg-tag-bg"
                  : "hover:bg-tag-bg/50"
              } ${i > 0 ? "border-t border-border/50" : ""}`}
            >
              <div className="flex items-center gap-3">
                {project.author && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.author.avatar_url}
                    alt=""
                    className="h-8 w-8 rounded-full shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-medium truncate">{project.title}</h4>
                  <p className="text-xs text-muted truncate">{project.one_liner}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5 ml-11">
                {project.stack_tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-tag-bg text-tag-text px-1.5 py-0.5 text-[10px] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          {filtered.length > 8 && (
            <div className="border-t border-border/80 bg-tag-bg/50 px-4 py-2.5 text-center">
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => setIsOpen(false)}
                className="text-xs font-medium text-accent hover:underline underline-offset-2"
              >
                {t("search.viewAll", { count: filtered.length })}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* No results */}
      {isOpen && query.trim().length > 0 && filtered.length === 0 && (
        <div
          className={`${panelClass} bg-surface border border-border rounded-md shadow-[0_4px_12px_rgba(15,15,15,0.08)] p-6 text-center animate-dropdown-in`}
        >
          <p className="text-sm text-muted">
            {t("search.noResults", { query })}
          </p>
        </div>
      )}
    </div>
  );
}
