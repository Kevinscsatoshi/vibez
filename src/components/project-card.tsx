import Link from "next/link";
import { Project } from "@/types/database";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="block border border-border bg-surface p-5 rounded-2xl hover:border-foreground/20 transition-colors"
    >
      <div className="mb-3">
        <h3 className="font-semibold text-base leading-snug">{project.title}</h3>
        <p className="mt-1 text-sm text-muted leading-relaxed">{project.one_liner}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.stack_tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
        {project.stack_tags.length > 4 && (
          <span className="text-xs text-muted">+{project.stack_tags.length - 4}</span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-muted">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
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
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {project.metrics.length > 0 && (
            <span className="text-success font-medium whitespace-nowrap">
              {project.metrics[0].value} {project.metrics[0].name.toLowerCase()}
            </span>
          )}
          {project.fork_count > 0 && (
            <span className="whitespace-nowrap">{project.fork_count} forks</span>
          )}
          {project.github_repo_url && (
            <span className="border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded-full whitespace-nowrap">
              GitHub
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
