import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase-admin";
import { syncProjectFromRepo } from "@/lib/github";
import { NextResponse } from "next/server";

type GithubPushPayload = {
  repository?: {
    full_name?: string;
  };
};

function verifySignature(body: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expected = Buffer.from(
    `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`,
    "utf8"
  );
  const received = Buffer.from(signatureHeader, "utf8");
  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "missing_webhook_secret" }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event !== "push") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const payload = JSON.parse(rawBody) as GithubPushPayload;
  const repoFullName = payload.repository?.full_name;
  if (!repoFullName) {
    return NextResponse.json({ error: "missing_repo" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: links, error } = await admin
    .from("project_repo_links")
    .select("project_id, user_id, repo_full_name")
    .eq("repo_full_name", repoFullName);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!links || links.length === 0) {
    return NextResponse.json({ ok: true, synced: 0 });
  }

  let synced = 0;
  for (const link of links) {
    const { data: connection } = await admin
      .from("github_connections")
      .select("access_token")
      .eq("user_id", link.user_id)
      .single();

    if (!connection?.access_token) continue;

    const result = await syncProjectFromRepo(
      link.project_id,
      repoFullName,
      connection.access_token,
      "webhook_push",
      payload
    );
    if (result.ok) synced += 1;
  }

  return NextResponse.json({ ok: true, synced });
}
