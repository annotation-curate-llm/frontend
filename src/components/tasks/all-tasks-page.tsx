'use client';

import { useState } from 'react';
import { Search, Filter, Loader2, MoreVertical, Trash2, UserCheck, RefreshCw } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { useProjectTasks, useBulkUpdateTaskStatus, useAssignTasks } from '@/hooks/use-tasks';
import { useAnnotators } from '@/hooks/use-users';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { TaskStatus, Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function AllTasksPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');

    const { data: projects } = useProjects();
    const { data: tasks, isLoading } = useProjectTasks(
        selectedProjectId === 'all' ? '' : selectedProjectId
    );
    const { data: annotators = [] } = useAnnotators();
    const bulkUpdate = useBulkUpdateTaskStatus();
    const assignTasks = useAssignTasks();

    // Filter tasks
    const filteredTasks = tasks?.filter((task) => {
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesSearch = !searchQuery ||
            task.asset?.file_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    }) || [];

    // Stats
    const stats = {
        total: tasks?.length || 0,
        unassigned: tasks?.filter((t) => t.status === TaskStatus.UNASSIGNED).length || 0,
        inProgress: tasks?.filter((t) => t.status === TaskStatus.IN_PROGRESS).length || 0,
        completed: tasks?.filter((t) => t.status === TaskStatus.COMPLETED).length || 0,
        reviewed: tasks?.filter((t) => t.status === TaskStatus.REVIEWED).length || 0,
    };

    const handleSelectAll = () => {
        if (selectedTasks.length === filteredTasks.length) {
            setSelectedTasks([]);
        } else {
            setSelectedTasks(filteredTasks.map((t) => t.id));
        }
    };

    const handleSelectTask = (taskId: string) => {
        setSelectedTasks((prev) =>
            prev.includes(taskId)
                ? prev.filter((id) => id !== taskId)
                : [...prev, taskId]
        );
    };

    const handleBulkAssign = () => {
        if (!selectedUserId || !selectedProjectId || selectedProjectId === 'all') return;

        assignTasks.mutate(
            {
                project_id: selectedProjectId,
                user_id: selectedUserId,
                count: selectedTasks.length,
            },
            {
                onSuccess: () => {
                    setShowAssignDialog(false);
                    setSelectedTasks([]);
                    setSelectedUserId('');
                },
            }
        );
    };

    const handleBulkStatusUpdate = (new_status: TaskStatus) => {
        if (selectedTasks.length === 0) return;

        bulkUpdate.mutate(
            { task_ids: selectedTasks, new_status },
            {
                onSuccess: () => setSelectedTasks([]),
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">All Tasks</h1>
                    <p className="text-text-secondary">Manage and monitor all annotation tasks</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: 'Total', value: stats.total, color: 'text-text-primary', filter: 'all' },
                    { label: 'Unassigned', value: stats.unassigned, color: 'text-text-tertiary', filter: TaskStatus.UNASSIGNED },
                    { label: 'In Progress', value: stats.inProgress, color: 'text-warning', filter: TaskStatus.IN_PROGRESS },
                    { label: 'Completed', value: stats.completed, color: 'text-success', filter: TaskStatus.COMPLETED },
                    { label: 'Reviewed', value: stats.reviewed, color: 'text-primary', filter: TaskStatus.REVIEWED },
                ].map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => setStatusFilter(stat.filter as any)}
                        className={cn(
                            'p-4 bg-bg-secondary border rounded-xl text-center transition-all',
                            statusFilter === stat.filter
                                ? 'border-primary shadow-card-hover'
                                : 'border-border-subtle hover:border-primary'
                        )}
                    >
                        <p className={cn('text-3xl font-bold mb-1', stat.color)}>{stat.value}</p>
                        <p className="text-xs text-text-tertiary">{stat.label}</p>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <Input
                        placeholder="Search by file name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Project Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            {selectedProjectId === 'all'
                                ? 'All Projects'
                                : projects?.find((p) => p.id === selectedProjectId)?.name || 'Project'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedProjectId('all')}>
                            All Projects
                        </DropdownMenuItem>
                        {projects?.map((project) => (
                            <DropdownMenuItem
                                key={project.id}
                                onClick={() => setSelectedProjectId(project.id)}
                            >
                                {project.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            {statusFilter === 'all' ? 'All Statuses' : statusFilter.replace('_', ' ')}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                            All Statuses
                        </DropdownMenuItem>
                        {Object.values(TaskStatus).map((status) => (
                            <DropdownMenuItem
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className="capitalize"
                            >
                                {status.replace('_', ' ')}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Bulk Actions */}
            {selectedTasks.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                    <span className="text-sm font-medium text-primary">
                        {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAssignDialog(true)}
                            disabled={selectedProjectId === 'all'}
                        >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Assign
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBulkStatusUpdate(TaskStatus.UNASSIGNED)}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset to Unassigned
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedTasks([])}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            {/* Tasks Table */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-bg-tertiary border-b border-border-subtle">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-border-default text-primary"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase">File</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase">Project</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase">Assigned To</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase">Updated</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {filteredTasks.map((task: Task) => (
                                    <tr
                                        key={task.id}
                                        className={cn(
                                            'hover:bg-bg-tertiary transition-colors',
                                            selectedTasks.includes(task.id) && 'bg-primary/5'
                                        )}
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.includes(task.id)}
                                                onChange={() => handleSelectTask(task.id)}
                                                className="w-4 h-4 rounded border-border-default text-primary"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-text-primary truncate max-w-48">
                                                {task.asset?.file_name || 'Unknown file'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-text-secondary truncate max-w-32">
                                                {projects?.find((p) => p.id === task.project_id)?.name || 'Unknown'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-text-secondary">
                                                {task.assigned_to
                                                    ? annotators.find((u) => u.id === task.assigned_to)?.name || 'Unknown'
                                                    : '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-text-tertiary">
                                                {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedTasks([task.id]);
                                                            setShowAssignDialog(true);
                                                        }}
                                                    >
                                                        <UserCheck className="w-4 h-4 mr-2" />
                                                        Reassign
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleBulkStatusUpdate(TaskStatus.UNASSIGNED)}
                                                    >
                                                        <RefreshCw className="w-4 h-4 mr-2" />
                                                        Reset Status
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="p-12 bg-bg-secondary border border-border-subtle rounded-2xl text-center">
                    <Search className="w-16 h-16 text-text-tertiary mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">No tasks found</h3>
                    <p className="text-text-secondary">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Select a project to view tasks'}
                    </p>
                </div>
            )}

            {/* Footer */}
            {filteredTasks.length > 0 && (
                <p className="text-sm text-text-tertiary">
                    Showing {filteredTasks.length} of {tasks?.length || 0} tasks
                </p>
            )}

            {/* Assign Dialog */}
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Tasks</DialogTitle>
                        <DialogDescription>
                            Assign {selectedTasks.length} selected task{selectedTasks.length > 1 ? 's' : ''} to an annotator
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {selectedUserId
                                        ? annotators.find((u) => u.id === selectedUserId)?.name
                                        : 'Choose annotator...'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
                                {annotators.map((user) => (
                                    <DropdownMenuItem
                                        key={user.id}
                                        onClick={() => setSelectedUserId(user.id)}
                                    >
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-text-tertiary">{user.email}</p>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setShowAssignDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBulkAssign}
                            disabled={!selectedUserId || assignTasks.isPending}
                        >
                            {assignTasks.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Assign Tasks
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}