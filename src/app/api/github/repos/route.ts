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
    return NextResponse.json(
      {
        connected: true,
        repos: [],
        error: error instanceof Error ? error.message : "repo_fetch_failed",
      },
      { status: 500 }
    );
  }
}
