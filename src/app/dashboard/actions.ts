'use server';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { COOKIE_NAME, getSession, setSessionCookie, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export interface PasswordActionState {
  error?: string;
  success?: string;
}

export async function changePasswordAction(
  _prevState: PasswordActionState | null,
  formData: FormData
): Promise<PasswordActionState> {
  // 1. Verify active session
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized. Please log in again.' };
  }

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // 2. Basic input validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' };
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.' };
  }

  if (currentPassword === newPassword) {
    return { error: 'New password must be different from the current password.' };
  }

  // 3. Atomic verify + update inside Neon via pgcrypto
  const [updatedUser] = await db
  .update(users)
  .set({
    passwordHash: sql`crypt(${newPassword}, gen_salt('bf', 10))`,
    // Drizzle's .$onUpdate(() => sql`now()`) automatically updates updated_at here
  })
  .where(
    sql`${users.id} = ${session.userId} AND ${users.passwordHash} = crypt(${currentPassword}, ${users.passwordHash})`
  )
  .returning({
    id: users.id,
    email: users.email,
    updatedAt: users.updatedAt,
  });

if (!updatedUser) {
  return { error: 'Current password is incorrect.' };
}

// Re-issue cookie for the current device with the new updatedAtMs
const freshToken = await signToken({
  userId: updatedUser.id,
  email: updatedUser.email,
  updatedAtMs: updatedUser.updatedAt.getTime(),
});

await setSessionCookie(freshToken);

return { success: 'Password updated and all other sessions invalidated.' };
}