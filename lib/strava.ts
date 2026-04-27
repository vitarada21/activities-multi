import { getSession } from "@/lib/session";

export type StravaActivity = {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date_local: string;
  average_speed: number;
  kudos_count: number;
  map?: {
    id?: string;
    summary_polyline?: string | null;
  };
};

export async function getValidAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session.refreshToken) return null;

  const now = Math.floor(Date.now() / 1000);
  if (session.accessToken && (session.expiresAt ?? 0) > now + 60) {
    return session.accessToken;
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Server missing Strava credentials");
  }

  const res = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Strava token refresh failed: ${res.status} ${await res.text()}`,
    );
  }

  const data = await res.json();
  session.accessToken = data.access_token;
  session.refreshToken = data.refresh_token;
  session.expiresAt = data.expires_at;
  await session.save();
  return data.access_token;
}

export async function getActivities(
  token: string,
  perPage = 30,
): Promise<StravaActivity[]> {
  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(
      `Strava activities fetch failed: ${res.status} ${await res.text()}`,
    );
  }

  return (await res.json()) as StravaActivity[];
}

export async function getActivitiesSince(
  token: string,
  afterEpochSeconds: number,
): Promise<StravaActivity[]> {
  const all: StravaActivity[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${afterEpochSeconds}&per_page=${perPage}&page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(
        `Strava activities fetch failed: ${res.status} ${await res.text()}`,
      );
    }

    const batch = (await res.json()) as StravaActivity[];
    all.push(...batch);
    if (batch.length < perPage) break;
    page++;
    if (page > 10) break;
  }

  return all;
}
