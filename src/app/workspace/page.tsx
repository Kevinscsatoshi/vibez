import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import type { Project } from "@/types/database";
import { RecipeCard } from "@/components/recipe-card";

function normalizeProject(record: Record<string, unknown>): Project {
  return {
    ...(record as unknown as Project),
    prompts: (record.prompts as Project["prompts"]) ?? [],
    iterations: (record.iterations as Project["iterations"]) ?? [],
    metrics: (record.metrics as Project["metrics"]) ?? [],
    stack_tags: (record.stack_tags as string[]) ?? [],
    screenshots: (record.screenshots as string[]) ?? [],
    who_is_this_for: (record.who_is_this_for as string[]) ?? [],
    required_tools: (record.required_tools as Project["required_tools"]) ?? [],
    steps: (record.steps as Project["steps"]) ?? [],
    common_failures: (record.common_failures as Project["common_failures"]) ?? [],
    difficulty: (record.difficulty as Project["difficulty"]) ?? null,
    coding_required: (record.coding_required as Project["coding_required"]) ?? null,
    estimated_time: (record.estimated_time as string) ?? null,
    category: (record.category as string) ?? null,
    completion_count: (record.completion_count as number) ?? 0,
    save_count: (record.save_count as number) ?? 0,
    remix_count: (record.remix_count as number) ?? 0,
  };
}

async function getWorkspaceData(userId: string) {
  const supabase = await createClient();

  // Saved recipes
  const { data: savedData } = await supabase
    .from("recipe_saves")
    .select("recipe_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  let savedRecipes: Project[] = [];
  if (savedData && savedData.length > 0) {
    const ids = savedData.map((s) => s.recipe_id);
    const { data } = await supabase
      .from("projects")
      .select("*, author:profiles(*)")
      .in("id", ids)
      .eq("status", "published");
    if (data) {
      savedRecipes = data.map((r) => normalizeProject(r as Record<string, unknown>));
    }
  }

  // My recipes
  const { data: myData } = await supabase
    .from("projects")
    .select("*, author:profiles(*)")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  const myRecipes = (myData ?? []).map((r) => normalizeProject(r as Record<string, unknown>));

  // Completed recipes
  const { data: completionData } = await supabase
    .from("recipe_completions")
    .select("recipe_id, status, notes, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  let completedRecipes: Project[] = [];
  if (completionData && completionData.length > 0) {
    const ids = completionData.map((c) => c.recipe_id);
    const { data } = await supabase
      .from("projects")
      .select("*, author:profiles(*)")
      .in("id", ids)
      .eq("status", "published");
    if (data) {
      completedRecipes = data.map((r) => normalizeProject(r as Record<string, unknown>));
    }
  }

  return { savedRecipes, myRecipes, completedRecipes };
}

export default async function WorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/workspace");
  }

  const { savedRecipes, myRecipes, completedRecipes } = await getWorkspaceData(user.id);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-tight">Workspace</h1>
        <p className="mt-0.5 text-sm text-foreground/40">
          Your saved recipes, your builds, and your progress.
        </p>
      </div>

      {/* Saved Recipes */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Saved Recipes
        </h2>
        {savedRecipes.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {savedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} project={recipe} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/[0.08] p-8 text-center">
            <p className="text-sm text-foreground/40 mb-2">You haven&apos;t saved any recipes yet.</p>
            <p className="text-xs text-foreground/30 mb-4">Browse recipes and hit &apos;Save&apos; on anything you want to try later.</p>
            <Link
              href="/browse"
              className="inline-block bg-foreground text-background px-4 py-2 text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Browse Recipes
            </Link>
          </div>
        )}
      </section>

      {/* My Recipes */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          My Recipes
        </h2>
        {myRecipes.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} project={recipe} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/[0.08] p-8 text-center">
            <p className="text-sm text-foreground/40 mb-2">You haven&apos;t shared any recipes yet.</p>
            <p className="text-xs text-foreground/30 mb-4">Built something with AI? Share how you did it — step by step.</p>
            <Link
              href="/create"
              className="inline-block bg-foreground text-background px-4 py-2 text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Share a Recipe
            </Link>
          </div>
        )}
      </section>

      {/* Completed */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Completed
        </h2>
        {completedRecipes.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {completedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} project={recipe} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-foreground/[0.08] p-8 text-center">
            <p className="text-sm text-foreground/40 mb-2">You haven&apos;t completed any recipes yet.</p>
            <p className="text-xs text-foreground/30 mb-4">Follow a recipe, then come back and mark it as done to track your builds.</p>
            <Link
              href="/browse?difficulty=beginner"
              className="inline-block bg-foreground text-background px-4 py-2 text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Find a beginner recipe
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
