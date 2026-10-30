// src/app/dashboard/layout.tsx
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const instant = false

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/api/auth/logout');  
    }

    return <>{children}</>;
}