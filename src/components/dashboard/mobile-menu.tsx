'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './sidebar';
import { UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
    userRole: UserRole;
}

export function MobileMenu({ userRole }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => setIsOpen(false);
        // Add your route change listener here
        return () => {
            // Cleanup
        };
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Hamburger Button - Only visible on mobile */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden rounded-xl"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div
                className={cn(
                    'fixed left-0 top-16 h-[calc(100vh-4rem)] w-60 bg-bg-secondary border-r border-border-subtle z-50 lg:hidden transition-transform duration-300',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <Sidebar userRole={userRole} collapsed={collapsed} setCollapsed={setCollapsed} />
            </div>
        </>
    );
}