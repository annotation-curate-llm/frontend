'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        // Check role-based access
        if (status === 'authenticated' && allowedRoles && allowedRoles.length > 0) {
            const userRole = session?.user?.role;

            if (!userRole || !allowedRoles.includes(userRole)) {
                // Redirect to 403 Forbidden page
                router.push('/403');
            }
        }
    }, [status, session, allowedRoles, router]);

    // Show loading state while checking authentication
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[--color-bg-primary] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[--color-primary] border-t-transparent"></div>
                    <p className="text-[--color-text-secondary]">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (status === 'unauthenticated') {
        return null;
    }

    // Don't render if user doesn't have required role
    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = session?.user?.role;
        if (!userRole || !allowedRoles.includes(userRole)) {
            return null;
        }
    }

    return <>{children}</>;
}