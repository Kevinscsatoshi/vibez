import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ProfileForm } from "./profile-form";
import type { Profile, Project } from "@/types/database";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Edit Profile — vibeZ",
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

  const { data: likedProjectsRows } = await supabase
    .from("project_likes")
    .select("projects:project_id(*, author:profiles(*))")
    .eq("user_id", user.id);

  const { data: ownProjectsRows } = await supabase
    .from("projects")
    .select("*, author:profiles(*)")
    .eq("author_id", user.id)
    .eq("status", "published")
    .order("like_count", { ascending: false });

  const likedProjects = (
    likedProjectsRows
      ?.map((row) => {
        const linked = (row as Record<string, unknown>).projects;
        if (Array.isArray(linked)) {
          return (linked[0] as Project | undefined) ?? null;
        }
        return (linked as Project | null) ?? null;
      })
      .filter(Boolean) ?? []
  ) as Project[];

  const ownProjects = ((ownProjectsRows ?? []).filter(Boolean) as Project[]).filter(
    (project) => project.status === "published"
  );
  const favoritedProjects = ownProjects.filter((project) => (project.like_count ?? 0) > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Profile</h1>
          <p className="text-sm text-muted">Update your builder profile details.</p>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Liked</p>
            <p className="mt-1 text-xl font-semibold">{likedProjects.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Favorited</p>
            <p className="mt-1 text-xl font-semibold">{favoritedProjects.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-wide text-muted">Published</p>
            <p className="mt-1 text-xl font-semibold">{ownProjects.length}</p>
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
              <h2 className="text-sm font-semibold tracking-wide">Liked Projects</h2>
              <p className="text-xs text-muted mt-1">
                Projects you personally liked or bookmarked.
              </p>
            </div>
            <span className="rounded-full border border-border bg-tag-bg px-2.5 py-1 text-xs text-muted">
              {likedProjects.length}
            </span>
          </div>
          {likedProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {likedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} liked />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-tag-bg/40 p-6 text-center">
              <p className="text-sm text-muted">
                You haven&apos;t liked any projects yet.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold tracking-wide">Favorited Projects</h2>
              <p className="text-xs text-muted mt-1">
                Your published projects that other users have liked.
              </p>
            </div>
            <span className="rounded-full border border-border bg-tag-bg px-2.5 py-1 text-xs text-muted">
              {favoritedProjects.length}
            </span>
          </div>
          {favoritedProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoritedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-tag-bg/40 p-6 text-center">
              <p className="text-sm text-muted">
                No favorites yet on your published projects.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
