import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/sample-data";
import { Section } from "@/components/section";
import { MarkdownBlock } from "@/components/markdown-block";
import { HighlightText } from "@/components/highlight-text";
import { SaveButton } from "@/components/save-button";
import { GithubSyncButton } from "@/components/github-sync-button";
import { createClient } from "@/lib/supabase-server";
import { Metadata } from "next";
import type { Project, Snippet, CommunityNote } from "@/types/database";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ from?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectData(id);
  if (!project) return {};
  return {
    title: `${project.title} — VibeZ`,
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

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const CODING_LABELS: Record<string, string> = {
  none: "No coding required",
  minimal: "Minimal coding",
  moderate: "Some coding",
  heavy: "Code-heavy",
};

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const project = await getProjectData(id);
  if (!project) notFound();

  let userSaved = false;
  let isOwner = false;
  let repoLinked = false;
  let communityNotes: CommunityNote[] = [];
  let projectFiles: Array<{
    id: string;
    path: string;
    name: string;
    kind: "file" | "zip";
    size_bytes: number | null;
  }> = [];

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      isOwner = user.id === project.author_id;
      const { data } = await supabase
        .from("recipe_saves")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("recipe_id", id)
        .single();
      userSaved = !!data;
    }

    const { data: files } = await supabase
      .from("project_files")
      .select("id, path, name, kind, size_bytes")
      .eq("project_id", id)
      .order("created_at", { ascending: false });
    projectFiles =
      (files as typeof projectFiles) ?? [];

    const { data: repoLink } = await supabase
      .from("project_repo_links")
      .select("id")
      .eq("project_id", id)
      .maybeSingle();
    repoLinked = Boolean(repoLink);

    // Community notes
    const { data: notes } = await supabase
      .from("community_notes")
      .select("*, author:profiles(*)")
      .eq("recipe_id", id)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);
    communityNotes = (notes as CommunityNote[]) ?? [];
  } catch {
    // not logged in or table doesn't exist yet
  }

  const difficulty = project.difficulty;
  const codingReq = project.coding_required;

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {from === "publish" && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Recipe published successfully.
          <Link href="/" className="ml-2 underline">
            View on homepage
          </Link>
          <Link href="/profile/me" className="ml-3 underline">
            Go to profile
          </Link>
        </div>
      )}

      {/* Header with trust signals */}
      <header className="mb-8">
        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {difficulty && (
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${DIFFICULTY_STYLES[difficulty] ?? "bg-tag-bg text-tag-text"}`}>
              {DIFFICULTY_LABELS[difficulty] ?? difficulty}
            </span>
          )}
          {project.estimated_time && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-tag-bg text-tag-text">
              {project.estimated_time}
            </span>
          )}
          {codingReq && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-tag-bg text-tag-text">
              {CODING_LABELS[codingReq] ?? codingReq}
            </span>
          )}
        </div>

        {project.forked_from && project.parent_project && (
          <p className="text-xs text-muted mb-2">
            Remixed from{" "}
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
          {project.completion_count > 0 && (
            <span className="text-success font-medium">
              {project.completion_count} people tried this
            </span>
          )}
        </div>

        {/* Tools needed */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack_tags.map((tag) => (
            <span
              key={tag}
              className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Who is this for */}
        {project.who_is_this_for.length > 0 && (
          <div className="mt-3 text-xs text-muted">
            For: {project.who_is_this_for.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(", ")}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3">
          <SaveButton
            recipeId={project.id}
            initialSaved={userSaved}
            initialSaveCount={project.save_count}
          />
          <Link
            href={`/create?fork=${project.id}`}
            className="border border-border px-4 py-1.5 text-sm font-medium hover:border-foreground/30 transition-colors rounded-full"
          >
            Remix this recipe
          </Link>
        </div>
      </header>

      {/* What You'll Build — outcome first */}
      <Section title="What You'll Build">
        <div className="space-y-4">
          {project.outcome_description ? (
            <p className="text-sm leading-relaxed text-muted">
              <HighlightText text={project.outcome_description} />
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              <HighlightText text={project.what_i_built} />
            </p>
          )}

          {/* Screenshots / Demo / Video */}
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

          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-border px-4 py-2 text-sm hover:border-foreground/30 transition-colors rounded-full"
            >
              View live demo &rarr;
            </a>
          )}
        </div>
      </Section>

      {/* Before You Start */}
      {(project.stack_tags.length > 0 || project.estimated_time || codingReq) && (
        <Section title="Before You Start">
          <div className="rounded-xl border border-border bg-tag-bg/30 p-4 text-sm">
            <p className="font-medium mb-2">You&apos;ll need:</p>
            <ul className="space-y-1 text-muted">
              {project.stack_tags.map((tag) => (
                <li key={tag} className="flex items-center gap-2">
                  <span className="text-success">&#10003;</span>
                  {tag}
                </li>
              ))}
              {project.estimated_time && (
                <li className="flex items-center gap-2">
                  <span className="text-success">&#10003;</span>
                  About {project.estimated_time}
                </li>
              )}
            </ul>
            {codingReq && (
              <p className="mt-2 text-xs text-muted">{CODING_LABELS[codingReq] ?? codingReq}.</p>
            )}
            {project.cost_estimate && (
              <p className="mt-1 text-xs text-muted">Estimated cost: {project.cost_estimate}</p>
            )}
            <p className="mt-3 text-xs text-muted italic">Don&apos;t worry if you haven&apos;t used these before — each step will guide you.</p>
          </div>
        </Section>
      )}

      {/* Steps — the core */}
      {project.steps.length > 0 && (
        <Section title="Steps">
          <div className="space-y-4">
            {project.steps.map((step, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold shrink-0">
                    {step.order || i + 1}
                  </span>
                  <h4 className="font-medium text-sm pt-0.5">{step.title}</h4>
                </div>
                {step.description && (
                  <p className="text-sm text-muted leading-relaxed ml-9 mb-2">
                    <HighlightText text={step.description} />
                  </p>
                )}
                {step.prompt && (
                  <div className="ml-9 mb-2">
                    <p className="text-xs text-muted mb-1">Prompt to use:</p>
                    <div className="bg-[#1e1e1e] text-[#d4d4d4] p-3 text-xs font-mono leading-relaxed whitespace-pre-wrap rounded-lg relative">
                      {step.prompt}
                    </div>
                  </div>
                )}
                {step.expected_result && (
                  <div className="ml-9 text-xs text-muted">
                    <span className="text-success font-medium">Expected result:</span>{" "}
                    {step.expected_result}
                  </div>
                )}
                {step.tip && (
                  <div className="ml-9 mt-1 text-xs text-muted italic">
                    Tip: {step.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Prompts (when no steps, prompts are the core content) */}
      {project.prompts.length > 0 && (
        <Section title={project.steps.length > 0 ? "All Prompts" : "Prompts"}>
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
      )}

      {/* When Things Go Wrong */}
      {(project.common_failures.length > 0 || project.failures) && (
        <Section title="Stuck? Try these fixes">
          <div className="space-y-3">
            {project.common_failures.map((f, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium mb-1">{f.symptom}</p>
                <p className="text-xs text-muted mb-1">&rarr; {f.cause}</p>
                <p className="text-xs text-success">&rarr; Fix: {f.fix}</p>
              </div>
            ))}
            {project.failures && project.common_failures.length === 0 && (
              <p className="text-sm leading-relaxed text-muted">
                <HighlightText text={project.failures} />
              </p>
            )}
          </div>
        </Section>
      )}

      {/* Community Notes */}
      <Section title={`Notes from the Community${communityNotes.length > 0 ? ` (${communityNotes.length})` : ""}`}>
        {communityNotes.length > 0 ? (
          <div className="space-y-3">
            {communityNotes.map((note) => (
              <div key={note.id} className={`rounded-xl border ${note.pinned ? "border-accent/30 bg-accent/5" : "border-border"} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  {note.pinned && <span className="text-[10px] font-bold text-accent uppercase">Pinned</span>}
                  <span className="px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide rounded bg-tag-bg text-tag-text">
                    {note.note_type.replace("_", " ")}
                  </span>
                  {note.author && (
                    <span className="text-xs text-muted">{note.author.display_name}</span>
                  )}
                </div>
                <p className="text-sm text-muted leading-relaxed">{note.content}</p>
                {note.screenshot_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={note.screenshot_url} alt="Note screenshot" className="mt-2 rounded-lg border border-border max-h-48 object-cover" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted mb-1">Be the first to leave a note!</p>
            <p className="text-xs text-muted">Tried this recipe? Share a tip, ask a question, or show what you made.</p>
          </div>
        )}
      </Section>

      {/* Output / Demo (additional media) */}
      {(project.demo_html_url || project.video_url || project.snippet_id) && (
        <Section title="Demo">
          <div className="space-y-4">
            {repoLinked && isOwner && <GithubSyncButton projectId={project.id} />}

            {project.demo_html_url && (
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-tag-bg px-3 py-1.5 text-xs font-medium text-muted border-b border-border">
                  Live Demo
                </div>
                <iframe
                  src={project.demo_html_url}
                  sandbox="allow-scripts"
                  className="w-full h-96"
                  title="Recipe demo"
                />
              </div>
            )}

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
                    src={project.video_url.replace("/share/", "/embed/")}
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

            {project.snippet_id && (
              <Link
                href={`/playground/${project.snippet_id}`}
                className="inline-block border border-border px-4 py-2 text-sm hover:border-foreground/30 transition-colors rounded-full"
              >
                Open Playground{project.snippet?.title ? `: ${project.snippet.title}` : ""} &rarr;
              </Link>
            )}
          </div>
        </Section>
      )}

      {projectFiles.length > 0 && (
        <Section title="Files">
          <div className="space-y-2">
            {projectFiles.map((file) => (
              <a
                key={file.id}
                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-assets/${file.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:border-foreground/30 transition-colors"
              >
                <span className="truncate mr-3">
                  {file.name}
                  {file.kind === "zip" ? " (zip)" : ""}
                </span>
                <span className="text-xs text-muted shrink-0">
                  {file.size_bytes ? `${Math.ceil(file.size_bytes / 1024)} KB` : ""}
                </span>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Builder's Story (collapsed section) */}
      {(project.why_i_built || project.iterations.length > 0 || project.lessons) && (
        <details className="mb-8 border border-border rounded-xl">
          <summary className="px-5 py-3 text-sm font-semibold cursor-pointer hover:bg-tag-bg/50 rounded-xl transition-colors">
            Behind the Recipe
          </summary>
          <div className="px-5 pb-5 space-y-4">
            {project.why_i_built && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Why I Made This</h4>
                <p className="text-sm leading-relaxed text-muted">
                  <HighlightText text={project.why_i_built} />
                </p>
              </div>
            )}
            {project.iterations.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Iterations</h4>
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
              </div>
            )}
            {project.lessons && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Lessons Learned</h4>
                <p className="text-sm leading-relaxed text-muted">
                  <HighlightText text={project.lessons} />
                </p>
              </div>
            )}
            {project.metrics.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Metrics</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="border border-border p-3 rounded-xl">
                      <div className="text-lg font-bold">{metric.value}</div>
                      <div className="text-xs text-muted mt-0.5">
                        {metric.name}
                        {metric.timeframe && ` — ${metric.timeframe}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>
      )}

      {/* GitHub — deprioritized, small link */}
      {project.github_repo_url && (
        <div className="mb-8 text-xs text-muted">
          Source code:{" "}
          <a href={project.github_repo_url} target="_blank" rel="noopener noreferrer" className="text-accent underline">
            {project.github_repo_name ?? "GitHub"}
          </a>
        </div>
      )}

      {/* README */}
      {project.github_readme && (
        <Section title="README">
          <div className="border border-border p-5 max-h-96 overflow-y-auto rounded-xl">
            <MarkdownBlock content={project.github_readme} />
          </div>
        </Section>
      )}

      {/* Fork description */}
      {project.fork_description && (
        <Section title="What Changed in This Remix">
          <p className="text-sm leading-relaxed text-muted">
            <HighlightText text={project.fork_description} />
          </p>
        </Section>
      )}

      {/* Bottom actions */}
      <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
        <SaveButton
          recipeId={project.id}
          initialSaved={userSaved}
          initialSaveCount={project.save_count}
        />
        <Link
          href={`/create?fork=${project.id}`}
          className="border border-border px-4 py-1.5 text-sm font-medium hover:border-foreground/30 transition-colors rounded-full"
        >
          Remix this recipe
        </Link>
      </div>
    </div>
  );
}
