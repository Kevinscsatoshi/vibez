import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

function getAppOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/signin?next=/create", request.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(new URL("/create?github_error=missing_client_id", request.url));
  }

  const origin = getAppOrigin(request);
  const redirectUri = `${origin}/api/github/callback`;
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "read:user repo");
  authUrl.searchParams.set("allow_signup", "true");

  return NextResponse.redirect(authUrl);
}
