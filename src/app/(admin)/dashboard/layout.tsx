// src/app/dashboard/layout.tsx

export const instant = false;

export default async function DashboardLayout({ 
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="container mx-auto p-5">{children}</main>;
}