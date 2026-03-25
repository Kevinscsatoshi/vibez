import { RecipeCard } from "@/components/recipe-card";
import { getAllProjects } from "@/lib/sample-data";
import { filterProjectsByQuery } from "@/lib/search-projects";
import Link from "next/link";
import type { Metadata } from "next";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const title = query
    ? `Search: ${query} — VibeZ`
    : "Search recipes — VibeZ";
  return { title, description: "Search recipes, tools, and builders on VibeZ." };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q ?? "";
  const all = getAllProjects();
  const filtered = filterProjectsByQuery(all, query);
  const trimmed = query.trim();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Search
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {trimmed ? (
            <>
              Results for{" "}
              <span className="text-accent">&ldquo;{trimmed}&rdquo;</span>
            </>
          ) : (
            "Search recipes"
          )}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Use keywords or multiple words (all must match).{" "}
          <Link href="/" className="text-accent underline underline-offset-2 hover:opacity-90">
            Back to home
          </Link>
        </p>
      </div>

      {trimmed && filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-surface px-8 py-16 text-center">
          <p className="text-muted">
            No recipes match your search. Try different keywords or browse by category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(trimmed ? filtered : all).map((project) => (
            <RecipeCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
