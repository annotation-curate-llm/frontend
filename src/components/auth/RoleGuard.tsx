'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user role
 * 
 * Usage:
 * <RoleGuard allowedRoles={['admin']}>
 *   <AdminOnlyButton />
 * </RoleGuard>
 */
export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { data: session, status } = useSession();

    // Don't render anything while loading
    if (status === 'loading') {
        return null;
    }

    // Don't render if not authenticated
    if (status === 'unauthenticated') {
        return <>{fallback}</>;
    }

    // Check if user has required role
    const userRole = session?.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}