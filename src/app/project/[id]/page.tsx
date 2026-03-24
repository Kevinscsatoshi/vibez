import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/sample-data";
import { Section } from "@/components/section";
import { MarkdownBlock } from "@/components/markdown-block";
import { HighlightText } from "@/components/highlight-text";
import { LikeButton } from "@/components/like-button";
import { createClient } from "@/lib/supabase-server";
import { Metadata } from "next";
import type { Project, Snippet } from "@/types/database";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectData(id);
  if (!project) return {};
  return {
    title: `${project.title} — vibeZ`,
    description: project.one_liner,
  };
}

function parseProjectRecord(record: Record<string, unknown>): Project {
  return {
    ...(record as unknown as Project),
    prompts: (record.prompts as Project["prompts"]) ?? [],
    iterations: (record.iterations as Project["iterations"]) ?? [],
    metrics: (record.metrics as Project["metrics"]) ?? [],
    stack_tags: (record.stack_tags as string[]) ?? [],
    screenshots: (record.screenshots as string[]) ?? [],
  };
}

async function getProjectData(id: string): Promise<(Project & { _source?: "supabase" | "sample" }) | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, author:profiles(*)")
      .eq("id", id)
      .single();

    if (data) {
      const project = parseProjectRecord(data as Record<string, unknown>);

      if (project.forked_from) {
        const { data: parent } = await supabase
          .from("projects")
          .select("id, title, author:profiles(*)")
          .eq("id", project.forked_from)
          .single();
        project.parent_project = (parent as Project["parent_project"]) ?? null;
      }

      if (project.snippet_id) {
        const { data: snippet } = await supabase
          .from("snippets")
          .select("id, title, is_public, author_id")
          .eq("id", project.snippet_id)
          .single();
        project.snippet =
          (snippet as Pick<Snippet, "id" | "title" | "is_public" | "author_id">) ??
          null;
      }

      return { ...project, _source: "supabase" };
    }
  } catch {
    // fall through to sample data
  }

  const fallback = getProjectById(id);
  if (!fallback) return null;
  return { ...fallback, _source: "sample" };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const project = await getProjectData(id);
  if (!project) notFound();

  // Check if current user liked this project
  let userLiked = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("project_likes")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("project_id", id)
        .single();
      userLiked = !!data;
    }
  } catch {
    // not logged in or table doesn't exist yet
  }

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {project._source === "sample" && (
        <div className="mb-4 rounded-md border border-dashed border-border bg-tag-bg/70 px-3 py-2 text-xs text-muted">
          Showing sample fallback data. Connect Supabase project data to view live content.
        </div>
      )}
      {/* Header */}
      <header className="mb-8">
        {project.forked_from && project.parent_project && (
          <p className="text-xs text-muted mb-2">
            Forked from{" "}
            <Link
              href={`/project/${project.forked_from}`}
              className="text-accent underline"
            >
              {project.parent_project.title}
            </Link>
          </p>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
        <p className="mt-2 text-base text-muted">{project.one_liner}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted">
          {project.author && (
            <Link
              href={`/profile/${project.author_id}`}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.author.avatar_url}
                alt={project.author.display_name}
                className="h-6 w-6 rounded-full"
              />
              <span>{project.author.display_name}</span>
            </Link>
          )}
          <span>
            {new Date(project.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          {project.fork_count > 0 && <span>{project.fork_count} forks</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack_tags.map((tag) => (
            <span
              key={tag}
              className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {project.github_repo_url && (
            <span className="border border-border px-2 py-0.5 text-xs font-medium uppercase tracking-wide rounded-full">
              GitHub
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Link
            href={`/create?fork=${project.id}`}
            className="bg-foreground text-background px-4 py-1.5 text-sm font-medium hover:opacity-90 transition-opacity rounded-full"
          >
            Fork this project
          </Link>
          <LikeButton
            projectId={project.id}
            initialLikeCount={project.like_count ?? 0}
            initialLiked={userLiked}
            size="md"
          />
        </div>
      </header>

      {/* Overview */}
      <Section title="What I Built">
        <p className="text-sm leading-relaxed text-muted">
          <HighlightText text={project.what_i_built} />
        </p>
      </Section>

      <Section title="Why I Built It">
        <p className="text-sm leading-relaxed text-muted">
          <HighlightText text={project.why_i_built} />
        </p>
      </Section>

      {/* Prompts */}
      <Section title="Prompts">
        <div className="space-y-4">
          {project.prompts.map((block, i) => (
            <div key={i} className="border border-border p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                {block.label && (
                  <span className="text-xs font-medium text-muted">
                    {block.label}
                  </span>
                )}
                {block.model && (
                  <span className="text-xs text-muted bg-tag-bg px-2 py-0.5 rounded-full">
                    {block.model}
                  </span>
                )}
              </div>
              <div className="bg-[#1e1e1e] text-[#d4d4d4] p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap rounded-lg">
                {block.prompt}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Iterations */}
      <Section title="Iteration History">
        <div className="space-y-3">
          {project.iterations.map((iter, i) => (
            <div key={i} className="border-l-2 border-border pl-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                {iter.version}
              </span>
              <p className="text-sm mt-1 text-muted">
                <span className="font-medium text-foreground">Changed:</span>{" "}
                <HighlightText text={iter.what_changed} />
              </p>
              <p className="text-sm text-muted mt-0.5">
                <span className="font-medium text-foreground">Result:</span>{" "}
                <HighlightText text={iter.result} />
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Failures */}
      {project.failures && (
        <Section title="What Didn't Work">
          <p className="text-sm leading-relaxed text-muted">
            <HighlightText text={project.failures} />
          </p>
        </Section>
      )}

      {/* Output / Demo */}
      <Section title="Output / Demo">
        <div className="space-y-4">
          {/* Sandboxed HTML demo */}
          {project.demo_html_url && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-tag-bg px-3 py-1.5 text-xs font-medium text-muted border-b border-border">
                Live Demo
              </div>
              <iframe
                src={project.demo_html_url}
                sandbox="allow-scripts"
                className="w-full h-96"
                title="Project demo"
              />
            </div>
          )}

          {/* Video */}
          {project.video_url && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-tag-bg px-3 py-1.5 text-xs font-medium text-muted border-b border-border">
                Video Demo
              </div>
              {project.video_url.includes("youtube.com") ||
              project.video_url.includes("youtu.be") ? (
                <iframe
                  src={project.video_url.replace("watch?v=", "embed/")}
                  className="w-full aspect-video"
                  allowFullScreen
                  title="Video demo"
                />
              ) : project.video_url.includes("loom.com") ? (
                <iframe
                  src={project.video_url.replace(
                    "/share/",
                    "/embed/"
                  )}
                  className="w-full aspect-video"
                  allowFullScreen
                  title="Video demo"
                />
              ) : (
                <video
                  src={project.video_url}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}

          {/* Screenshots */}
          {project.screenshots.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {project.screenshots.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Screenshot ${i + 1}`}
                  className="border border-border w-full rounded-xl"
                />
              ))}
            </div>
          )}

          {/* Demo link */}
          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-border px-4 py-2 text-sm hover:border-foreground/30 transition-colors rounded-full"
            >
              View live product &rarr;
            </a>
          )}

          {project.snippet_id && (
            <Link
              href={`/playground/${project.snippet_id}`}
              className="inline-block border border-border px-4 py-2 text-sm hover:border-foreground/30 transition-colors rounded-full"
            >
              Open Playground{project.snippet?.title ? `: ${project.snippet.title}` : ""} &rarr;
            </Link>
          )}

          {!project.demo_html_url &&
            !project.video_url &&
            project.screenshots.length === 0 &&
            !project.demo_link && (
              <p className="text-sm text-muted">No demo available yet.</p>
            )}
        </div>
      </Section>

      {/* Metrics */}
      {project.metrics.length > 0 && (
        <Section title="Metrics / Traction">
          <div className="grid gap-3 sm:grid-cols-3">
            {project.metrics.map((metric, i) => (
              <div key={i} className="border border-border p-4 rounded-xl">
                <div className="text-lg font-bold">{metric.value}</div>
                <div className="text-xs text-muted mt-0.5">
                  {metric.name}
                  {metric.timeframe && ` \u2014 ${metric.timeframe}`}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Lessons */}
      {project.lessons && (
        <Section title="Lessons Learned">
          <p className="text-sm leading-relaxed text-muted">
            <HighlightText text={project.lessons} />
          </p>
        </Section>
      )}

      {/* README */}
      {project.github_readme && (
        <Section title="README">
          <div className="border border-border p-5 max-h-96 overflow-y-auto rounded-xl">
            <MarkdownBlock content={project.github_readme} />
          </div>
        </Section>
      )}

      {/* GitHub */}
      {project.github_repo_url && (
        <Section title="GitHub Repository">
          <a
            href={project.github_repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-border p-4 rounded-xl hover:border-foreground/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">
                  {project.github_repo_name}
                </div>
                {project.github_repo_description && (
                  <p className="text-xs text-muted mt-0.5">
                    {project.github_repo_description}
                  </p>
                )}
              </div>
              <span className="text-xs text-muted">&rarr;</span>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-muted">
              {project.github_repo_language && (
                <span>{project.github_repo_language}</span>
              )}
              {project.github_repo_stars != null && (
                <span>{project.github_repo_stars} stars</span>
              )}
              {project.github_repo_updated_at && (
                <span>
                  Updated{" "}
                  {new Date(
                    project.github_repo_updated_at
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </a>
        </Section>
      )}

      {/* Fork description */}
      {project.fork_description && (
        <Section title="What Changed in This Fork">
          <p className="text-sm leading-relaxed text-muted">
            <HighlightText text={project.fork_description} />
          </p>
        </Section>
      )}
    </div>
  );
}
