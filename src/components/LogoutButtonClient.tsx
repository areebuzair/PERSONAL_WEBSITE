// src/components/LogoutButtonClient.tsx
'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/app/login/actions';

export function LogoutButtonClient() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => logoutAction())}
      disabled={isPending}
      className="border px-3 py-1.5 rounded text-sm hover:bg-neutral-800 disabled:opacity-50"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}