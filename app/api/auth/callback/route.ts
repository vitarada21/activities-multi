import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, url.origin),
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new NextResponse("Server missing Strava credentials", { status: 500 });
  }

  const tokenRes = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return new NextResponse(
      `Token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`,
      { status: 500 },
    );
  }

  const data = await tokenRes.json();
  const session = await getSession();
  session.accessToken = data.access_token;
  session.refreshToken = data.refresh_token;
  session.expiresAt = data.expires_at;
  session.athlete = data.athlete
    ? {
        id: data.athlete.id,
        firstname: data.athlete.firstname,
        lastname: data.athlete.lastname,
        username: data.athlete.username,
        profile: data.athlete.profile,
      }
    : undefined;
  await session.save();

  return NextResponse.redirect(new URL("/", url.origin));
}
