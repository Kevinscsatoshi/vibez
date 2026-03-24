import { notFound } from "next/navigation";
import Link from "next/link";
import { getAuthorById, getProjectsByAuthor } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase-server";
import { ProjectCard } from "@/components/project-card";
import { Metadata } from "next";
import type { Profile, Project } from "@/types/database";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const author = getAuthorById(id);
  if (!author) return {};
  return {
    title: `${author.display_name} — vibeZ`,
    description: author.bio || `Projects by ${author.display_name}`,
  };
}

async function getProfileData(id: string) {
  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (profile) {
      const { data: projects } = await supabase
        .from("projects")
        .select("*, author:profiles(*)")
        .eq("author_id", id)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      // Get liked projects
      const { data: likedProjects } = await supabase
        .from("project_likes")
        .select("project_id, projects:project_id(*, author:profiles(*))")
        .eq("user_id", id);

      const normalizedLikedProjects = (likedProjects ?? [])
        .map((row) => {
          const linked = (row as Record<string, unknown>).projects;
          if (Array.isArray(linked)) {
            return (linked[0] as Project | undefined) ?? null;
          }
          return (linked as Project | null) ?? null;
        })
        .filter(Boolean) as Project[];

      return {
        author: profile as Profile,
        projects: (projects || []) as Project[],
        likedProjects: normalizedLikedProjects,
        source: "supabase" as const,
      };
    }
  } catch {
    // Fall through to sample data
  }

  // Fallback to sample data
  const author = getAuthorById(id);
  if (!author) return null;
  const projects = getProjectsByAuthor(id);
  return { author, projects, likedProjects: [], source: "sample" as const };
}

export default async function ProfilePage({ params }: { params: Params }) {
  const { id } = await params;
  const data = await getProfileData(id);
  if (!data) notFound();

  const { author, projects, likedProjects } = data;
  const totalForks = projects.reduce((sum, p) => sum + p.fork_count, 0);

  // Check if the viewer is the profile owner
  let isOwner = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isOwner = user?.id === id;
  } catch {
    // not logged in
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="flex items-start gap-5 mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar_url || "https://api.dicebear.com/9.x/notionists/svg?seed=default&backgroundColor=b6e3f4"}
          alt={author.display_name}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{author.display_name}</h1>
            {isOwner && (
              <Link
                href="/profile/me"
                className="text-xs text-muted border border-border px-2 py-0.5 rounded-full hover:border-foreground/30 transition-colors"
              >
                Edit Profile
              </Link>
            )}
          </div>
          {author.github_username && author.github_url && (
            <a
              href={author.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              @{author.github_username}
            </a>
          )}
          {author.bio && (
            <p className="mt-2 text-sm text-muted max-w-md">{author.bio}</p>
          )}
          <div className="mt-3 flex gap-4 text-xs text-muted">
            <span>
              <span className="font-semibold text-foreground">{projects.length}</span>{" "}
              projects
            </span>
            <span>
              <span className="font-semibold text-foreground">{totalForks}</span>{" "}
              forks received
            </span>
            <span>
              Joined{" "}
              {new Date(author.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Projects */}
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
        Projects
      </h2>
      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">No projects published yet.</p>
      )}

      {/* Liked Projects */}
      {likedProjects.length > 0 && (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4 mt-12">
            Liked Projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {likedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} liked />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
