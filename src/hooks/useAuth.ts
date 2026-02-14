import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { User } from '@/types/user';

/**
 * Hook to get current user from session
 */
export function useUser() {
    const { data: session, status } = useSession();

    return {
        user: session?.user,
        isLoading: status === 'loading',
        isAuthenticated: status === 'authenticated',
    };
}

/**
 * Hook to get backend JWT token from session
 */
export function useBackendToken() {
    const { data: session } = useSession();
    // @ts-ignore - backendToken is custom property
    return session?.backendToken as string | undefined;
}

/**
 * Hook to verify token with backend
 * Useful for checking if user still has valid access
 */
export function useVerifyToken() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: ['verify-token'],
        queryFn: async () => {
            const response = await api.get('/auth/verify');
            return response.data;
        },
        enabled: !!session,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Hook to get full user details from backend
 * This fetches the complete user object with all fields
 */
export function useUserDetails() {
    const { data: session } = useSession();

    return useQuery<User>({
        queryKey: ['user-details', session?.user?.id],
        queryFn: async () => {
            const response = await api.get(`/users/${session?.user?.id}`);
            return response.data;
        },
        enabled: !!session?.user?.id,
        staleTime: 10 * 60 * 1000,
    });
}

/**
 * Type guard to check if user has a specific role
 */
export function useHasRole(allowedRoles: string[]) {
    const { user } = useUser();

    if (!user?.role) return false;

    return allowedRoles.includes(user.role);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
    return useHasRole(['admin']);
}

/**
 * Hook to check if user is annotator
 */
export function useIsAnnotator() {
    return useHasRole(['annotator']);
}

/**
 * Hook to check if user is reviewer
 */
export function useIsReviewer() {
    return useHasRole(['reviewer']);
}