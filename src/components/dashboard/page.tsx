'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User } from 'lucide-react';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || ''}
                                        className="w-8 h-8 rounded-full"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {session.user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {session.user.role}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Total Tasks
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Completed
                        </h3>
                        <p className="text-3xl font-bold text-green-600">0</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Pending
                        </h3>
                        <p className="text-3xl font-bold text-orange-600">0</p>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Welcome, {session.user.name}! 👋
                    </h2>
                    <p className="text-gray-600">
                        You're logged in as <span className="font-medium">{session.user.role}</span>.
                        Your dashboard will show your tasks and progress here.
                    </p>
                </div>
            </main>
        </div>
    );
}