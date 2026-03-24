import { notFound } from "next/navigation";
import { getAuthorById, getProjectsByAuthor } from "@/lib/sample-data";
import { ProjectCard } from "@/components/project-card";
import { Metadata } from "next";

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

export default async function ProfilePage({ params }: { params: Params }) {
  const { id } = await params;
  const author = getAuthorById(id);
  if (!author) notFound();

  const projects = getProjectsByAuthor(id);
  const totalForks = projects.reduce((sum, p) => sum + p.fork_count, 0);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="flex items-start gap-5 mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar_url}
          alt={author.display_name}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">{author.display_name}</h1>
          <a
            href={author.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            @{author.github_username}
          </a>
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
    </div>
  );
}
