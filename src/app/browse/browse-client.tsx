"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import type { Project } from "@/types/database";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const CODING_OPTIONS = [
  { value: "", label: "Any coding" },
  { value: "none", label: "No code" },
  { value: "minimal", label: "Minimal code" },
  { value: "moderate", label: "Some code" },
  { value: "heavy", label: "Code-heavy" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "landing-page", label: "Landing Pages" },
  { value: "automation", label: "Automations" },
  { value: "internal-tool", label: "Internal Tools" },
  { value: "content", label: "Content Creation" },
  { value: "data-tool", label: "Data & Analytics" },
  { value: "chatbot", label: "Chatbots" },
  { value: "mobile-app", label: "Mobile Apps" },
  { value: "chrome-ext", label: "Chrome Extensions" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "most-completed", label: "Most completed" },
];

export function BrowseClient({ recipes }: { recipes: Project[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialPersona = searchParams.get("persona") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  const [difficulty, setDifficulty] = useState("");
  const [coding, setCoding] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("popular");
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    let result = [...recipes];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.one_liner.toLowerCase().includes(q) ||
          r.stack_tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Persona filter
    if (initialPersona) {
      result = result.filter(
        (r) =>
          r.who_is_this_for.includes(initialPersona) ||
          r.who_is_this_for.includes("anyone") ||
          r.who_is_this_for.length === 0
      );
    }

    // Difficulty filter
    if (difficulty) {
      result = result.filter((r) => r.difficulty === difficulty);
    }

    // Coding filter
    if (coding) {
      result = result.filter((r) => r.coding_required === coding);
    }

    // Category filter
    if (category) {
      result = result.filter((r) => r.category === category);
    }

    // Sort
    switch (sort) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "most-completed":
        result.sort((a, b) => b.completion_count - a.completion_count);
        break;
      case "popular":
      default:
        result.sort(
          (a, b) =>
            b.completion_count + b.save_count + b.view_count -
            (a.completion_count + a.save_count + a.view_count)
        );
        break;
    }

    return result;
  }, [recipes, query, initialPersona, difficulty, coding, category, sort]);

  const selectClass =
    "h-9 rounded-lg border border-border bg-surface px-2.5 text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          {initialPersona
            ? `Recipes for ${initialPersona}s`
            : "Browse Recipes"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Find step-by-step recipes to build with AI. Use filters to narrow down.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1 min-w-[200px] h-9 rounded-lg border border-border bg-surface px-3 text-sm focus:outline-none focus:border-foreground/30 transition-colors"
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
          {DIFFICULTY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={coding} onChange={(e) => setCoding(e.target.value)} className={selectClass}>
          {CODING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} project={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-muted mb-2">No recipes match your filters.</p>
          <p className="text-xs text-muted">Try different keywords or fewer filters.</p>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-muted">
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}
