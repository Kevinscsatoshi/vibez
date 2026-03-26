import Link from "next/link";
import { Project } from "@/types/database";

interface RecipeCardProps {
  project: Project;
  showPreview?: boolean;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const CODING_LABELS: Record<string, string> = {
  none: "No code",
  minimal: "Minimal code",
  moderate: "Some code",
  heavy: "Code-heavy",
};

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

export function RecipeCard({ project, showPreview = false }: RecipeCardProps) {
  const screenshot = project.screenshots[0] ?? null;
  const videoThumb = getVideoThumbnail(project.video_url);
  const previewImage = screenshot ?? videoThumb;
  const difficulty = project.difficulty;
  const codingReq = project.coding_required;

  return (
    <div className="group relative border border-border bg-surface rounded-xl hover:border-foreground/20 transition-colors">
      <Link
        href={`/project/${project.id}`}
        className="absolute inset-0 z-0"
        aria-label={project.title}
      />
      <div className="relative z-10 pointer-events-none p-4">
        {showPreview && previewImage && (
          <div className="mb-3 -mx-4 -mt-4">
            <div className="relative overflow-hidden rounded-t-xl border-b border-border bg-tag-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage}
                alt={`${project.title} preview`}
                className="h-40 w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Trust signal badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {difficulty && (
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${DIFFICULTY_STYLES[difficulty] ?? "bg-tag-bg text-tag-text"}`}>
              {DIFFICULTY_LABELS[difficulty] ?? difficulty}
            </span>
          )}
          {project.estimated_time && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-tag-bg text-tag-text">
              {project.estimated_time}
            </span>
          )}
          {codingReq && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-tag-bg text-tag-text">
              {CODING_LABELS[codingReq] ?? codingReq}
            </span>
          )}
        </div>

        {/* Title and one-liner */}
        <div className="mb-3">
          <h3 className="font-semibold text-base leading-snug">{project.title}</h3>
          <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-2">{project.one_liner}</p>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.stack_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.stack_tags.length > 3 && (
            <span className="text-xs text-muted">+{project.stack_tags.length - 3}</span>
          )}
        </div>

        {/* Footer: author + completion count */}
        <div className="flex items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2 min-w-0">
            {project.author && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.author.avatar_url}
                  alt={project.author.display_name}
                  className="h-5 w-5 rounded-full shrink-0"
                />
                <span className="truncate">{project.author.display_name}</span>
              </>
            )}
          </div>
          {project.completion_count > 0 && (
            <span className="text-success font-medium whitespace-nowrap">
              {project.completion_count} tried this
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
