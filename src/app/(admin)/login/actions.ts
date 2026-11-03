// src/app/login/actions.ts
'use server';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { signToken, COOKIE_NAME, setSessionCookie } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(_prevState: unknown, formData: FormData) {
  const emailValue = formData.get('email');
  const passwordValue = formData.get('password');

  if (typeof emailValue !== 'string' || typeof passwordValue !== 'string') {
    return { error: 'Email and password are required.' };
  }

  const email = emailValue.trim().toLowerCase();
  const password = passwordValue;

  // Verify credentials inside Postgres using pgcrypto's crypt()
  // src/app/login/actions.ts (inside loginAction)
  const [matchedUser] = await db
    .select({
      id: users.id,
      email: users.email,
      updatedAt: users.updatedAt,
    })
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

  await setSessionCookie(token);

  redirect('/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/login');
}