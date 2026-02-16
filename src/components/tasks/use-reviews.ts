import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Review, ReviewCreate, ReviewWithDetails, ReviewStatus } from '@/types/review';

// Query Keys
export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (filters?: any) => [...reviewKeys.lists(), filters] as const,
    details: () => [...reviewKeys.all, 'detail'] as const,
    detail: (id: string) => [...reviewKeys.details(), id] as const,
    pending: () => [...reviewKeys.all, 'pending'] as const,
};

// Get pending reviews
export function usePendingReviews() {
    return useQuery({
        queryKey: reviewKeys.pending(),
        queryFn: async () => {
            const { data } = await api.get<ReviewWithDetails[]>('/reviews/pending');
            return data;
        },
    });
}

// Get single review
export function useReview(id: string) {
    return useQuery({
        queryKey: reviewKeys.detail(id),
        queryFn: async () => {
            const { data } = await api.get<Review>(`/reviews/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

// Create review (approve/reject)
export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (review: ReviewCreate) => {
            const { data } = await api.post<Review>('/reviews/', review);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.pending() });
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
        },
    });
}