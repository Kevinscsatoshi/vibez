import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "./profile-form";
import { DeleteProjectButton } from "./delete-project-button";
import type { Profile, Project } from "@/types/database";
import { RecipeCard } from "@/components/recipe-card";

export const metadata: Metadata = {
  title: "Edit Profile — VibeZ",
};

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin?next=/profile/me");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  // Saved recipes (replaces liked projects)
  const { data: savedRows } = await supabase
    .from("recipe_saves")
    .select("recipe_id")
    .eq("user_id", user.id);

  let savedRecipes: Project[] = [];
  if (savedRows && savedRows.length > 0) {
    const ids = savedRows.map((s) => s.recipe_id);
    const { data } = await supabase
      .from("projects")
      .select("*, author:profiles(*)")
      .in("id", ids)
      .eq("status", "published");
    if (data) savedRecipes = data as Project[];
  }

  const { data: ownProjectsRows } = await supabase
    .from("projects")
    .select("*, author:profiles(*)")
    .eq("author_id", user.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const ownRecipes = ((ownProjectsRows ?? []).filter(Boolean) as Project[]).filter(
    (project) => project.status === "published"
  );

  const totalCompletions = ownRecipes.reduce((sum, p) => sum + (p.completion_count ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Profile</h1>
          <p className="text-sm text-muted">Update your profile details.</p>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Saved</p>
            <p className="mt-1 text-xl font-semibold">{savedRecipes.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Completions</p>
            <p className="mt-1 text-xl font-semibold">{totalCompletions}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Published</p>
            <p className="mt-1 text-xl font-semibold">{ownRecipes.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <ProfileForm profile={profile as Profile} />
        </div>
      </div>

      <div className="mt-12 space-y-10">
        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide">My Recipes</h2>
              <p className="text-xs text-muted mt-1">
                Recipes you have published.
              </p>
            </div>
            <span className="rounded-full border border-border bg-tag-bg px-2.5 py-1 text-xs text-muted">
              {ownRecipes.length}
            </span>
          </div>
          {ownRecipes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ownRecipes.map((project) => (
                <div key={project.id}>
                  <RecipeCard project={project} />
                  <DeleteProjectButton projectId={project.id} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-tag-bg/40 p-6 text-center">
              <p className="text-sm text-muted">
                You haven&apos;t shared any recipes yet.
              </p>
              <Link href="/create" className="mt-2 inline-block text-xs text-accent underline">
                Share your first recipe
              </Link>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide">Saved Recipes</h2>
              <p className="text-xs text-muted mt-1">
                Recipes you saved to try later.
              </p>
            </div>
            <span className="rounded-full border border-border bg-tag-bg px-2.5 py-1 text-xs text-muted">
              {savedRecipes.length}
            </span>
          </div>
          {savedRecipes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedRecipes.map((project) => (
                <RecipeCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-tag-bg/40 p-6 text-center">
              <p className="text-sm text-muted">
                You haven&apos;t saved any recipes yet.
              </p>
              <Link href="/browse" className="mt-2 inline-block text-xs text-accent underline">
                Browse recipes
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
