'use client';

import { useState } from 'react';
import { Search, UserCog, Shield, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useUsers, useUpdateUser } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function UserManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

    const { data: users, isLoading, error } = useUsers();
    const updateUser = useUpdateUser();

    const filteredUsers = users
        ?.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        if (confirm(`Change user role to ${newRole}?`)) {
            updateUser.mutate({ id: userId, updates: { role: newRole } });
        }
    };

    const handleToggleActive = (userId: string, currentStatus: boolean) => {
        const action = currentStatus ? 'deactivate' : 'activate';
        if (confirm(`Are you sure you want to ${action} this user?`)) {
            updateUser.mutate({ id: userId, updates: { is_active: !currentStatus } });
        }
    };

    const stats = {
        total: users?.length || 0,
        admins: users?.filter((u) => u.role === UserRole.ADMIN).length || 0,
        annotators: users?.filter((u) => u.role === UserRole.ANNOTATOR).length || 0,
        reviewers: users?.filter((u) => u.role === UserRole.REVIEWER).length || 0,
        active: users?.filter((u) => u.is_active).length || 0,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-error mb-2">Failed to load users</p>
                    <p className="text-sm text-text-tertiary">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">User Management</h1>
                <p className="text-text-secondary">Manage users and assign roles</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Admins</p>
                    <p className="text-3xl font-bold text-primary">{stats.admins}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Annotators</p>
                    <p className="text-3xl font-bold text-info">{stats.annotators}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Reviewers</p>
                    <p className="text-3xl font-bold text-warning">{stats.reviewers}</p>
                </div>
                <div className="p-4 bg-bg-secondary border border-border-subtle rounded-xl">
                    <p className="text-sm text-text-tertiary mb-1">Active</p>
                    <p className="text-3xl font-bold text-success">{stats.active}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <UserCog className="w-4 h-4 mr-2" />
                            {roleFilter === 'all' ? 'All Roles' : roleFilter}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setRoleFilter('all')}>
                            All Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter(UserRole.ADMIN)}>
                            Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter(UserRole.ANNOTATOR)}>
                            Annotator
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRoleFilter(UserRole.REVIEWER)}>
                            Reviewer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Users Table */}
            {filteredUsers && filteredUsers.length > 0 ? (
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-bg-tertiary border-b border-border-subtle">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-bg-tertiary transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                                    <AvatarFallback className="bg-gradient-orange text-white text-sm">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {user.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-text-secondary">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        className={cn(
                                                            'inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                                                            user.role === UserRole.ADMIN &&
                                                            'bg-primary/10 text-primary hover:bg-primary/20',
                                                            user.role === UserRole.ANNOTATOR &&
                                                            'bg-info/10 text-info hover:bg-info/20',
                                                            user.role === UserRole.REVIEWER &&
                                                            'bg-warning/10 text-warning hover:bg-warning/20'
                                                        )}
                                                    >
                                                        {user.role === UserRole.ADMIN && (
                                                            <Shield className="w-3 h-3" />
                                                        )}
                                                        {user.role === UserRole.ANNOTATOR && (
                                                            <UserCog className="w-3 h-3" />
                                                        )}
                                                        {user.role === UserRole.REVIEWER && (
                                                            <CheckCircle2 className="w-3 h-3" />
                                                        )}
                                                        <span className="capitalize">{user.role}</span>
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user.id, UserRole.ADMIN)}
                                                        disabled={user.role === UserRole.ADMIN}
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user.id, UserRole.ANNOTATOR)}
                                                        disabled={user.role === UserRole.ANNOTATOR}
                                                    >
                                                        <UserCog className="w-4 h-4 mr-2" />
                                                        Annotator
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user.id, UserRole.REVIEWER)}
                                                        disabled={user.role === UserRole.REVIEWER}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Reviewer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={user.is_active ? 'success' : 'outline'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-text-tertiary">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Button
                                                variant={user.is_active ? 'ghost' : 'outline'}
                                                size="sm"
                                                onClick={() => handleToggleActive(user.id, user.is_active)}
                                            >
                                                {user.is_active ? (
                                                    <>
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 mr-1" />
                                                        Activate
                                                    </>
                                                )}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="p-12 bg-bg-secondary border border-border-subtle rounded-2xl text-center">
                    <UserCog className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No users found</h3>
                    <p className="text-text-secondary">
                        {searchQuery || roleFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'No users in the system yet'}
                    </p>
                </div>
            )}

            {/* Footer */}
            {filteredUsers && filteredUsers.length > 0 && (
                <div className="text-sm text-text-tertiary">
                    Showing {filteredUsers.length} of {users?.length || 0} users
                </div>
            )}
        </div>
    );
}