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

interface RecipeStep {
  order: number;
  title: string;
  description: string;
  prompt: string;
  tool: string;
  expected_result: string;
  tip: string;
}

interface FailurePoint {
  symptom: string;
  cause: string;
  fix: string;
}

interface Metric {
  name: string;
  value: string;
  timeframe: string;
}

interface Iteration {
  version: string;
  what_changed: string;
  result: string;
}

interface FormData {
  title: string;
  one_liner: string;
  outcome_description: string;
  who_is_this_for: string[];
  category: string;
  difficulty: string;
  coding_required: string;
  estimated_time: string;
  cost_estimate: string;
  steps: RecipeStep[];
  prompts: PromptBlock[];
  common_failures: FailurePoint[];
  stack_tags: string[];
  demo_link: string;
  video_url: string;
  snippet_id: string;
  why_i_built: string;
  lessons: string;
  iterations: Iteration[];
  failures: string;
  metrics: Metric[];
  what_i_built: string;
}

interface GithubRepo {
  full_name: string;
  name: string;
  html_url: string;
  default_branch: string;
  description: string | null;
}

const POPULAR_MODELS = [
  "GPT-4.1",
  "GPT-4o",
  "o3",
  "o4-mini",
  "Claude 3.7 Sonnet",
  "Claude 3.5 Sonnet",
  "Gemini 2.5 Pro",
  "Gemini 2.0 Flash",
  "DeepSeek R1",
  "Llama 3.1 405B",
  "Qwen2.5-72B",
  "Mistral Large",
  "Grok 2",
];

type ModelBrand = {
  company: string;
  logoUrl?: string;
};

const BRAND_LOGOS: Record<string, ModelBrand> = {
  openai: { company: "OpenAI", logoUrl: "/brand-logos/openai.svg" },
  claude: { company: "Claude", logoUrl: "/brand-logos/claude.svg" },
  google: { company: "Google", logoUrl: "/brand-logos/google.svg" },
  deepseek: { company: "DeepSeek", logoUrl: "/brand-logos/deepseek.svg" },
  meta: { company: "Meta", logoUrl: "/brand-logos/meta.svg" },
  alibaba: { company: "Alibaba", logoUrl: "/brand-logos/alibaba.svg" },
  mistral: { company: "Mistral", logoUrl: "/brand-logos/mistral.svg" },
  xai: { company: "xAI", logoUrl: "/brand-logos/xai.svg" },
};

function inferBrandByModel(model: string): ModelBrand {
  const lower = model.toLowerCase();
  if (lower.includes("gpt") || lower.includes("o3") || lower.includes("o4")) return BRAND_LOGOS.openai;
  if (lower.includes("claude")) return BRAND_LOGOS.claude;
  if (lower.includes("gemini")) return BRAND_LOGOS.google;
  if (lower.includes("deepseek")) return BRAND_LOGOS.deepseek;
  if (lower.includes("llama")) return BRAND_LOGOS.meta;
  if (lower.includes("qwen")) return BRAND_LOGOS.alibaba;
  if (lower.includes("mistral")) return BRAND_LOGOS.mistral;
  if (lower.includes("grok")) return BRAND_LOGOS.xai;
  return { company: "Model" };
}

const PERSONAS = ["founder", "marketer", "student", "developer", "creator", "anyone"];
const CATEGORIES = [
  { value: "landing-page", label: "Landing Pages" },
  { value: "automation", label: "Automations" },
  { value: "internal-tool", label: "Internal Tools" },
  { value: "content", label: "Content Creation" },
  { value: "data-tool", label: "Data & Analytics" },
  { value: "chatbot", label: "Chatbots" },
  { value: "mobile-app", label: "Mobile Apps" },
  { value: "chrome-ext", label: "Chrome Extensions" },
  { value: "other", label: "Other" },
];

const TIME_OPTIONS = ["15 min", "30 min", "1 hour", "2 hours", "Half day", "Full day", "1 weekend", "1 week"];

const STEPS = [
  "What will people build?",
  "Setup & expectations",
  "Steps",
  "Prompts",
  "Troubleshooting",
  "Proof & Story",
  "Publish",
];

