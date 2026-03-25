import { createClient } from "@/lib/supabase-server";
import { getAppOrigin } from "@/lib/app-origin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = getAppOrigin(request);

  if (!code) {
    return NextResponse.redirect(`${origin}/create?github_error=missing_code`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/create?github_error=missing_oauth_config`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/signin?next=/create`);
  }

  const tokenResp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${origin}/api/github/callback`,
    }),
    cache: "no-store",
  });

  const tokenJson = (await tokenResp.json()) as {
    access_token?: string;
    token_type?: string;
    scope?: string;
    error?: string;
  };

  if (!tokenResp.ok || !tokenJson.access_token) {
    return NextResponse.redirect(
      `${origin}/create?github_error=${encodeURIComponent(
        tokenJson.error ?? "token_exchange_failed"
      )}`
    );
  }

  const userResp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!userResp.ok) {
    return NextResponse.redirect(`${origin}/create?github_error=user_fetch_failed`);
  }

  const githubUser = (await userResp.json()) as {
    id: number;
    login: string;
  };

  const { error } = await supabase.from("github_connections").upsert({
    user_id: user.id,
    github_user_id: githubUser.id,
    github_login: githubUser.login,
    access_token: tokenJson.access_token,
    token_type: tokenJson.token_type ?? null,
    scope: tokenJson.scope ?? null,
  });

  if (error) {
    return NextResponse.redirect(
      `${origin}/create?github_error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/create?github_connected=1`);
}
