import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

type RepoMetadata = {
  full_name: string;
  html_url: string;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
};

const GITHUB_API_BASE = "https://api.github.com";

async function githubRequest<T>(
  path: string,
  accessToken: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

export async function getCurrentUserGithubToken(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("github_connections")
    .select("access_token")
    .eq("user_id", userId)
    .single();

  return data?.access_token ?? null;
}

export async function listUserRepos(accessToken: string) {
  return githubRequest<
    Array<{
      full_name: string;
      name: string;
      private: boolean;
      html_url: string;
      default_branch: string;
      description: string | null;
    }>
  >("/user/repos?per_page=100&sort=updated&direction=desc", accessToken);
}

export async function fetchRepoMetadata(
  accessToken: string,
  repoFullName: string
): Promise<RepoMetadata> {
  return githubRequest<RepoMetadata>(`/repos/${repoFullName}`, accessToken);
}

export async function fetchRepoReadme(
  accessToken: string,
  repoFullName: string
): Promise<string | null> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${repoFullName}/readme`, {
    headers: {
      Accept: "application/vnd.github.raw+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub README ${response.status}: ${text}`);
  }
  return response.text();
}

export async function ensureRepoWebhook(
  accessToken: string,
  repoFullName: string
): Promise<number | null> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
  const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!appUrl || !webhookSecret) return null;

  const targetUrl = `${appUrl}/api/github/webhook`;
  let existingHooks: Array<{ id: number; config?: { url?: string }; events?: string[] }> =
    [];
  try {
    existingHooks = await githubRequest<
      Array<{ id: number; config?: { url?: string }; events?: string[] }>
    >(`/repos/${repoFullName}/hooks`, accessToken);
  } catch {
    // Some tokens can read repo metadata but cannot manage/list webhooks.
    // Webhook is best-effort and should never block publish flow.
    return null;
  }

  const existing = existingHooks.find((hook) => hook.config?.url === targetUrl);
  if (existing) return existing.id;

  try {
    const created = await githubRequest<{ id: number }>(
      `/repos/${repoFullName}/hooks`,
      accessToken,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "web",
          active: true,
          events: ["push"],
          config: {
            url: targetUrl,
            content_type: "json",
            insecure_ssl: "0",
            secret: webhookSecret,
          },
        }),
      }
    );
    return created.id;
  } catch {
    return null;
  }
}

export async function syncProjectFromRepo(
  projectId: string,
  repoFullName: string,
  accessToken: string,
  eventType: string,
  payload?: unknown
) {
  try {
    const admin = createAdminClient();
    const repo = await fetchRepoMetadata(accessToken, repoFullName);
    const readme = await fetchRepoReadme(accessToken, repoFullName);

    const { error: updateError } = await admin
      .from("projects")
      .update({
        github_repo_url: repo.html_url,
        github_repo_name: repo.name,
        github_repo_description: repo.description,
        github_repo_language: repo.language,
        github_repo_stars: repo.stargazers_count,
        github_repo_updated_at: repo.updated_at,
        github_readme: readme,
      })
      .eq("id", projectId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    await admin
      .from("project_repo_links")
      .update({
        repo_default_branch: repo.default_branch,
        last_synced_at: new Date().toISOString(),
      })
      .eq("project_id", projectId);

    await admin.from("project_sync_events").insert({
      project_id: projectId,
      repo_full_name: repoFullName,
      event_type: eventType,
      success: true,
      message: "Synced successfully",
      payload: payload ?? null,
    });

    return { ok: true as const };
  } catch (error) {
    try {
      const admin = createAdminClient();
      await admin.from("project_sync_events").insert({
        project_id: projectId,
        repo_full_name: repoFullName,
        event_type: eventType,
        success: false,
        message: error instanceof Error ? error.message : "Unknown sync error",
        payload: payload ?? null,
      });
    } catch {
      // no-op: logging should never break publish/sync response
    }
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Unknown sync error",
    };
  }
}
