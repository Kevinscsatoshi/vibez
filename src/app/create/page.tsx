"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { publishProject } from "./actions";

interface PromptBlock {
  label: string;
  prompt: string;
  model: string;
}

interface Iteration {
  version: string;
  what_changed: string;
  result: string;
}

interface Metric {
  name: string;
  value: string;
  timeframe: string;
}

interface FormData {
  title: string;
  one_liner: string;
  what_i_built: string;
  why_i_built: string;
  prompts: PromptBlock[];
  iterations: Iteration[];
  failures: string;
  stack_tags: string[];
  demo_link: string;
  video_url: string;
  snippet_id: string;
  metrics: Metric[];
  lessons: string;
}

interface GithubRepo {
  full_name: string;
  name: string;
  html_url: string;
  default_branch: string;
  description: string | null;
}

const STEPS = [
  "Basics",
  "Prompts",
  "Build Story",
  "Stack & Output",
  "Metrics & Lessons",
  "Publish",
];

const INITIAL_FORM: FormData = {
  title: "",
  one_liner: "",
  what_i_built: "",
  why_i_built: "",
  prompts: [{ label: "", prompt: "", model: "" }],
  iterations: [{ version: "v1", what_changed: "", result: "" }],
  failures: "",
  stack_tags: [],
  demo_link: "",
  video_url: "",
  snippet_id: "",
  metrics: [],
  lessons: "",
};

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [tagInput, setTagInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [repoConnected, setRepoConnected] = useState(false);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");

  const loadGithubRepos = async () => {
    setRepoLoading(true);
    setRepoError("");
    try {
      const resp = await fetch("/api/github/repos", { cache: "no-store" });
      const json = (await resp.json()) as {
        connected?: boolean;
        repos?: GithubRepo[];
        error?: string;
      };
      if (!resp.ok) {
        setRepoError(json.error ?? "Failed to load repositories");
        setRepoConnected(Boolean(json.connected));
        setRepos([]);
        return;
      }
      setRepoConnected(Boolean(json.connected));
      setRepos(json.repos ?? []);
    } catch {
      setRepoError("Failed to load repositories");
    } finally {
      setRepoLoading(false);
    }
  };

  useEffect(() => {
    loadGithubRepos();
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const githubError = params.get("github_error");
    if (githubError) setRepoError(`GitHub connect failed: ${githubError}`);
  }, []);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addPrompt = () => {
    updateField("prompts", [...form.prompts, { label: "", prompt: "", model: "" }]);
  };

  const updatePrompt = (index: number, field: keyof PromptBlock, value: string) => {
    const updated = [...form.prompts];
    updated[index] = { ...updated[index], [field]: value };
    updateField("prompts", updated);
  };

  const removePrompt = (index: number) => {
    if (form.prompts.length <= 1) return;
    updateField("prompts", form.prompts.filter((_, i) => i !== index));
  };

  const addIteration = () => {
    updateField("iterations", [
      ...form.iterations,
      { version: `v${form.iterations.length + 1}`, what_changed: "", result: "" },
    ]);
  };

  const updateIteration = (index: number, field: keyof Iteration, value: string) => {
    const updated = [...form.iterations];
    updated[index] = { ...updated[index], [field]: value };
    updateField("iterations", updated);
  };

  const removeIteration = (index: number) => {
    if (form.iterations.length <= 1) return;
    updateField("iterations", form.iterations.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.stack_tags.includes(tag)) {
      updateField("stack_tags", [...form.stack_tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    updateField("stack_tags", form.stack_tags.filter((t) => t !== tag));
  };

  const addMetric = () => {
    updateField("metrics", [...form.metrics, { name: "", value: "", timeframe: "" }]);
  };

  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    const updated = [...form.metrics];
    updated[index] = { ...updated[index], [field]: value };
    updateField("metrics", updated);
  };

  const removeMetric = (index: number) => {
    updateField("metrics", form.metrics.filter((_, i) => i !== index));
  };

  const handleFilePick = (files: FileList | null) => {
    if (!files) return;
    const next: File[] = [];
    for (const file of Array.from(files)) {
      next.push(file);
    }
    setSelectedFiles((prev) => [...prev, ...next]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizeSnippetId = (value: string) => {
    const raw = value.trim();
    if (!raw) return "";
    if (!raw.includes("/")) return raw;
    const parts = raw.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "playground");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return raw;
  };

  const canAdvance = () => {
    switch (step) {
      case 0:
        return form.title && form.one_liner && form.what_i_built && form.why_i_built;
      case 1:
        return form.prompts.length > 0 && form.prompts[0].prompt;
      case 2:
        return form.iterations.length > 0 && form.iterations[0].what_changed;
      case 3:
        return form.stack_tags.length > 0;
      default:
        return true;
    }
  };

  const handlePublish = async () => {
    setPublishError("");
    setPublishing(true);
    try {
      const payload = new FormData();
      payload.set("title", form.title);
      payload.set("one_liner", form.one_liner);
      payload.set("what_i_built", form.what_i_built);
      payload.set("why_i_built", form.why_i_built);
      payload.set("prompts", JSON.stringify(form.prompts));
      payload.set("iterations", JSON.stringify(form.iterations));
      payload.set("failures", form.failures);
      payload.set("stack_tags", JSON.stringify(form.stack_tags));
      payload.set("demo_link", form.demo_link);
      payload.set("video_url", form.video_url);
      payload.set("snippet_id", form.snippet_id);
      payload.set("metrics", JSON.stringify(form.metrics));
      payload.set("lessons", form.lessons);
      if (selectedRepo) payload.set("repo_full_name", selectedRepo);

      for (const file of selectedFiles) {
        payload.append("files", file);
      }

      const result = await publishProject(payload);
      if (result.error === "not_authenticated") {
        router.push(`/signin?next=${encodeURIComponent("/create")}`);
        return;
      }
      if (result.error) {
        setPublishError(result.error);
        return;
      }
      if (result.id) {
        router.push(`/project/${result.id}`);
        router.refresh();
      }
    } catch {
      setPublishError("Failed to publish project");
    } finally {
      setPublishing(false);
    }
  };

  const inputClass =
    "w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl";
  const textareaClass = `${inputClass} resize-y`;
  const labelClass = "block text-xs font-medium text-muted mb-1.5";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Publish a Project</h1>
        <p className="mt-1 text-sm text-muted">
          Share what you built, how you built it, and what you learned.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col gap-1">
            <div
              className={`h-1 rounded-full ${
                i <= step ? "bg-foreground" : "bg-border"
              } transition-colors`}
            />
            <span
              className={`text-[10px] ${
                i === step ? "text-foreground font-medium" : "text-muted"
              }`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      {/* Step 0: Basics */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="AI Resume Roaster"
              maxLength={100}
            />
          </div>
          <div>
            <label className={labelClass}>One-line result</label>
            <input
              className={inputClass}
              value={form.one_liner}
              onChange={(e) => updateField("one_liner", e.target.value)}
              placeholder="Upload your resume, get brutally honest AI feedback in 10 seconds"
              maxLength={200}
            />
          </div>
          <div>
            <label className={labelClass}>What I built</label>
            <textarea
              className={textareaClass}
              rows={4}
              value={form.what_i_built}
              onChange={(e) => updateField("what_i_built", e.target.value)}
              placeholder="A web app that lets users upload their resume and get structured, actionable feedback..."
            />
          </div>
          <div>
            <label className={labelClass}>Why I built it</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={form.why_i_built}
              onChange={(e) => updateField("why_i_built", e.target.value)}
              placeholder="I was helping friends review resumes and realized the feedback loop is slow..."
            />
          </div>
        </div>
      )}

      {/* Step 1: Prompts */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-muted">
            Add the prompts you used to build this project. Markdown is supported.
          </p>
          {form.prompts.map((block, i) => (
            <div key={i} className="border border-border p-4 space-y-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  Prompt {i + 1}
                </span>
                {form.prompts.length > 1 && (
                  <button
                    onClick={() => removePrompt(i)}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                className={inputClass}
                value={block.label}
                onChange={(e) => updatePrompt(i, "label", e.target.value)}
                placeholder="Label (e.g., Core analysis prompt)"
              />
              <textarea
                className={`${textareaClass} font-mono text-xs`}
                rows={6}
                value={block.prompt}
                onChange={(e) => updatePrompt(i, "prompt", e.target.value)}
                placeholder="Paste your prompt here..."
              />
              <input
                className={inputClass}
                value={block.model}
                onChange={(e) => updatePrompt(i, "model", e.target.value)}
                placeholder="Model/tool used (e.g., Claude 3.5 Sonnet)"
              />
            </div>
          ))}
          <button
            onClick={addPrompt}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            + Add another prompt
          </button>
        </div>
      )}

      {/* Step 2: Build Story */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Iteration History</h3>
            <div className="space-y-4">
              {form.iterations.map((iter, i) => (
                <div key={i} className="border border-border p-4 space-y-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <input
                      className="border border-border px-2 py-1 text-xs w-20 focus:outline-none focus:border-foreground/30 rounded-lg"
                      value={iter.version}
                      onChange={(e) => updateIteration(i, "version", e.target.value)}
                    />
                    {form.iterations.length > 1 && (
                      <button
                        onClick={() => removeIteration(i)}
                        className="text-xs text-muted hover:text-foreground"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    value={iter.what_changed}
                    onChange={(e) => updateIteration(i, "what_changed", e.target.value)}
                    placeholder="What changed in this version?"
                  />
                  <textarea
                    className={textareaClass}
                    rows={2}
                    value={iter.result}
                    onChange={(e) => updateIteration(i, "result", e.target.value)}
                    placeholder="What was the result?"
                  />
                </div>
              ))}
              <button
                onClick={addIteration}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                + Add iteration
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              What didn&apos;t work? (optional but encouraged)
            </label>
            <textarea
              className={textareaClass}
              rows={4}
              value={form.failures}
              onChange={(e) => updateField("failures", e.target.value)}
              placeholder="What did you try that didn't work? This helps others avoid the same mistakes."
            />
          </div>
        </div>
      )}

      {/* Step 3: Stack & Output */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Stack / Tools</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputClass}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter (e.g., Next.js)"
              />
              <button
                onClick={addTag}
                className="border border-border px-3 text-sm hover:border-foreground/30 transition-colors shrink-0 rounded-xl"
              >
                Add
              </button>
            </div>
            {form.stack_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.stack_tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-muted hover:text-foreground"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Demo link (optional)</label>
            <input
              className={inputClass}
              value={form.demo_link}
              onChange={(e) => updateField("demo_link", e.target.value)}
              placeholder="https://myproject.com"
            />
          </div>

          <div>
            <label className={labelClass}>
              Video URL (optional — YouTube, Loom, or direct mp4)
            </label>
            <input
              className={inputClass}
              value={form.video_url}
              onChange={(e) => updateField("video_url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className={labelClass}>
              Playground snippet (optional — snippet ID or /playground URL)
            </label>
            <input
              className={inputClass}
              value={form.snippet_id}
              onChange={(e) =>
                updateField("snippet_id", normalizeSnippetId(e.target.value))
              }
              placeholder="9ec8f5db-... or https://.../playground/9ec8f5db-..."
            />
            <p className="mt-1 text-xs text-muted">
              Tip: create/edit snippets in{" "}
              <Link href="/playground" className="text-accent underline">
                Playground
              </Link>{" "}
              and paste the snippet ID here.
            </p>
          </div>

          <div>
            <label className={labelClass}>
              Upload code files / zip (optional)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFilePick(e.target.files)}
              className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-tag-bg file:px-2.5 file:py-1 file:text-xs`}
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-tag-bg/40 px-2.5 py-1.5 text-xs"
                  >
                    <span className="truncate mr-3">
                      {file.name} ({Math.ceil(file.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(i)}
                      className="text-muted hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Metrics & Lessons */}
      {step === 4 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Metrics / Traction (optional)</label>
            <div className="space-y-3">
              {form.metrics.map((m, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    className={`${inputClass} flex-1`}
                    value={m.name}
                    onChange={(e) => updateMetric(i, "name", e.target.value)}
                    placeholder="Metric (e.g., Users)"
                  />
                  <input
                    className={`${inputClass} w-28`}
                    value={m.value}
                    onChange={(e) => updateMetric(i, "value", e.target.value)}
                    placeholder="Value"
                  />
                  <input
                    className={`${inputClass} w-36`}
                    value={m.timeframe}
                    onChange={(e) => updateMetric(i, "timeframe", e.target.value)}
                    placeholder="Timeframe"
                  />
                  <button
                    onClick={() => removeMetric(i)}
                    className="text-xs text-muted hover:text-foreground pt-2"
                  >
                    x
                  </button>
                </div>
              ))}
              <button
                onClick={addMetric}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                + Add metric
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Lessons learned (optional)</label>
            <textarea
              className={textareaClass}
              rows={5}
              value={form.lessons}
              onChange={(e) => updateField("lessons", e.target.value)}
              placeholder="What would you tell someone starting this project today?"
            />
          </div>
        </div>
      )}

      {/* Step 5: Publish */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="border border-border p-5 rounded-2xl">
            <h3 className="font-semibold text-base">{form.title || "Untitled"}</h3>
            <p className="text-sm text-muted mt-1">{form.one_liner}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {form.stack_tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted">
              {form.prompts.length} prompt(s) &middot;{" "}
              {form.iterations.length} iteration(s)
              {form.metrics.length > 0 && ` \u00b7 ${form.metrics.length} metric(s)`}
              {form.snippet_id && " \u00b7 playground linked"}
            </div>
            {form.snippet_id && (
              <div className="mt-2">
                <Link
                  href={`/playground/${form.snippet_id}`}
                  className="text-xs text-accent underline"
                >
                  Preview linked playground &rarr;
                </Link>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Connect GitHub repository (optional, public repos)
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/api/github/connect"
                className="border border-border px-4 py-2 text-sm hover:border-foreground/30 transition-colors rounded-full"
              >
                {repoConnected ? "Reconnect GitHub" : "Connect GitHub"} &rarr;
              </Link>
              <button
                type="button"
                onClick={loadGithubRepos}
                className="border border-border px-3 py-2 text-xs hover:border-foreground/30 transition-colors rounded-full"
              >
                Refresh repos
              </button>
            </div>
            <p className="text-xs text-muted mt-2">
              {repoConnected
                ? "Select one repo to sync README and metadata."
                : "Sign in with GitHub to attach a repository to this project."}
            </p>
            {repoLoading && (
              <p className="text-xs text-muted mt-2">Loading repositories...</p>
            )}
            {repoError && (
              <p className="text-xs text-red-600 mt-2">{repoError}</p>
            )}
            {repoConnected && repos.length > 0 && (
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className={`${inputClass} mt-2`}
              >
                <option value="">No repository selected</option>
                {repos.map((repo) => (
                  <option key={repo.full_name} value={repo.full_name}>
                    {repo.full_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className={`w-full py-3 text-sm font-medium transition-opacity rounded-full ${
              publishing
                ? "bg-border text-muted cursor-not-allowed"
                : "bg-foreground text-background hover:opacity-90"
            }`}
          >
            {publishing ? "Publishing..." : "Publish Project"}
          </button>
          {publishError && (
            <p className="text-xs text-red-600 text-center">{publishError}</p>
          )}
          <p className="text-xs text-muted text-center">
            Publishing is instant. You can edit and resync later.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          className={`text-sm ${
            step === 0
              ? "text-muted cursor-not-allowed"
              : "text-foreground hover:opacity-70"
          }`}
          disabled={step === 0}
        >
          &larr; Back
        </button>
        {step < STEPS.length - 1 && (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canAdvance()}
            className={`text-sm px-5 py-1.5 rounded-full ${
              canAdvance()
                ? "bg-foreground text-background hover:opacity-90"
                : "bg-border text-muted cursor-not-allowed"
            } transition-opacity`}
          >
            Next &rarr;
          </button>
        )}
      </div>

      {/* Reference link */}
      <div className="mt-10 border-t border-border pt-6">
        <p className="text-xs text-muted">
          Need inspiration?{" "}
          <Link href="/" className="text-accent underline">
            Browse existing projects
          </Link>{" "}
          to see examples of great submissions.
        </p>
      </div>
    </div>
  );
}
