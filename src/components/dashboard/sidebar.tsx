'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/user';
import {
    LayoutDashboard,
    FolderOpen,
    Plus,
    CheckSquare,
    Users,
    UserCog,
    Search,
    BarChart3,
    Upload,
    Settings,
    Clock,
    CheckCircle,
    BookOpen,
    MessageCircle,
    XCircle,
    Target,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    exactMatch?: boolean;
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

interface SidebarProps {
    userRole: UserRole;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const adminNavigation: NavSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'PROJECTS',
        items: [
            {
                title: 'All Projects',
                href: '/dashboard/projects',
                icon: FolderOpen,
                exactMatch: false,
            },
            {
                title: 'Create Project',
                href: '/dashboard/projects/create',
                icon: Plus,
            },
        ],
    },
    {
        title: 'TASKS',
        items: [
            {
                title: 'All Tasks',
                href: '/dashboard/tasks',
                icon: CheckSquare,
            },
            {
                title: 'Assign Tasks',
                href: '/dashboard/tasks/assign',
                icon: Users,
            },
        ],
    },
    {
        title: 'USERS',
        items: [
            {
                title: 'Manage Users',
                href: '/dashboard/users',
                icon: Users,
            },

        ],
    },
    {
        title: 'REVIEWS',
        items: [
            {
                title: 'Pending Reviews',
                href: '/dashboard/reviews',
                icon: Search,
            },
            // {
            //     title: 'Review Stats',
            //     href: '/dashboard/reviews/stats',
            //     icon: BarChart3,
            // },
        ],
    },
    {
        title: 'EXPORTS',
        items: [
            {
                title: 'Export Data',
                href: '/dashboard/exports',
                icon: Upload,
            },
        ],
    },
    {
        items: [
            {
                title: 'Settings',
                href: '/dashboard/settings',
                icon: Settings,
            },
        ],
    },
];

const annotatorNavigation: NavSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'MY WORK',
        items: [
            {
                title: 'My Tasks',
                href: '/dashboard/my-tasks',
                icon: CheckSquare,
            },
            {
                title: 'In Progress',
                href: '/dashboard/my-tasks/in-progress',
                icon: Clock,
            },
            {
                title: 'Completed',
                href: '/dashboard/my-tasks/completed',
                icon: CheckCircle,
            },
        ],
    },
    {
        title: 'PROJECTS',
        items: [
            {
                title: 'Browse Projects',
                href: '/dashboard/projects',
                icon: FolderOpen,
            },
        ],
    },
    {
        title: 'STATISTICS',
        items: [
            {
                title: 'My Stats',
                href: '/dashboard/stats',
                icon: BarChart3,
            },
        ],
    },
    {
        title: 'HELP',
        items: [
            {
                title: 'Guidelines',
                href: '/dashboard/help/guidelines',
                icon: BookOpen,
            },
            {
                title: 'Support',
                href: '/dashboard/help/support',
                icon: MessageCircle,
            },
        ],
    },
];

const reviewerNavigation: NavSection[] = [
    {
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: 'REVIEWS',
        items: [
            {
                title: 'Pending',
                href: '/dashboard/reviews',
                icon: Search,
            },
            {
                title: 'Approved',
                href: '/dashboard/reviews/approved',
                icon: CheckCircle,
            },
            {
                title: 'Rejected',
                href: '/dashboard/reviews/rejected',
                icon: XCircle,
            },
        ],
    },
    {
        title: 'PROJECTS',
        items: [
            {
                title: 'All Projects',
                href: '/dashboard/projects',
                icon: FolderOpen,
            },
        ],
    },
    {
        title: 'STATISTICS',
        items: [
            {
                title: 'Review Stats',
                href: '/dashboard/stats',
                icon: BarChart3,
            },
            {
                title: 'Quality Metrics',
                href: '/dashboard/stats/quality',
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'ANNOTATORS',
        items: [
            {
                title: 'Performance',
                href: '/dashboard/annotators',
                icon: Target,
            },
        ],
    },
];

const navigationByRole: Record<UserRole, NavSection[]> = {
    [UserRole.ADMIN]: adminNavigation,
    [UserRole.ANNOTATOR]: annotatorNavigation,
    [UserRole.REVIEWER]: reviewerNavigation,
};

export function Sidebar({ userRole, collapsed, setCollapsed }: SidebarProps) {
    const pathname = usePathname();
    const navigation = navigationByRole[userRole];

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-bg-secondary border-r border-border-subtle transition-all duration-300 z-40',
                collapsed ? 'w-16' : 'w-60'
            )}
        >
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center hover:bg-bg-tertiary transition-colors"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? (
                    <ChevronRight className="w-3 h-3 text-text-secondary" />
                ) : (
                    <ChevronLeft className="w-3 h-3 text-text-secondary" />
                )}
            </button>

            {/* Navigation */}
            <nav className="h-full overflow-y-auto py-6 px-3">
                <div className="space-y-6">
                    {navigation.map((section, idx) => (
                        <div key={idx}>
                            {section.title && !collapsed && (
                                <h3 className="px-3 mb-2 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                                    {section.title}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        (item.exactMatch === false && pathname.startsWith(item.href + '/'));
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                                                isActive
                                                    ? 'text-primary bg-primary/10 shadow-sm'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                                            )}
                                            title={collapsed ? item.title : undefined}
                                        >
                                            {/* Active Indicator */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                            )}

                                            <Icon
                                                className={cn(
                                                    'w-5 h-5 shrink-0 transition-colors',
                                                    isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-primary'
                                                )}
                                            />

                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1">{item.title}</span>
                                                    {item.badge !== undefined && (
                                                        <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-white rounded-full">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}

                                            {/* Collapsed Badge */}
                                            {collapsed && item.badge !== undefined && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                    {item.badge > 9 ? '9+' : item.badge}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </aside>
    );
}