'use client';

import { signIn } from 'next-auth/react';
import { Chrome, Github } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Annotation Platform
                    </h1>
                    <p className="text-gray-600">
                        Sign in to start annotating data
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        <Chrome className="w-5 h-5" />
                        <span className="font-medium">Continue with Google</span>
                    </button>

                    <button
                        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
                    >
                        <Github className="w-5 h-5" />
                        <span className="font-medium">Continue with GitHub</span>
                    </button>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                </div>
            </div>
        </div>
    );
}