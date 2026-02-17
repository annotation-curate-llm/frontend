'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Bell, Search, Moon, Sun, ChevronRight, Command, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { User } from '@/types/user';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MobileMenu } from './mobile-menu';

interface HeaderProps {
    user: User;
    notificationCount?: number;
    onSignOut?: () => void;
}

interface BreadcrumbItem {
    label: string;
    href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', href: '/dashboard' }
    ];

    if (segments.length <= 1) {
        return breadcrumbs;
    }

    let currentPath = '';

    for (let i = 1; i < segments.length; i++) {
        currentPath += `/${segments[i]}`;
        const label = segments[i]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Only add href if not the last segment
        breadcrumbs.push({
            label,
            href: i === segments.length - 1 ? undefined : `/dashboard${currentPath}`
        });
    }

    return breadcrumbs;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function Header({ user, notificationCount = 0, onSignOut }: HeaderProps) {
    const pathname = usePathname();
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [searchOpen, setSearchOpen] = useState(false);

    const breadcrumbs = generateBreadcrumbs(pathname);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        // In a real app, this would update the theme context
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleSearchToggle = () => {
        setSearchOpen(!searchOpen);
        // In a real app, this would open a command palette
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-bg-secondary border-b border-border-subtle z-50 backdrop-blur-sm bg-opacity-95">
            <div className="h-full flex items-center justify-between px-6 gap-4">
                {/* Left Section - Logo & Breadcrumbs */}
                <div className="flex items-center gap-6 flex-1 min-w-0">
                    {/* Mobile Menu */}
                    <MobileMenu userRole={user.role} />

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 shrink-0 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-orange flex items-center justify-center shadow-glow-orange">
                            <span className="text-white font-bold text-lg">💀</span>
                        </div>
                        <span className="text-lg font-semibold text-text-primary hidden lg:block group-hover:text-primary transition-colors">
                            Curate-LLM
                        </span>
                    </Link>

                    {/* Breadcrumbs */}
                    <nav className="hidden md:flex items-center gap-2 min-w-0">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
                                )}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors truncate"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-sm text-text-primary font-medium truncate">
                                        {crumb.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Center Section - Search */}
                <div className="hidden lg:flex items-center flex-1 max-w-md">
                    <button
                        onClick={handleSearchToggle}
                        className="w-full flex items-center gap-3 px-4 py-2 bg-bg-tertiary border border-border-default rounded-xl text-text-tertiary hover:border-primary transition-all group"
                    >
                        <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
                        <span className="text-sm flex-1 text-left">Search projects, tasks, users...</span>
                        <kbd className="hidden xl:flex items-center gap-1 px-2 py-1 text-xs bg-bg-secondary rounded-lg border border-border-subtle">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </kbd>
                    </button>
                </div>

                {/* Right Section - Actions & User */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Search Button (Mobile) */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSearchToggle}
                        className="lg:hidden rounded-xl"
                    >
                        <Search className="w-5 h-5" />
                    </Button>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-xl"
                            >
                                <Bell className="w-5 h-5" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glow-orange">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-0">
                            <DropdownMenuLabel className="p-4 border-b border-border-subtle">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Notifications</span>
                                    {notificationCount > 0 && (
                                        <span className="text-xs text-text-tertiary">
                                            {notificationCount} new
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuLabel>
                            <div className="max-h-96 overflow-y-auto">
                                {notificationCount > 0 ? (
                                    <div className="p-4 text-center text-text-secondary text-sm">
                                        <Bell className="w-12 h-12 mx-auto mb-3 text-text-tertiary opacity-50" />
                                        <p>Notifications coming soon!</p>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-text-secondary text-sm">
                                        <Bell className="w-12 h-12 mx-auto mb-3 text-text-tertiary opacity-50" />
                                        <p>No new notifications</p>
                                    </div>
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-xl"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-bg-tertiary transition-colors group">
                                <Avatar className="w-8 h-8 ring-2 ring-border-subtle group-hover:ring-primary transition-all">
                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                    <AvatarFallback className="bg-gradient-orange text-white font-semibold text-sm">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden xl:block text-left">
                                    <p className="text-sm font-medium text-text-primary">
                                        {user.name}
                                    </p>
                                    <p className="text-xs text-text-tertiary capitalize">
                                        {user.role}
                                    </p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-text-tertiary font-normal mt-0.5">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile" className="cursor-pointer">
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="cursor-pointer">
                                    <SettingsIcon className="w-4 h-4 mr-2" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={onSignOut}
                                className="cursor-pointer text-error focus:text-error"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}