'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
    Calendar, CheckCircle2, Clock, Award, TrendingUp, ExternalLink,
    BarChart3, Target, Zap, Activity
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useMyTasks } from '@/hooks/use-tasks';
import { TaskStatus } from '@/types/task';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

type TabType = 'overview' | 'activity' | 'stats';

export function ProfilePage() {
    const { data: session } = useSession();
    const { data: allTasks } = useMyTasks();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    if (!session?.user) return null;

    const user = session.user;

    // Calculate stats
    const stats = {
        total: allTasks?.length || 0,
        completed: allTasks?.filter((t) => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.REVIEWED).length || 0,
        inProgress: allTasks?.filter((t) => t.status === TaskStatus.IN_PROGRESS).length || 0,
        pending: allTasks?.filter((t) => t.status === TaskStatus.ASSIGNED).length || 0,
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
        <div className="max-w-6xl mx-auto">
            {/* Cover Photo */}
            <div className="relative h-48 bg-linear-to-r from-primary via-primary/80 to-primary/60 rounded-t-3xl overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQyYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            </div>

            {/* Profile Header */}
            <div className="relative px-8 pb-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-end gap-6 -mt-16">
                        <Avatar className="w-32 h-32 border-4 border-bg-primary ring-4 ring-primary/10">
                            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                            <AvatarFallback className="bg-gradient-orange text-white text-3xl">
                                {getInitials(user.name || 'U')}
                            </AvatarFallback>
                        </Avatar>

                        <div className="pb-2">
                            <h1 className="text-3xl font-bold text-text-primary mb-1">{user.name}</h1>
                            <p className="text-text-secondary mb-2">{user.email}</p>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium capitalize">
                                    {user.role}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-text-tertiary">
                                    <Calendar className="w-4 h-4" />
                                    Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/my-tasks">
                            <Button variant="outline">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                View Tasks
                            </Button>
                        </Link>
                        <Link href="/dashboard/settings">
                            <Button>
                                Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                    <div className="text-center p-4 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-primary transition-all cursor-pointer">
                        <p className="text-3xl font-bold text-text-primary mb-1">{stats.total}</p>
                        <p className="text-sm text-text-tertiary">Total Tasks</p>
                    </div>
                    <div className="text-center p-4 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-success transition-all cursor-pointer">
                        <p className="text-3xl font-bold text-success mb-1">{stats.completed}</p>
                        <p className="text-sm text-text-tertiary">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-warning transition-all cursor-pointer">
                        <p className="text-3xl font-bold text-warning mb-1">{stats.inProgress}</p>
                        <p className="text-sm text-text-tertiary">In Progress</p>
                    </div>
                    <div className="text-center p-4 bg-bg-secondary rounded-2xl border border-border-subtle hover:border-info transition-all cursor-pointer">
                        <p className="text-3xl font-bold text-info mb-1">{completionRate}%</p>
                        <p className="text-sm text-text-tertiary">Success Rate</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-border-subtle mt-8">
                    <div className="flex gap-8">
                        {[
                            { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
                            { id: 'activity' as TabType, label: 'Activity', icon: Activity },
                            { id: 'stats' as TabType, label: 'Statistics', icon: TrendingUp },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative',
                                        activeTab === tab.id
                                            ? 'text-primary'
                                            : 'text-text-tertiary hover:text-text-primary'
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="px-8 pb-8">
                {activeTab === 'overview' && <OverviewTab stats={stats} completionRate={completionRate} />}
                {activeTab === 'activity' && <ActivityTab tasks={allTasks || []} />}
                {activeTab === 'stats' && <StatsTab stats={stats} completionRate={completionRate} />}
            </div>
        </div>
    );
}

function OverviewTab({ stats, completionRate }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Performance Card */}
            <div className="lg:col-span-2 p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <h3 className="text-lg font-semibold text-text-primary mb-6">Performance Overview</h3>

                <div className="space-y-6">
                    {/* Progress Ring */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                            <svg className="transform -rotate-90 w-48 h-48">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-bg-tertiary"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={`${2 * Math.PI * 88}`}
                                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - completionRate / 100)}`}
                                    className="transition-all duration-1000"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff5722" />
                                        <stop offset="100%" stopColor="#ff9800" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-text-primary">{completionRate}%</span>
                                <span className="text-sm text-text-tertiary">Completion</span>
                            </div>
                        </div>
                    </div>

                    {/* Task Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-bg-tertiary rounded-xl">
                            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Clock className="w-5 h-5 text-info" />
                            </div>
                            <p className="text-2xl font-bold text-text-primary">{stats.pending}</p>
                            <p className="text-xs text-text-tertiary mt-1">Pending</p>
                        </div>
                        <div className="text-center p-4 bg-bg-tertiary rounded-xl">
                            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Zap className="w-5 h-5 text-warning" />
                            </div>
                            <p className="text-2xl font-bold text-text-primary">{stats.inProgress}</p>
                            <p className="text-xs text-text-tertiary mt-1">Active</p>
                        </div>
                        <div className="text-center p-4 bg-bg-tertiary rounded-xl">
                            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 className="w-5 h-5 text-success" />
                            </div>
                            <p className="text-2xl font-bold text-text-primary">{stats.completed}</p>
                            <p className="text-xs text-text-tertiary mt-1">Done</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements Sidebar */}
            <div className="space-y-6">
                <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Achievements</h3>
                    <div className="space-y-3">
                        {[
                            { icon: '🏆', label: 'First Task', unlocked: stats.total > 0 },
                            { icon: '🎯', label: '10 Tasks', unlocked: stats.total >= 10 },
                            { icon: '⚡', label: 'Speed Demon', unlocked: stats.completed >= 5 },
                            { icon: '🌟', label: '100% Accuracy', unlocked: completionRate === 100 },
                        ].map((achievement, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    'flex items-center gap-3 p-3 rounded-xl transition-all',
                                    achievement.unlocked
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'bg-bg-tertiary opacity-50'
                                )}
                            >
                                <span className="text-2xl">{achievement.icon}</span>
                                <span className="text-sm font-medium text-text-primary">
                                    {achievement.label}
                                </span>
                                {achievement.unlocked && (
                                    <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityTab({ tasks }: any) {
    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>

            {tasks.length > 0 ? (
                <div className="space-y-3">
                    {tasks.slice(0, 10).map((task: any, idx: number) => (
                        <div
                            key={task.id}
                            className="flex items-start gap-4 p-4 bg-bg-secondary border border-border-subtle rounded-xl hover:border-primary transition-all"
                        >
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-primary truncate">
                                    {task.asset?.file_name || 'Task'}
                                </p>
                                <p className="text-xs text-text-tertiary mt-1 capitalize">
                                    {task.status.replace('_', ' ')} • {new Date(task.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Link href="/dashboard/my-tasks">
                                <Button variant="ghost" size="sm">
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-bg-secondary border border-border-subtle rounded-2xl">
                    <Activity className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
                    <p className="text-text-tertiary">No activity yet</p>
                </div>
            )}
        </div>
    );
}

function StatsTab({ stats, completionRate }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Task Distribution</h3>
                <div className="space-y-3">
                    {[
                        { label: 'Completed', value: stats.completed, total: stats.total, color: 'bg-success' },
                        { label: 'In Progress', value: stats.inProgress, total: stats.total, color: 'bg-warning' },
                        { label: 'Pending', value: stats.pending, total: stats.total, color: 'bg-info' },
                    ].map((item, idx) => {
                        const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
                        return (
                            <div key={idx}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-text-secondary">{item.label}</span>
                                    <span className="text-sm font-medium text-text-primary">
                                        {item.value} ({Math.round(percentage)}%)
                                    </span>
                                </div>
                                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                                    <div
                                        className={cn('h-full transition-all duration-500', item.color)}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-xl">
                        <span className="text-sm text-text-secondary">Completion Rate</span>
                        <span className="text-lg font-bold text-primary">{completionRate}%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-xl">
                        <span className="text-sm text-text-secondary">Total Tasks</span>
                        <span className="text-lg font-bold text-text-primary">{stats.total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-xl">
                        <span className="text-sm text-text-secondary">Success Rate</span>
                        <span className="text-lg font-bold text-success">
                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}