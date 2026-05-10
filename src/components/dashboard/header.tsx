'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { User } from '@/types/user';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/dashboard' }];

    if (segments.length <= 1) return breadcrumbs;

    let currentPath = '';
    for (let i = 1; i < segments.length; i++) {
        currentPath += `/${segments[i]}`;
        const label = segments[i]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        breadcrumbs.push({
            label,
            href: i === segments.length - 1 ? undefined : `/dashboard${currentPath}`
        });
    }

    return breadcrumbs;
}

function getInitials(name: string): string {
    return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase().slice(0, 2);
}

export function Header({ user, onSignOut }: HeaderProps) {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-bg-secondary border-b border-border-subtle z-50 backdrop-blur-sm bg-opacity-95">
            <div className="h-full flex items-center justify-between px-6 gap-4">
                {/* Left — Logo & Breadcrumbs */}
                <div className="flex items-center gap-6 flex-1 min-w-0">
                    <MobileMenu userRole={user.role} />

                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-orange">
                            <Image src="/logo.png" alt="Curate-LLM" width={32} height={32} />
                        </div>
                        <span className="text-lg font-semibold text-text-primary hidden lg:block group-hover:text-primary transition-colors">
                            Curate-LLM
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-2 min-w-0">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
                                )}
                                {crumb.href ? (
                                    <Link href={crumb.href} className="text-sm text-text-secondary hover:text-primary transition-colors truncate">
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

                {/* Right — User Menu */}
                <div className="flex items-center gap-2 shrink-0">
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
                                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                                    <p className="text-xs text-text-tertiary capitalize">{user.role}</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-text-tertiary font-normal mt-0.5">{user.email}</p>
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
                            <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-error focus:text-error">
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