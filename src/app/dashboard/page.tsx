'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, User, Bell, Search, BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

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

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[--color-bg-primary]">
            {/* Header/Navbar */}
            <header className="bg-[--color-bg-secondary] border-b border-[--color-border-subtle] sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-orange rounded-xl flex items-center justify-center shadow-glow-orange">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold">
                                <span className="text-[--color-primary]">Annotation</span>{' '}
                                <span className="text-[--color-text-primary]">Platform</span>
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--color-text-tertiary]" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-[--color-text-secondary] hover:text-[--color-primary] hover:bg-[--color-bg-tertiary] rounded-xl transition-all">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[--color-primary] rounded-full animate-pulse" />
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center gap-3 pl-4 border-l border-[--color-border-subtle]">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || ''}
                                        className="w-10 h-10 rounded-full ring-2 ring-[--color-primary]"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center ring-2 ring-[--color-primary]">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-[--color-text-primary]">
                                        {session.user.name}
                                    </p>
                                    <p className="text-xs text-[--color-text-tertiary] capitalize">
                                        {session.user.role}
                                    </p>
                                </div>
                            </div>

                            {/* Sign Out */}
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="flex items-center gap-2 px-4 py-2 bg-[--color-bg-elevated] border border-[--color-border-default] text-[--color-text-secondary] hover:border-[--color-error] hover:text-[--color-error] rounded-xl transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[--color-text-primary] mb-2">
                        Welcome back, <span className="text-[--color-primary]">{session.user.name}</span>! 👋
                    </h2>
                    <p className="text-[--color-text-secondary]">
                        Here's what's happening with your tasks today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Tasks */}
                    <div className="bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-primary] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-[--color-text-tertiary]">Total Tasks</h3>
                            <BarChart3 className="w-5 h-5 text-[--color-primary] group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-3xl font-bold text-[--color-text-primary] mb-1">0</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[--color-success]">+0%</span>
                            <span className="text-[--color-text-tertiary]">from last week</span>
                        </div>
                    </div>

                    {/* Completed */}
                    <div className="bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-success] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-[--color-text-tertiary]">Completed</h3>
                            <CheckCircle2 className="w-5 h-5 text-[--color-success] group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-3xl font-bold text-[--color-text-primary] mb-1">0</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[--color-success]">+0%</span>
                            <span className="text-[--color-text-tertiary]">completion rate</span>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-warning] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-[--color-text-tertiary]">Pending</h3>
                            <Clock className="w-5 h-5 text-[--color-warning] group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-3xl font-bold text-[--color-text-primary] mb-1">0</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[--color-text-tertiary]">waiting for review</span>
                        </div>
                    </div>

                    {/* Issues */}
                    <div className="bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-error] transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-[--color-text-tertiary]">Issues</h3>
                            <AlertCircle className="w-5 h-5 text-[--color-error] group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-3xl font-bold text-[--color-text-primary] mb-1">0</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[--color-text-tertiary]">need attention</span>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-subtle rounded-[1.5rem] overflow-hidden mb-8">
                    <div className="p-px bg-gradient-orange rounded-[1.5rem]">
                        <div className="bg-[--color-bg-secondary] rounded-[1.5rem] p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center shrink-0 shadow-glow-orange">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-[--color-text-primary] mb-2">
                                        Your Role: <span className="text-[--color-primary] capitalize">{session.user.role}</span>
                                    </h3>
                                    <p className="text-[--color-text-secondary] mb-4">
                                        {session.user.role === 'admin' &&
                                            'You have full access to all features including user management and system settings.'}
                                        {session.user.role === 'annotator' &&
                                            'You can create and edit annotations. Your work will be reviewed before final approval.'}
                                        {session.user.role === 'reviewer' &&
                                            'You can review and approve annotations created by annotators.'}
                                    </p>
                                    <button className="btn-primary">
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="text-left bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-primary] hover:shadow-card-hover transition-all group">
                        <div className="w-12 h-12 bg-[--color-bg-tertiary] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ff57221a] transition-colors">
                            <svg className="w-6 h-6 text-[--color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">Create New Task</h3>
                        <p className="text-sm text-[--color-text-tertiary]">Start a new annotation task</p>
                    </button>

                    <button className="text-left bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-primary] hover:shadow-card-hover transition-all group">
                        <div className="w-12 h-12 bg-[--color-bg-tertiary] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ff57221a] transition-colors">
                            <svg className="w-6 h-6 text-[--color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">View All Tasks</h3>
                        <p className="text-sm text-[--color-text-tertiary]">Browse your task history</p>
                    </button>

                    <button className="text-left bg-[--color-bg-secondary] border border-[--color-border-subtle] rounded-[1.5rem] p-6 hover:border-[--color-primary] hover:shadow-card-hover transition-all group">
                        <div className="w-12 h-12 bg-[--color-bg-tertiary] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ff57221a] transition-colors">
                            <svg className="w-6 h-6 text-[--color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[--color-text-primary] mb-2">View Analytics</h3>
                        <p className="text-sm text-[--color-text-tertiary]">Check your performance</p>
                    </button>
                </div>
            </main>
        </div>
    );
}