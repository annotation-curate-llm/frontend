'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Loader2, ExternalLink, Eye, ArrowRight } from 'lucide-react';
import { usePendingReviews, useCreateReview } from '@/hooks/use-reviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { ReviewStatus, ReviewWithDetails } from '@/types/review';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function ReviewQueuePage() {
    const [selectedReview, setSelectedReview] = useState<ReviewWithDetails | null>(null);
    const [comments, setComments] = useState('');
    const [reviewAction, setReviewAction] = useState<ReviewStatus | null>(null);
    const [showExportPrompt, setShowExportPrompt] = useState(false);

    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === 'admin';

    const { data: reviews, isLoading, error } = usePendingReviews();
    const createReview = useCreateReview();

    const handleReview = (review: ReviewWithDetails, action: ReviewStatus) => {
        setSelectedReview(review);
        setReviewAction(action);
        setComments('');
    };

    const submitReview = async () => {
        if (!selectedReview || !reviewAction) return;

        createReview.mutate(
            {
                annotation_id: selectedReview.annotation_id,
                status: reviewAction,
                comments: comments.trim() || undefined,
            },
            {
                onSuccess: () => {
                    setSelectedReview(null);
                    setReviewAction(null);
                    setComments('');

                    // If approved and user is admin, show export prompt
                    if (reviewAction === ReviewStatus.APPROVED && isAdmin) {
                        setShowExportPrompt(true);
                    }
                },
            }
        );
    };

    const pendingCount = reviews?.length || 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-error mb-2">Failed to load reviews</p>
                    <p className="text-sm text-text-tertiary">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Review Queue</h1>
                    <p className="text-text-secondary">
                        Review and approve annotations from annotators
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard/exports')}
                        >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Go to Exports
                        </Button>
                    )}
                    <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                        <p className="text-sm text-text-tertiary">Pending Reviews</p>
                        <p className="text-3xl font-bold text-primary">{pendingCount}</p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            {reviews && reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review: ReviewWithDetails) => (
                        <div
                            key={review.id}
                            className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all"
                        >
                            <div className="flex items-start gap-6">
                                {/* Preview */}
                                <div className="w-48 h-48 bg-bg-tertiary rounded-xl overflow-hidden shrink-0">
                                    {review.file_url && (
                                        <img
                                            src={review.file_url}
                                            alt={review.file_name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-text-primary mb-1">
                                                {review.file_name}
                                            </h3>
                                            <p className="text-sm text-text-tertiary">
                                                Submitted {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                window.open(
                                                    `${process.env.NEXT_PUBLIC_LABEL_STUDIO_URL || 'http://localhost:8080'}/tasks/${review.task_id}`,
                                                    '_blank'
                                                )
                                            }
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Open in Label Studio
                                        </Button>
                                    </div>

                                    {/* Annotation Preview */}
                                    <div className="p-4 bg-bg-tertiary rounded-xl mb-4">
                                        <p className="text-xs text-text-tertiary mb-2">Annotation Data:</p>
                                        <pre className="text-xs text-text-primary overflow-x-auto max-h-32">
                                            {JSON.stringify(review.annotation_data, null, 2)}
                                        </pre>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <Button
                                            onClick={() => handleReview(review, ReviewStatus.APPROVED)}
                                            className="bg-success hover:bg-success/90"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReview(review, ReviewStatus.REJECTED)}
                                            variant="destructive"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 bg-bg-secondary border border-border-subtle rounded-2xl text-center">
                    <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No Pending Reviews</h3>
                    <p className="text-text-secondary mb-6">All annotations have been reviewed. Great job!</p>
                    {isAdmin && (
                        <Button onClick={() => router.push('/dashboard/exports')}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Go to Exports
                        </Button>
                    )}
                </div>
            )}

            {/* Review Confirmation Dialog */}
            <Dialog
                open={selectedReview !== null}
                onOpenChange={() => {
                    setSelectedReview(null);
                    setReviewAction(null);
                    setComments('');
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {reviewAction === ReviewStatus.APPROVED ? (
                                <span className="flex items-center gap-2 text-success">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Approve Annotation
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-error">
                                    <XCircle className="w-5 h-5" />
                                    Reject Annotation
                                </span>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {reviewAction === ReviewStatus.APPROVED
                                ? 'This annotation will be marked as approved and ready for export.'
                                : 'This annotation will be rejected and reassigned to the annotator for correction.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Label htmlFor="comments">
                            Comments {reviewAction === ReviewStatus.REJECTED && <span className="text-error">(Required)</span>}
                        </Label>
                        <Textarea
                            id="comments"
                            placeholder={
                                reviewAction === ReviewStatus.APPROVED
                                    ? 'Add feedback (optional)...'
                                    : 'Explain what needs to be fixed...'
                            }
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            className="mt-2"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => { setSelectedReview(null); setReviewAction(null); setComments(''); }}
                            disabled={createReview.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitReview}
                            disabled={
                                createReview.isPending ||
                                (reviewAction === ReviewStatus.REJECTED && !comments.trim())
                            }
                            variant={reviewAction === ReviewStatus.APPROVED ? 'default' : 'destructive'}
                        >
                            {createReview.isPending ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                            ) : reviewAction === ReviewStatus.APPROVED ? (
                                <><CheckCircle2 className="w-4 h-4 mr-2" />Approve</>
                            ) : (
                                <><XCircle className="w-4 h-4 mr-2" />Reject</>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export Prompt Dialog — shown after admin approves */}
            <Dialog open={showExportPrompt} onOpenChange={setShowExportPrompt}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-success">
                            <CheckCircle2 className="w-5 h-5" />
                            Annotation Approved!
                        </DialogTitle>
                        <DialogDescription>
                            This annotation is now ready for export. Would you like to go to the exports page?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setShowExportPrompt(false)}>
                            Stay Here
                        </Button>
                        <Button onClick={() => { setShowExportPrompt(false); router.push('/dashboard/exports'); }}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Go to Exports
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}