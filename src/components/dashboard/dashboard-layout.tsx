'use client';

import { useState, createContext, useContext } from 'react';
import { Header } from '@/components/dashboard/header';
import { Sidebar } from '@/components/dashboard/sidebar';
import { User } from '@/types/user';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: User;
    notificationCount?: number;
    onSignOut?: () => void;
}

// Context to share sidebar state
const SidebarContext = createContext<{
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}>({ collapsed: false, setCollapsed: () => { } });

export const useSidebarCollapse = () => useContext(SidebarContext);

export function DashboardLayout({
    children,
    user,
    notificationCount,
    onSignOut,
}: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
            <div className="min-h-screen bg-bg-primary">
                {/* Header */}
                <Header
                    user={user}
                    notificationCount={notificationCount}
                    onSignOut={onSignOut}
                />

                {/* Sidebar */}
                <Sidebar userRole={user.role} collapsed={collapsed} setCollapsed={setCollapsed} />

                {/* Main Content - Adjusts based on sidebar state */}
                <main
                    className={cn(
                        'pt-16 min-h-screen transition-all duration-300',
                        collapsed ? 'lg:pl-16' : 'lg:pl-60',
                        'md:pl-0'
                    )}
                >
                    <div className="p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarContext.Provider>
    );
}