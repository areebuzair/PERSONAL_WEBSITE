// src/app/login/page.tsx
'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form action={formAction} className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-bold">Sign In</h1>

        {state?.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            required
            className="w-full border px-3 py-2 rounded bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border px-3 py-2 rounded bg-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-white text-black font-medium py-2 rounded disabled:opacity-50"
        >
          {isPending ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </main>
  );
}