const INITIAL_FORM: FormData = {
  title: "",
  one_liner: "",
  outcome_description: "",
  who_is_this_for: [],
  category: "",
  difficulty: "",
  coding_required: "",
  estimated_time: "",
  cost_estimate: "",
  steps: [{ order: 1, title: "", description: "", prompt: "", tool: "", expected_result: "", tip: "" }],
  prompts: [{ label: "", prompt: "", model: "" }],
  common_failures: [],
  stack_tags: [],
  demo_link: "",
  video_url: "",
  snippet_id: "",
  why_i_built: "",
  lessons: "",
  iterations: [{ version: "v1", what_changed: "", result: "" }],
  failures: "",
  metrics: [],
  what_i_built: "",
};

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [tagInput, setTagInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState("");
  const [publishError, setPublishError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [repoConnected, setRepoConnected] = useState(false);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [autofillLoading, setAutofillLoading] = useState(false);

  const loadGithubRepos = async () => {
    setRepoLoading(true);
    setRepoError("");
    try {
      const resp = await fetch("/api/github/repos", { cache: "no-store" });
      const json = (await resp.json()) as { connected?: boolean; repos?: GithubRepo[]; error?: string };
      if (!resp.ok) {
        // Don't show error for unauthenticated users — GitHub import is optional
        if (json.error === "not_authenticated") {
          setRepoConnected(false);
          setRepos([]);
          return;
        }
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

  const togglePersona = (persona: string) => {
    const current = form.who_is_this_for;
    updateField("who_is_this_for", current.includes(persona) ? current.filter((p) => p !== persona) : [...current, persona]);
  };

  // Steps management
  const addStep = () => {
    updateField("steps", [...form.steps, { order: form.steps.length + 1, title: "", description: "", prompt: "", tool: "", expected_result: "", tip: "" }]);
  };
  const updateStep = (index: number, field: keyof RecipeStep, value: string | number) => {
    const updated = [...form.steps];
    updated[index] = { ...updated[index], [field]: value };
    updateField("steps", updated);
  };
  const removeStep = (index: number) => {
    if (form.steps.length <= 1) return;
    updateField("steps", form.steps.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
  };

  // Prompts
  const addPrompt = () => updateField("prompts", [...form.prompts, { label: "", prompt: "", model: "" }]);
  const updatePrompt = (index: number, field: keyof PromptBlock, value: string) => {
    const updated = [...form.prompts];
    updated[index] = { ...updated[index], [field]: value };
    updateField("prompts", updated);
  };
  const removePrompt = (index: number) => {
    if (form.prompts.length <= 1) return;
    updateField("prompts", form.prompts.filter((_, i) => i !== index));
  };

  const parseModelSelections = (value: string): string[] => value.split(",").map((v) => v.trim()).filter(Boolean);
  const serializeModelSelections = (models: string[]) => models.filter(Boolean).join(", ");
  const togglePromptModelSelection = (index: number, modelName: string) => {
    const current = parseModelSelections(form.prompts[index]?.model ?? "");
    const next = current.includes(modelName) ? current.filter((m) => m !== modelName) : [...current, modelName];
    updatePrompt(index, "model", serializeModelSelections(next));
  };

  // Failures
  const addFailure = () => updateField("common_failures", [...form.common_failures, { symptom: "", cause: "", fix: "" }]);
  const updateFailure = (index: number, field: keyof FailurePoint, value: string) => {
    const updated = [...form.common_failures];
    updated[index] = { ...updated[index], [field]: value };
    updateField("common_failures", updated);
  };
  const removeFailure = (index: number) => updateField("common_failures", form.common_failures.filter((_, i) => i !== index));

  // Tags
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.stack_tags.includes(tag)) {
      updateField("stack_tags", [...form.stack_tags, tag]);
      setTagInput("");
    }
  };
  const removeTag = (tag: string) => updateField("stack_tags", form.stack_tags.filter((t) => t !== tag));

  const handleFilePick = (files: FileList | null) => {
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
  };
  const removeSelectedFile = (index: number) => setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

  const normalizeSnippetId = (value: string) => {
    const raw = value.trim();
    if (!raw) return "";
    if (!raw.includes("/")) return raw;
    const parts = raw.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "playground");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return raw;
  };

  const handleAutofillFromReadme = async () => {
    if (!selectedRepo) return;
    setAutofillLoading(true);
    setRepoError("");
    try {
      const resp = await fetch("/api/github/readme-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoFullName: selectedRepo }),
      });
      const json = (await resp.json()) as Partial<FormData> & { error?: string };
      if (!resp.ok || json.error) {
        setRepoError(json.error ?? "Failed to generate draft from README");
        return;
      }
      setForm((prev) => ({
        ...prev,
        title: prev.title || (json.title ?? ""),
        one_liner: prev.one_liner || (json.one_liner ?? ""),
        what_i_built: prev.what_i_built || (json.what_i_built ?? ""),
        outcome_description: prev.outcome_description || (json.what_i_built ?? ""),
        why_i_built: prev.why_i_built || (json.why_i_built ?? ""),
        demo_link: prev.demo_link || (json.demo_link ?? ""),
        stack_tags: prev.stack_tags.length > 0 ? prev.stack_tags : ((json.stack_tags as string[] | undefined) ?? []),
      }));
    } catch {
      setRepoError("Failed to generate draft from README");
    } finally {
      setAutofillLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishError("");
    setPublishSuccess("");
    setPublishing(true);
    try {
      const payload = new FormData();
      payload.set("title", form.title);
      payload.set("one_liner", form.one_liner);
      payload.set("what_i_built", form.outcome_description || form.what_i_built);
      payload.set("why_i_built", form.why_i_built);
      payload.set("outcome_description", form.outcome_description);
      payload.set("prompts", JSON.stringify(form.prompts));
      payload.set("iterations", JSON.stringify(form.iterations));
      payload.set("failures", form.failures);
      payload.set("stack_tags", JSON.stringify(form.stack_tags));
      payload.set("demo_link", form.demo_link);
      payload.set("video_url", form.video_url);
      payload.set("snippet_id", form.snippet_id);
      payload.set("metrics", JSON.stringify(form.metrics));
      payload.set("lessons", form.lessons);
      payload.set("difficulty", form.difficulty);
      payload.set("coding_required", form.coding_required);
      payload.set("estimated_time", form.estimated_time);
      payload.set("who_is_this_for", JSON.stringify(form.who_is_this_for));
      payload.set("category", form.category);
      payload.set("cost_estimate", form.cost_estimate);
      payload.set("steps", JSON.stringify(form.steps));
      payload.set("common_failures", JSON.stringify(form.common_failures));
      if (selectedRepo) payload.set("repo_full_name", selectedRepo);
      for (const file of selectedFiles) payload.append("files", file);

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
        setPublishSuccess("Published! Redirecting...");
        router.push(`/project/${result.id}?from=publish`);
        router.refresh();
      }
    } catch (e) {
      setPublishError(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const inputClass = "w-full border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-foreground/30 transition-colors rounded-xl";
  const textareaClass = `${inputClass} resize-y`;
  const labelClass = "block text-xs font-medium text-muted mb-1.5";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-lg font-bold tracking-tight">Share a Recipe</h1>
        <p className="mt-0.5 text-sm text-foreground/40">
          Teach others how to build what you built — step by step.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col gap-1">
            <div className={`h-1 rounded-full ${i <= step ? "bg-foreground" : "bg-border"} transition-colors`} />
            <span className={`text-[10px] ${i === step ? "text-foreground font-medium" : "text-muted"}`}>{s}</span>
          </div>
        ))}
      </div>

      {/* Step 0: What will people build? */}
      {step === 0 && (
        <div className="space-y-5">
          {/* GitHub import */}
          <div className="rounded-xl border border-border bg-tag-bg/35 p-4">
            <label className={labelClass}>Quick start: import from GitHub README</label>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/api/github/connect" className="border border-border px-4 py-2 text-sm hover:border-foreground/30 transition-colors rounded-full">
                {repoConnected ? "Reconnect GitHub" : "Connect GitHub"} &rarr;
              </Link>
              <button type="button" onClick={loadGithubRepos} className="border border-border px-3 py-2 text-xs hover:border-foreground/30 transition-colors rounded-full">Refresh</button>
            </div>
            {repoLoading && <p className="text-xs text-muted mt-2">Loading repositories...</p>}
            {repoConnected && repos.length > 0 && (
              <div className="mt-2 space-y-2">
                <select value={selectedRepo} onChange={(e) => setSelectedRepo(e.target.value)} className={inputClass}>
                  <option value="">Select a public repository</option>
                  {repos.map((repo) => <option key={repo.full_name} value={repo.full_name}>{repo.full_name}</option>)}
                </select>
                <button type="button" onClick={handleAutofillFromReadme} disabled={!selectedRepo || autofillLoading}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${!selectedRepo || autofillLoading ? "border border-border text-muted cursor-not-allowed" : "bg-foreground text-background hover:opacity-90"}`}>
                  {autofillLoading ? "Generating draft..." : "AI draft from README"}
                </button>
              </div>
            )}
            {repoError && <p className="text-xs text-red-600 mt-2">{repoError}</p>}
          </div>

          <div>
            <label className={labelClass}>Recipe title</label>
            <input className={inputClass} value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Build a Client Intake System with Claude + Typeform" maxLength={100} />
          </div>
          <div>
            <label className={labelClass}>What will people build? (one line)</label>
            <input className={inputClass} value={form.one_liner} onChange={(e) => updateField("one_liner", e.target.value)} placeholder="A working intake form that auto-generates follow-up emails" maxLength={200} />
          </div>
          <div>
            <label className={labelClass}>Outcome description</label>
            <textarea className={textareaClass} rows={3} value={form.outcome_description} onChange={(e) => updateField("outcome_description", e.target.value)} placeholder="Describe what the reader will have when they finish this recipe..." />
          </div>
          <div>
            <label className={labelClass}>Who is this for?</label>
            <div className="flex flex-wrap gap-1.5">
              {PERSONAS.map((p) => (
                <button key={p} type="button" onClick={() => togglePersona(p)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${form.who_is_this_for.includes(p) ? "bg-foreground text-background border-foreground" : "bg-surface text-muted border-border hover:text-foreground"}`}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => updateField("category", e.target.value)}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Step 1: Setup & expectations */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Difficulty</label>
            <div className="flex gap-2">
              {["beginner", "intermediate", "advanced"].map((d) => (
                <button key={d} type="button" onClick={() => updateField("difficulty", d)}
                  className={`flex-1 py-2 text-sm rounded-xl border transition-colors ${form.difficulty === d ? "bg-foreground text-background border-foreground" : "bg-surface text-muted border-border hover:text-foreground"}`}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Coding required</label>
            <div className="flex flex-wrap gap-2">
              {[{ v: "none", l: "None" }, { v: "minimal", l: "Minimal" }, { v: "moderate", l: "Moderate" }, { v: "heavy", l: "Heavy" }].map((o) => (
                <button key={o.v} type="button" onClick={() => updateField("coding_required", o.v)}
                  className={`px-4 py-2 text-sm rounded-xl border transition-colors ${form.coding_required === o.v ? "bg-foreground text-background border-foreground" : "bg-surface text-muted border-border hover:text-foreground"}`}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Estimated time</label>
            <div className="flex flex-wrap gap-1.5">
              {TIME_OPTIONS.map((t) => (
                <button key={t} type="button" onClick={() => updateField("estimated_time", t)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${form.estimated_time === t ? "bg-foreground text-background border-foreground" : "bg-surface text-muted border-border hover:text-foreground"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Tools needed</label>
            <div className="flex gap-2 mb-2">
              <input className={inputClass} value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} placeholder="Type a tool and press Enter (e.g., Claude, v0, Zapier)" />
              <button onClick={addTag} className="border border-border px-3 text-sm hover:border-foreground/30 transition-colors shrink-0 rounded-xl">Add</button>
            </div>
            {form.stack_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.stack_tags.map((tag) => (
                  <span key={tag} className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-muted hover:text-foreground">x</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className={labelClass}>Estimated cost (optional)</label>
            <input className={inputClass} value={form.cost_estimate} onChange={(e) => updateField("cost_estimate", e.target.value)} placeholder="Free / Under $10/mo / etc." />
          </div>
        </div>
      )}

      {/* Step 2: Steps */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-muted">
            Add steps in order. Each step can include a prompt, expected result, and tips.
          </p>
          {form.steps.map((s, i) => (
            <div key={i} className="border border-border p-4 space-y-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">{i + 1}</span>
                {form.steps.length > 1 && <button onClick={() => removeStep(i)} className="text-xs text-muted hover:text-foreground">Remove</button>}
              </div>
              <input className={inputClass} value={s.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="Step title (e.g., Set up your Typeform)" />
              <textarea className={textareaClass} rows={3} value={s.description} onChange={(e) => updateStep(i, "description", e.target.value)} placeholder="Detailed instructions for this step..." />
              <textarea className={`${textareaClass} font-mono text-xs`} rows={4} value={s.prompt} onChange={(e) => updateStep(i, "prompt", e.target.value)} placeholder="Prompt to use (optional)" />
              <input className={inputClass} value={s.expected_result} onChange={(e) => updateStep(i, "expected_result", e.target.value)} placeholder="Expected result (e.g., You should see a form with 5 fields)" />
              <input className={inputClass} value={s.tip} onChange={(e) => updateStep(i, "tip", e.target.value)} placeholder="Tip (optional)" />
            </div>
          ))}
          <button onClick={addStep} className="text-sm text-muted hover:text-foreground transition-colors">+ Add step</button>
        </div>
      )}

      {/* Step 3: Prompts */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-muted">Add the key prompts used in this recipe.</p>
          {form.prompts.map((block, i) => (
            <div key={i} className="border border-border p-4 space-y-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Prompt {i + 1}</span>
                {form.prompts.length > 1 && <button onClick={() => removePrompt(i)} className="text-xs text-muted hover:text-foreground">Remove</button>}
              </div>
              <input className={inputClass} value={block.label} onChange={(e) => updatePrompt(i, "label", e.target.value)} placeholder="Label (e.g., Build prompt, Debug prompt)" />
              <textarea className={`${textareaClass} font-mono text-xs`} rows={6} value={block.prompt} onChange={(e) => updatePrompt(i, "prompt", e.target.value)} placeholder="Paste your prompt here..." />
              <div>
                <label className={labelClass}>Model used</label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_MODELS.map((model) => {
                    const selected = parseModelSelections(block.model).includes(model);
                    const brand = inferBrandByModel(model);
                    return (
                      <button key={model} type="button" onClick={() => togglePromptModelSelection(i, model)}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${selected ? "bg-foreground text-background border-foreground" : "bg-surface text-muted border-border hover:text-foreground"}`} title={`${brand.company} · ${model}`}>
                        <span className="inline-flex items-center gap-1.5">
                          {brand.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={brand.logoUrl} alt={brand.company} className="h-3.5 w-3.5 rounded-sm object-contain shrink-0" />
                          ) : (
                            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-current/30 text-[9px] font-semibold leading-none shrink-0">{brand.company[0] ?? "M"}</span>
                          )}
                          <span>{model}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          <button onClick={addPrompt} className="text-sm text-muted hover:text-foreground transition-colors">+ Add another prompt</button>
        </div>
      )}

      {/* Step 4: Troubleshooting */}
      {step === 4 && (
        <div className="space-y-5">
          <p className="text-sm text-muted">
            What commonly goes wrong? This is the most valuable part of your recipe — it saves others hours of debugging.
          </p>
          {form.common_failures.map((f, i) => (
            <div key={i} className="border border-border p-4 space-y-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Failure point {i + 1}</span>
                <button onClick={() => removeFailure(i)} className="text-xs text-muted hover:text-foreground">Remove</button>
              </div>
              <input className={inputClass} value={f.symptom} onChange={(e) => updateFailure(i, "symptom", e.target.value)} placeholder={"Symptom (e.g., \"Zapier doesn't trigger\")"} />
              <input className={inputClass} value={f.cause} onChange={(e) => updateFailure(i, "cause", e.target.value)} placeholder="Cause (e.g., Webhook URL not saved correctly)" />
              <input className={inputClass} value={f.fix} onChange={(e) => updateFailure(i, "fix", e.target.value)} placeholder="Fix (e.g., Go to Zapier > Zaps > Edit > Check URL)" />
            </div>
          ))}
          <button onClick={addFailure} className="text-sm text-muted hover:text-foreground transition-colors">+ Add failure point</button>
          {form.common_failures.length === 0 && (
            <p className="text-xs text-muted italic">No failure points yet. You can skip this step, but recipes with troubleshooting are much more valuable.</p>
          )}
        </div>
      )}

      {/* Step 5: Proof & Story */}
      {step === 5 && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Demo link (optional)</label>
            <input className={inputClass} value={form.demo_link} onChange={(e) => updateField("demo_link", e.target.value)} placeholder="https://myproject.com" />
          </div>
          <div>
            <label className={labelClass}>Video URL (optional)</label>
            <input className={inputClass} value={form.video_url} onChange={(e) => updateField("video_url", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div>
            <label className={labelClass}>Playground snippet (optional)</label>
            <input className={inputClass} value={form.snippet_id} onChange={(e) => updateField("snippet_id", normalizeSnippetId(e.target.value))} placeholder="Snippet ID or playground URL" />
          </div>
          <div>
            <label className={labelClass}>Upload files (optional)</label>
            <input type="file" multiple onChange={(e) => handleFilePick(e.target.files)} className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-tag-bg file:px-2.5 file:py-1 file:text-xs`} />
            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, i) => (
                  <div key={`${file.name}-${i}`} className="flex items-center justify-between rounded-lg border border-border bg-tag-bg/40 px-2.5 py-1.5 text-xs">
                    <span className="truncate mr-3">{file.name} ({Math.ceil(file.size / 1024)} KB)</span>
                    <button type="button" onClick={() => removeSelectedFile(i)} className="text-muted hover:text-foreground">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-medium mb-3">Your story (optional)</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Why I created this recipe</label>
                <textarea className={textareaClass} rows={3} value={form.why_i_built} onChange={(e) => updateField("why_i_built", e.target.value)} placeholder="What motivated you to build this?" />
              </div>
              <div>
                <label className={labelClass}>Lessons learned</label>
                <textarea className={textareaClass} rows={3} value={form.lessons} onChange={(e) => updateField("lessons", e.target.value)} placeholder="What would you tell someone starting today?" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Publish */}
      {step === 6 && (
        <div className="space-y-6">
          <div className="border border-border p-5 rounded-2xl">
            <h3 className="font-semibold text-base">{form.title || "Untitled Recipe"}</h3>
            <p className="text-sm text-muted mt-1">{form.one_liner}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {form.difficulty && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-tag-bg text-tag-text">
                  {form.difficulty.charAt(0).toUpperCase() + form.difficulty.slice(1)}
                </span>
              )}
              {form.estimated_time && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-tag-bg text-tag-text">{form.estimated_time}</span>
              )}
              {form.coding_required && (
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-tag-bg text-tag-text">{form.coding_required}</span>
              )}
              {form.stack_tags.map((tag) => (
                <span key={tag} className="bg-tag-bg text-tag-text px-2 py-0.5 text-xs rounded-full">{tag}</span>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted">
              {form.steps.length} step(s) &middot; {form.prompts.length} prompt(s)
              {form.common_failures.length > 0 && ` · ${form.common_failures.length} troubleshooting point(s)`}
            </div>
          </div>

          {selectedRepo && (
            <p className="text-xs text-muted text-center">
              Linked repo: <span className="font-medium text-foreground">{selectedRepo}</span>
            </p>
          )}

          <button type="button" onClick={handlePublish} disabled={publishing}
            className={`w-full py-3 text-sm font-medium transition-opacity rounded-full ${publishing ? "bg-border text-muted cursor-not-allowed" : "bg-foreground text-background hover:opacity-90"}`}>
            {publishing ? "Publishing..." : "Publish Recipe"}
          </button>
          {publishSuccess && <p className="text-xs text-green-700 text-center">{publishSuccess}</p>}
          {publishError && <p className="text-xs text-red-600 text-center">{publishError}</p>}
          <p className="text-xs text-muted text-center">Publishing is instant. You can edit later.</p>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} className={`text-sm ${step === 0 ? "text-muted cursor-not-allowed" : "text-foreground hover:opacity-70"}`} disabled={step === 0}>
          &larr; Back
        </button>
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(step + 1)} className="text-sm px-5 py-1.5 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity">
            Next &rarr;
          </button>
        )}
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <p className="text-xs text-muted">
          Need inspiration?{" "}
          <Link href="/browse" className="text-accent underline">Browse existing recipes</Link>{" "}
          to see examples.
        </p>
      </div>
    </div>
  );
}
