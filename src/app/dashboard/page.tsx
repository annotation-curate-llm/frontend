'use client';

import { useSession } from 'next-auth/react';
import { BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { useMyTasks } from '@/hooks/use-tasks';
import { TaskStatus } from '@/types/task';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: session } = useSession();
    const { data: allTasks, isLoading } = useMyTasks();

    if (!session) return null;

    const role = session.user.role;

    const stats = {
        total: allTasks?.length || 0,
        completed: allTasks?.filter(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.REVIEWED).length || 0,
        inProgress: allTasks?.filter(t => t.status === TaskStatus.IN_PROGRESS).length || 0,
        pending: allTasks?.filter(t => t.status === TaskStatus.ASSIGNED).length || 0,
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const roleConfig = {
        admin: { label: 'Admin', color: 'text-error', bg: 'bg-error/10 border-error/20' },
        reviewer: { label: 'Reviewer', color: 'text-info', bg: 'bg-info/10 border-info/20' },
        annotator: { label: 'Annotator', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
    };

    const currentRole = roleConfig[role as keyof typeof roleConfig] || roleConfig.annotator;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-bold text-text-primary">
                            Welcome back, <span className="text-primary">{session.user.name}</span>!
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${currentRole.bg} ${currentRole.color}`}>
                            {currentRole.label}
                        </span>
                    </div>
                    <p className="text-text-secondary">
                        Here's what's happening with your tasks today.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Total Tasks</h3>
                        <BarChart3 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary mb-1">
                        {isLoading ? '...' : stats.total}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-tertiary">all assigned tasks</span>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-success transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Completed</h3>
                        <CheckCircle2 className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-success mb-1">
                        {isLoading ? '...' : stats.completed}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-success">{completionRate}%</span>
                        <span className="text-text-tertiary">completion rate</span>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-warning transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">In Progress</h3>
                        <Zap className="w-5 h-5 text-warning group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-warning mb-1">
                        {isLoading ? '...' : stats.inProgress}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-tertiary">actively working</span>
                    </div>
                </div>

                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-info transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Pending</h3>
                        <Clock className="w-5 h-5 text-info group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-info mb-1">
                        {isLoading ? '...' : stats.pending}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-tertiary">waiting to start</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            {stats.total > 0 && (
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Overall Progress
                        </h3>
                        <span className="text-sm font-bold text-primary">{completionRate}%</span>
                    </div>
                    <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-text-tertiary">
                        <span>{stats.completed} completed</span>
                        <span>{stats.total} total</span>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(role === 'admin' || role === 'reviewer') && (
                        <Link href="/dashboard/reviews">
                            <div className="text-left bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all group cursor-pointer">
                                <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-text-primary mb-1">Review Queue</h3>
                                <p className="text-sm text-text-tertiary">Review pending annotations</p>
                            </div>
                        </Link>
                    )}

                    <Link href="/dashboard/my-tasks">
                        <div className="text-left bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all group cursor-pointer">
                            <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">My Tasks</h3>
                            <p className="text-sm text-text-tertiary">View and manage your tasks</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/profile">
                        <div className="text-left bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all group cursor-pointer">
                            <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">View Analytics</h3>
                            <p className="text-sm text-text-tertiary">Check your full performance</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}