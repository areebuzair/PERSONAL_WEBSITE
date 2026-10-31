// src/lib/auth.ts
import { serverEnv } from '@/data/serverEnv';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(serverEnv.JWT_SECRET);
const CURRENT_VERSION = serverEnv.SESSION_VERSION;

export const COOKIE_NAME = 'auth_session';
export const INACTIVITY_LIMIT_DAYS = 7;
export const INACTIVITY_LIMIT_SECONDS = 60 * 60 * 24 * INACTIVITY_LIMIT_DAYS;

export interface SessionPayload {
  userId: number;
  email: string;
  version: string;
}

export async function signToken(payload: Omit<SessionPayload, 'version'>): Promise<string> {
  return new SignJWT({ ...payload, version: CURRENT_VERSION })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${INACTIVITY_LIMIT_DAYS}d`)
    .sign(secretKey);
}

// src/lib/auth.ts
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: INACTIVITY_LIMIT_SECONDS, // keep equal to the JWT expiry in signToken
  });
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    const session = payload as unknown as SessionPayload;

    // External revocation check: if SESSION_VERSION was bumped in Vercel, reject immediately
    if (session.version !== CURRENT_VERSION) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}