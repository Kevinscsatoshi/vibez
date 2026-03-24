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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Profile</h1>
        <p className="text-sm text-muted mb-8">
          Update your builder profile details.
        </p>
        <ProfileForm profile={profile as Profile} />
      </div>

      <section className="mt-12">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
          Liked Projects
        </h2>
        {likedProjects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {likedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} liked />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            You haven&apos;t liked any projects yet.
          </p>
        )}
      </section>
    </div>
  );
}
