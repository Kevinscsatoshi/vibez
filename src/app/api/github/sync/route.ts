import { getCurrentUserGithubToken, syncProjectFromRepo } from "@/lib/github";
import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = (await request.json()) as { projectId?: string };
  const projectId = body.projectId;
  if (!projectId) {
    return NextResponse.json({ error: "missing_project_id" }, { status: 400 });
  }

  if (!/^[0-9a-fA-F-]{36}$/.test(projectId)) {
    return NextResponse.json({ error: "invalid_project_id" }, { status: 400 });
  }

  const { data: link } = await supabase
    .from("project_repo_links")
    .select("repo_full_name, user_id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!link) {
    return NextResponse.json({ error: "repo_not_linked" }, { status: 404 });
  }

  const token = await getCurrentUserGithubToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "github_not_connected" }, { status: 400 });
  }

  const result = await syncProjectFromRepo(projectId, link.repo_full_name, token, "manual_sync");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
