// src/lib/auth.ts
import { serverEnv } from '@/data/serverEnv';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/db/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const secretKey = new TextEncoder().encode(serverEnv.JWT_SECRET);
export const COOKIE_NAME = 'auth_session';

export interface SessionPayload {
  userId: number;
  email: string;
  updatedAtMs: number; // Unix epoch in milliseconds from users.updatedAt
}

// src/lib/auth.ts
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // keep equal to the JWT expiry in signToken
  });
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

// Fast cryptographic check (used in Middleware)
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Strict database-verified check (used in Server Components, Server Actions & API Routes)
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  // Query Neon to ensure the user's updatedAt hasn't changed since this JWT was issued
  const [user] = await db
    .select({ updatedAt: users.updatedAt })
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (!user || user.updatedAt.getTime() !== payload.updatedAtMs) {
    return null; // Password was changed after this token was minted -> reject session
  }

  return payload;
}