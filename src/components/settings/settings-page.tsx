'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Bell, Lock, Globe, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateUser } from '@/hooks/use-users';
import { cn } from '@/lib/utils';

type TabType = 'profile' | 'notifications' | 'security' | 'preferences';

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [name, setName] = useState(session?.user?.name || '');
    const [email] = useState(session?.user?.email || '');

    const updateUser = useUpdateUser();

    const handleSaveProfile = () => {
        if (!session?.user?.id) return;

        updateUser.mutate({
            id: session.user.id,
            updates: {
                name: name.trim(),
            },
        });
    };

    const tabs = [
        { id: 'profile' as TabType, label: 'Profile', icon: User },
        { id: 'notifications' as TabType, label: 'Notifications', icon: Bell },
        { id: 'security' as TabType, label: 'Security', icon: Lock },
        { id: 'preferences' as TabType, label: 'Preferences', icon: Globe },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
                <p className="text-text-secondary">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-2 space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left',
                                        activeTab === tab.id
                                            ? 'bg-primary text-white'
                                            : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                        {activeTab === 'profile' && (
                            <ProfileTab
                                name={name}
                                setName={setName}
                                email={email}
                                avatarUrl={session?.user?.image}
                                role={session?.user?.role}
                                onSave={handleSaveProfile}
                                isSaving={updateUser.isPending}
                            />
                        )}
                        {activeTab === 'notifications' && <NotificationsTab />}
                        {activeTab === 'security' && <SecurityTab />}
                        {activeTab === 'preferences' && <PreferencesTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileTab({
    name,
    setName,
    email,
    avatarUrl,
    role,
    onSave,
    isSaving,
}: {
    name: string;
    setName: (name: string) => void;
    email: string;
    avatarUrl?: string | null;
    role?: string;
    onSave: () => void;
    isSaving: boolean;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">Profile Information</h2>
                <p className="text-sm text-text-secondary">Update your personal information</p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl || undefined} alt={name} />
                    <AvatarFallback className="bg-gradient-orange text-white text-xl">
                        {getInitials(name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-medium text-text-primary mb-1">{name}</p>
                    <p className="text-xs text-text-tertiary capitalize">
                        {role} • Signed in with Google
                    </p>
                </div>
            </div>

            {/* Name */}
            <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-2"
                />
            </div>

            {/* Email (Read-only) */}
            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    value={email}
                    disabled
                    className="mt-2 opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-text-tertiary mt-1">
                    Email cannot be changed (managed by Google OAuth)
                </p>
            </div>

            {/* Role (Read-only) */}
            <div>
                <Label>Role</Label>
                <div className="mt-2 px-4 py-2 bg-bg-tertiary border border-border-default rounded-xl">
                    <span className="text-sm text-text-primary capitalize">{role}</span>
                </div>
                <p className="text-xs text-text-tertiary mt-1">
                    Contact an administrator to change your role
                </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border-subtle">
                <Button onClick={onSave} disabled={isSaving || !name.trim()}>
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

function NotificationsTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">Notifications</h2>
                <p className="text-sm text-text-secondary">Manage your notification preferences</p>
            </div>

            <div className="space-y-4">
                {[
                    { id: 'task_assigned', label: 'Task Assigned', description: 'Get notified when a task is assigned to you' },
                    { id: 'task_reviewed', label: 'Task Reviewed', description: 'Get notified when your annotation is reviewed' },
                    { id: 'project_updates', label: 'Project Updates', description: 'Get notified about project changes' },
                    { id: 'export_complete', label: 'Export Complete', description: 'Get notified when exports are ready' },
                ].map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-bg-tertiary rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-text-primary">{item.label}</p>
                            <p className="text-xs text-text-tertiary mt-1">{item.description}</p>
                        </div>
                        <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5 rounded border-border-default text-primary focus:ring-primary"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-border-subtle">
                <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                </Button>
            </div>
        </div>
    );
}

function SecurityTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">Security</h2>
                <p className="text-sm text-text-secondary">Manage your security settings</p>
            </div>

            <div className="p-4 bg-info/10 border border-info/20 rounded-xl">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-info shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-text-primary mb-1">
                            Authentication via Google OAuth
                        </p>
                        <p className="text-xs text-text-secondary">
                            Your account is secured through Google's authentication system. Password management
                            is handled by Google.
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-text-primary mb-3">Active Sessions</h3>
                <div className="space-y-2">
                    <div className="p-4 bg-bg-tertiary rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-text-primary">Current Session</p>
                                <p className="text-xs text-text-tertiary mt-1">Last active: Now</p>
                            </div>
                            <span className="px-2 py-1 bg-success/10 text-success text-xs rounded">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreferencesTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-text-primary mb-1">Preferences</h2>
                <p className="text-sm text-text-secondary">Customize your experience</p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label>Language</Label>
                    <select className="mt-2 w-full px-4 py-2 bg-bg-tertiary border border-border-default rounded-xl text-sm text-text-primary">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>

                <div>
                    <Label>Timezone</Label>
                    <select className="mt-2 w-full px-4 py-2 bg-bg-tertiary border border-border-default rounded-xl text-sm text-text-primary">
                        <option>UTC</option>
                        <option>America/New_York</option>
                        <option>Europe/London</option>
                        <option>Asia/Tokyo</option>
                    </select>
                </div>

                <div>
                    <Label>Items per page</Label>
                    <select className="mt-2 w-full px-4 py-2 bg-bg-tertiary border border-border-default rounded-xl text-sm text-text-primary">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border-subtle">
                <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                </Button>
            </div>
        </div>
    );
}