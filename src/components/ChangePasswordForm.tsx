// src/components/ChangePasswordForm.tsx
'use client';

import { useActionState } from 'react';
import { changePasswordAction } from '@/app/dashboard/actions';

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, null);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
      <h2 className="text-lg font-bold">Change Password</h2>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-emerald-500">{state.success}</p>
      )}

      <div>
        <label className="block text-sm mb-1" htmlFor="currentPassword">
          Current Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border px-3 py-2 rounded bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="newPassword">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border px-3 py-2 rounded bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="confirmPassword">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border px-3 py-2 rounded bg-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-white text-black font-medium py-2 rounded disabled:opacity-50"
      >
        {isPending ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}