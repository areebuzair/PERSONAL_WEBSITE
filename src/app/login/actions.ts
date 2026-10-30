// src/app/login/actions.ts
'use server';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { signToken, COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  // Verify credentials inside Postgres using pgcrypto's crypt()
  const [matchedUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      sql`${users.email} = ${email} AND ${users.passwordHash} = crypt(${password}, ${users.passwordHash})`
    )
    .limit(1);

  if (!matchedUser) {
    return { error: 'Invalid credentials.' };
  }

  const token = await signToken({
    userId: matchedUser.id,
    email: matchedUser.email,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/login');
}