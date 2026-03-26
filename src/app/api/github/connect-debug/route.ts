import { getAppOrigin } from "@/lib/app-origin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const origin = getAppOrigin(request);
  const redirectUri = `${origin}/api/github/callback`;
  const clientId = process.env.GITHUB_CLIENT_ID ?? "";
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "read:user repo admin:repo_hook");
  authUrl.searchParams.set("allow_signup", "true");

  return NextResponse.json({
    origin,
    redirect_uri: redirectUri,
    client_id_prefix: clientId.slice(0, 6),
    authorize_url: authUrl.toString(),
  });
}
