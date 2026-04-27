import type { SessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type StravaAthlete = {
  id: number;
  firstname?: string;
  lastname?: string;
  username?: string;
  profile?: string;
};

export type SessionData = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  athlete?: StravaAthlete;
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long_change_me",
  cookieName: "strava-visualizer-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
