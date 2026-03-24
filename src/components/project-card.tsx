import Link from "next/link";
import { Project } from "@/types/database";
import { LikeButton } from "@/components/like-button";

interface ProjectCardProps {
  project: Project;
  liked?: boolean;
}

function getVideoThumbnail(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (parsed.hostname.includes("loom.com")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const id = parts[parts.length - 1];
      return id ? `https://cdn.loom.com/sessions/thumbnails/${id}-with-play.jpg` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function ProjectCard({ project, liked = false }: ProjectCardProps) {
  const screenshot = project.screenshots[0] ?? null;
  const videoThumb = getVideoThumbnail(project.video_url);
  const previewImage = screenshot ?? videoThumb;

  return (
    <div className="group relative border border-border bg-surface p-4 rounded-md hover:bg-tag-bg/80 transition-colors">
      <Link
        href={`/project/${project.id}`}
        className="absolute inset-0 z-0"
        aria-label={project.title}
      />
      <div className="relative z-10 pointer-events-none">
        <div className="mb-3">
          {previewImage ? (
            <div className="relative overflow-hidden rounded-md border border-border bg-tag-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt={`${project.title} preview`}
                className="h-40 w-full object-cover"
              />
              <span className="absolute right-2 top-2 rounded bg-black/65 px-1.5 py-0.5 text-[10px] text-white uppercase tracking-wide">
                {screenshot ? "Image" : "Video"}
              </span>
            </div>
          ) : (
            <div className="h-40 w-full rounded-md border border-dashed border-border bg-tag-bg/40 flex items-center justify-center">
              <span className="text-xs text-muted">No media preview</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <h3 className="font-semibold text-base leading-snug">{project.title}</h3>
          <p className="mt-1 text-sm text-muted leading-relaxed">{project.one_liner}</p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.stack_tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.stack_tags.length > 4 && (
            <span className="text-xs text-muted">+{project.stack_tags.length - 4}</span>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted overflow-hidden">
          {project.author && (
            <div className="flex items-center gap-2 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.author.avatar_url}
                alt={project.author.display_name}
                className="h-5 w-5 rounded-full shrink-0"
              />
              <span className="truncate">{project.author.display_name}</span>
            </div>
          )}
          {project.metrics.length > 0 && (
            <span className="text-success font-medium truncate">
              {project.metrics[0].value} {project.metrics[0].name.toLowerCase()}
            </span>
          )}
          {project.fork_count > 0 && (
            <span className="whitespace-nowrap">{project.fork_count} forks</span>
          )}
          {project.github_repo_url && (
            <span className="border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded whitespace-nowrap">
              GitHub
            </span>
          )}
          {project.snippet_id && (
            <span className="border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded whitespace-nowrap">
              Playground
            </span>
          )}
          <div className="pointer-events-auto">
            <LikeButton
              projectId={project.id}
              initialLikeCount={project.like_count ?? 0}
              initialLiked={liked}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
