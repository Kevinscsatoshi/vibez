"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import {
  ensureRepoWebhook,
  getCurrentUserGithubToken,
  syncProjectFromRepo,
} from "@/lib/github";

type PromptBlock = { label: string; prompt: string; model: string };
type Iteration = { version: string; what_changed: string; result: string };
type Metric = { name: string; value: string; timeframe: string };
type RecipeStep = { order: number; title: string; description: string; prompt: string; tool: string; expected_result: string; tip: string };
type FailurePoint = { symptom: string; cause: string; fix: string };
type RequiredTool = { name: string; url: string; free_tier_available: boolean };

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function sanitizeTags(value: FormDataEntryValue | null): string[] {
  const parsed = parseJsonField<string[]>(value, []);
  return parsed
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 24);
}

function inferFileKind(name: string): "file" | "zip" {
  return name.toLowerCase().endsWith(".zip") ? "zip" : "file";
}

function isRepoFullName(value: string): boolean {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
}

export async function publishProject(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "not_authenticated" };

    let title = (formData.get("title") as string | null)?.trim() ?? "";
    let oneLiner = (formData.get("one_liner") as string | null)?.trim() ?? "";
    let whatIBuilt = (formData.get("what_i_built") as string | null)?.trim() ?? "";
    let whyIBuilt = (formData.get("why_i_built") as string | null)?.trim() ?? "";

    const prompts = parseJsonField<PromptBlock[]>(formData.get("prompts"), []);
    const iterations = parseJsonField<Iteration[]>(formData.get("iterations"), []);
    const metrics = parseJsonField<Metric[]>(formData.get("metrics"), []);
    const stackTags = sanitizeTags(formData.get("stack_tags"));
    const failures = (formData.get("failures") as string | null)?.trim() || null;
    const demoLink = (formData.get("demo_link") as string | null)?.trim() || null;
    const videoUrl = (formData.get("video_url") as string | null)?.trim() || null;
    const lessons = (formData.get("lessons") as string | null)?.trim() || null;
    const snippetId = (formData.get("snippet_id") as string | null)?.trim() || null;

    // Recipe fields
    const difficulty = (formData.get("difficulty") as string | null)?.trim() || null;
    const codingRequired = (formData.get("coding_required") as string | null)?.trim() || null;
    const estimatedTime = (formData.get("estimated_time") as string | null)?.trim() || null;
    const whoIsThisFor = parseJsonField<string[]>(formData.get("who_is_this_for"), []);
    const category = (formData.get("category") as string | null)?.trim() || null;
    const costEstimate = (formData.get("cost_estimate") as string | null)?.trim() || null;
    const outcomeDescription = (formData.get("outcome_description") as string | null)?.trim() || null;
    const steps = parseJsonField<RecipeStep[]>(formData.get("steps"), []);
    const commonFailures = parseJsonField<FailurePoint[]>(formData.get("common_failures"), []);
    const requiredTools = parseJsonField<RequiredTool[]>(formData.get("required_tools"), []);
    const repoFullName = (formData.get("repo_full_name") as string | null)?.trim() || null;
    if (repoFullName && !isRepoFullName(repoFullName)) {
      return { error: "invalid_repo_full_name" };
    }

    if (!title && repoFullName) {
      title = repoFullName.split("/")[1] ?? "Imported Project";
    }
    if (!oneLiner) {
      oneLiner = repoFullName
        ? `Imported from ${repoFullName}`
        : "Shared on VibeZ";
    }
    if (!whatIBuilt) {
      whatIBuilt = repoFullName
        ? `This project is imported from ${repoFullName}.`
        : "Built and shared by the author.";
    }
    if (!whyIBuilt) {
      whyIBuilt = "To share the build process and help other builders learn.";
    }

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert({
        author_id: user.id,
        title,
        one_liner: oneLiner,
        what_i_built: whatIBuilt,
        why_i_built: whyIBuilt,
        prompts,
        iterations,
        failures,
        stack_tags: stackTags,
        demo_link: demoLink,
        video_url: videoUrl,
        metrics,
        lessons,
        snippet_id: snippetId,
        difficulty,
        coding_required: codingRequired,
        estimated_time: estimatedTime,
        who_is_this_for: whoIsThisFor,
        category,
        cost_estimate: costEstimate,
        outcome_description: outcomeDescription,
        steps,
        common_failures: commonFailures,
        required_tools: requiredTools,
        status: "published",
      })
      .select("id")
      .single();

    if (insertError || !project) {
      return { error: insertError?.message ?? "publish_failed" };
    }

    const files = formData.getAll("files");
    if (files.length > 0) {
      for (const entry of files) {
        if (!(entry instanceof File) || entry.size === 0) continue;
        const safeName = entry.name.replaceAll(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${user.id}/${project.id}/${randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("project-assets")
          .upload(path, entry, {
            cacheControl: "3600",
            upsert: false,
            contentType: entry.type || undefined,
          });

        if (uploadError) {
          return { error: `upload_failed:${uploadError.message}` };
        }

        const { error: fileInsertError } = await supabase.from("project_files").insert({
          project_id: project.id,
          author_id: user.id,
          path,
          name: entry.name,
          mime_type: entry.type || null,
          size_bytes: entry.size,
          kind: inferFileKind(entry.name),
        });

        if (fileInsertError) {
          return { error: `file_metadata_failed:${fileInsertError.message}` };
        }
      }
    }

    if (repoFullName) {
      const { error: linkError } = await supabase.from("project_repo_links").insert({
        project_id: project.id,
        user_id: user.id,
        repo_full_name: repoFullName,
      });

      if (linkError) {
        return { error: `repo_link_failed:${linkError.message}` };
      }

      const token = await getCurrentUserGithubToken(user.id);
      if (token) {
        const webhookId = await ensureRepoWebhook(token, repoFullName);
        if (webhookId) {
          await supabase
            .from("project_repo_links")
            .update({ repo_webhook_id: webhookId })
            .eq("project_id", project.id);
        }

        // Sync is best-effort: publish should still succeed even if GitHub API permissions are limited.
        await syncProjectFromRepo(project.id, repoFullName, token, "initial_link_sync");
      }
    }

    revalidatePath("/");
    revalidatePath("/profile/me");
    revalidatePath(`/profile/${user.id}`);
    revalidatePath(`/project/${project.id}`);

    return { id: project.id };
  } catch (error) {
    return {
      error: error instanceof Error ? `publish_unexpected:${error.message}` : "publish_unexpected",
    };
  }
}
