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
    "h-9 rounded-full border border-foreground/[0.08] bg-surface/60 px-3 text-sm text-foreground/70 focus:outline-none focus:border-foreground/20 transition-colors";

  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6 py-8">
      {/* Header + Filters row */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {initialPersona
              ? `Recipes for ${initialPersona}s`
              : "Browse Recipes"}
          </h1>
          <p className="mt-0.5 text-sm text-foreground/40">
            {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1 min-w-[200px] h-9 rounded-full border border-foreground/[0.08] bg-surface/60 px-4 text-sm focus:outline-none focus:border-foreground/20 transition-colors"
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
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} project={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-foreground/40 mb-2">No recipes match your filters.</p>
          <p className="text-xs text-foreground/30">Try different keywords or fewer filters.</p>
        </div>
      )}
    </div>
  );
}
