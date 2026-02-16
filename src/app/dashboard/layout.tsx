'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types/user';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (!session) return null;

    const user = {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        avatar_url: session.user.image || undefined,
        provider: 'google',
        provider_id: session.user.id || '',
        role: session.user.role as UserRole,
        is_active: true,
        created_at: new Date().toISOString(),
    };

    return (
        <DashboardLayout user={user} onSignOut={() => signOut({ callbackUrl: '/' })}>
            {children}
        </DashboardLayout>
    );
}