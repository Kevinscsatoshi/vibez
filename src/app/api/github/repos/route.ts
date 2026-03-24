import { listUserRepos } from "@/lib/github";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: conn } = await supabase
    .from("github_connections")
    .select("access_token")
    .eq("user_id", user.id)
    .single();

  if (!conn?.access_token) {
    return NextResponse.json({ repos: [], connected: false });
  }

  try {
    const repos = await listUserRepos(conn.access_token);
    return NextResponse.json({
      connected: true,
      repos: repos
        .filter((repo) => !repo.private)
        .map((repo) => ({
          full_name: repo.full_name,
          name: repo.name,
          html_url: repo.html_url,
          default_branch: repo.default_branch,
          description: repo.description,
        })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "repo_fetch_failed";
    const isBadCredentials =
      message.includes("GitHub API 401") || message.includes("Bad credentials");

    if (isBadCredentials) {
      // Access token was revoked/expired or OAuth app credentials changed.
      // Remove stale connection so UI can prompt a clean reconnect flow.
      await supabase.from("github_connections").delete().eq("user_id", user.id);
      return NextResponse.json(
        {
          connected: false,
          repos: [],
          error: "github_reconnect_required",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        connected: true,
        repos: [],
        error: message,
      },
      { status: 500 }
    );
  }
}
