import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("Missing STRAVA_CLIENT_ID", { status: 500 });
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback`;

  const authUrl = new URL("https://www.strava.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("approval_prompt", "auto");
  authUrl.searchParams.set("scope", "read,activity:read_all,profile:read_all");

  return NextResponse.redirect(authUrl);
}
