'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f4433610] border-2 border-[--color-error] rounded-[1.5rem] mb-6">
                    <ShieldAlert className="w-10 h-10 text-[--color-error]" />
                </div>

                {/* Error Code */}
                <h1 className="text-6xl font-bold text-[--color-primary] mb-4">403</h1>

                {/* Title */}
                <h2 className="text-2xl font-bold text-[--color-text-primary] mb-4">
                    Access Denied
                </h2>

                {/* Description */}
                <p className="text-[--color-text-secondary] mb-8">
                    You don't have permission to access this page. 
                    Please contact your administrator if you believe this is an error.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[--color-bg-secondary] border border-[--color-border-default] text-[--color-text-primary] rounded-xl hover:border-[--color-primary] hover:bg-[--color-bg-tertiary] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="btn-primary"
                    >
                        Go to Dashboard
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-xl">
                    <p className="text-sm text-[--color-text-tertiary]">
                        Need help? Contact support at{' '}
                        <a href="mailto:support@annotationplatform.com" className="text-[--color-primary] hover:underline">
                            support@annotationplatform.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}