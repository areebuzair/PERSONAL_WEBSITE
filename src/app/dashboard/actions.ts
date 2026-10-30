'use server';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

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
  const updated = await db
    .update(users)
    .set({
      passwordHash: sql`crypt(${newPassword}, gen_salt('bf', 10))`,
    })
    .where(
      sql`${users.id} = ${session.userId} AND ${users.passwordHash} = crypt(${currentPassword}, ${users.passwordHash})`
    )
    .returning({ id: users.id });

  // If no row was returned, the currentPassword check failed
  if (updated.length === 0) {
    return { error: 'Current password is incorrect.' };
  }

  return { success: 'Password updated successfully.' };
}