'use client';

import { useSession } from 'next-auth/react';
import { BarChart3, CheckCircle2, Clock, AlertCircle, User } from 'lucide-react';

export default function DashboardPage() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <>
            {/* Welcome Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                    Welcome back, <span className="text-primary">{session.user.name}</span>! 👋
                </h2>
                <p className="text-text-secondary">
                    Here's what's happening with your tasks today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Tasks */}
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Total Tasks</h3>
                        <BarChart3 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary mb-1">0</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-success">+0%</span>
                        <span className="text-text-tertiary">from last week</span>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-success transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Completed</h3>
                        <CheckCircle2 className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary mb-1">0</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-success">+0%</span>
                        <span className="text-text-tertiary">completion rate</span>
                    </div>
                </div>

                {/* Pending */}
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-warning transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Pending</h3>
                        <Clock className="w-5 h-5 text-warning group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary mb-1">0</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-tertiary">waiting for review</span>
                    </div>
                </div>

                {/* Issues */}
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-error transition-all group hover:shadow-card-hover">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-text-tertiary">Issues</h3>
                        <AlertCircle className="w-5 h-5 text-error group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-3xl font-bold text-text-primary mb-1">0</p>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-tertiary">need attention</span>
                    </div>
                </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-subtle rounded-2xl overflow-hidden mb-8">
                <div className="p-px bg-gradient-orange rounded-2xl">
                    <div className="bg-bg-secondary rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-orange rounded-xl flex items-center justify-center shrink-0 shadow-glow-orange">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-text-primary mb-2">
                                    Your Role: <span className="text-primary capitalize">{session.user.role}</span>
                                </h3>
                                <p className="text-text-secondary mb-4">
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
                {(session.user.role === 'admin' || session.user.role === 'reviewer') && (
                    <button className="text-left bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all group">
                        <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Create New Task</h3>
                        <p className="text-sm text-text-tertiary">Start a new annotation task</p>
                    </button>
                )}

                <button className="text-left bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all group">
                    <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">View All Tasks</h3>
                    <p className="text-sm text-text-tertiary">Browse your task history</p>
                </button>

                <button className="text-left bg-bg-secondary border border-border-subtle rounded-2xl p-6 hover:border-primary hover:shadow-card-hover transition-all group">
                    <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">View Analytics</h3>
                    <p className="text-sm text-text-tertiary">Check your performance</p>
                </button>
            </div>
        </>
    );
}