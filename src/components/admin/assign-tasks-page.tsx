'use client';

import { useState } from 'react';
import { Users, Zap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProjects } from '@/hooks/use-projects';
import { useProjectTasks, useAssignTasks, useAutoAssignTasks } from '@/hooks/use-tasks';
import { useAnnotators } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

export function AssignTasksPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [showManualAssign, setShowManualAssign] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [taskCount, setTaskCount] = useState<string>('10');
    const [autoAssignCount, setAutoAssignCount] = useState<string>('5');

    const { data: projects } = useProjects();
    const { data: tasks } = useProjectTasks(
        selectedProjectId,
        TaskStatus.UNASSIGNED
    );
    const { data: annotators = [] } = useAnnotators();

    const assignTasks = useAssignTasks();
    const autoAssign = useAutoAssignTasks();

    const selectedProject = projects?.find((p) => p.id === selectedProjectId);
    const unassignedCount = tasks?.filter((t) => t.status === TaskStatus.UNASSIGNED).length || 0;

    const handleManualAssign = async () => {
        if (!selectedProjectId || !selectedUserId || !taskCount) return;

        assignTasks.mutate(
            {
                project_id: selectedProjectId,
                user_id: selectedUserId,
                count: parseInt(taskCount),
            },
            {
                onSuccess: () => {
                    setShowManualAssign(false);
                    setSelectedUserId('');
                    setTaskCount('10');
                },
            }
        );
    };

    const handleAutoAssign = async () => {
        if (!selectedProjectId || !autoAssignCount) return;

        const count = parseInt(autoAssignCount);
        if (confirm(`Auto-assign ${count} tasks per annotator?`)) {
            autoAssign.mutate({
                project_id: selectedProjectId,
                tasks_per_user: count,
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Assign Tasks</h1>
                <p className="text-text-secondary">
                    Distribute annotation tasks to team members
                </p>
            </div>

            {/* Project Selector */}
            <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                <Label className="mb-2 block">Select Project</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            {selectedProject ? selectedProject.name : 'Choose a project...'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        {projects?.map((project) => (
                            <DropdownMenuItem
                                key={project.id}
                                onClick={() => setSelectedProjectId(project.id)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">
                                        {project.category === 'classification' && '🖼️'}
                                        {project.category === 'object_detection' && '⬜'}
                                        {project.category === 'segmentation' && '🎨'}
                                        {!project.category && '📁'}
                                    </span>
                                    <div>
                                        <p className="font-medium">{project.name}</p>
                                        <p className="text-xs text-text-tertiary">
                                            {project.total_tasks || 0} tasks
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {selectedProject && (
                    <div className="mt-4 p-4 bg-bg-tertiary rounded-xl">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-text-primary">
                                    {selectedProject.total_tasks || 0}
                                </p>
                                <p className="text-xs text-text-tertiary">Total Tasks</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-warning">{unassignedCount}</p>
                                <p className="text-xs text-text-tertiary">Unassigned</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-success">
                                    {(selectedProject.total_tasks || 0) - unassignedCount}
                                </p>
                                <p className="text-xs text-text-tertiary">Assigned</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Assignment Options */}
            {selectedProjectId && unassignedCount > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Auto Assign */}
                    <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">
                                    Auto-Assign
                                </h3>
                                <p className="text-sm text-text-tertiary">
                                    Distribute equally to all annotators
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="auto-count">Tasks per annotator</Label>
                                <Input
                                    id="auto-count"
                                    type="number"
                                    min="1"
                                    max={unassignedCount}
                                    value={autoAssignCount}
                                    onChange={(e) => setAutoAssignCount(e.target.value)}
                                    placeholder="5"
                                />
                                <p className="text-xs text-text-tertiary mt-1">
                                    {annotators.length} annotators available
                                </p>
                            </div>

                            <Button
                                onClick={handleAutoAssign}
                                disabled={autoAssign.isPending || !autoAssignCount}
                                className="w-full"
                            >
                                {autoAssign.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Assigning...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-4 h-4 mr-2" />
                                        Auto-Assign Tasks
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Manual Assign */}
                    <div className="p-6 bg-bg-secondary border border-border-subtle rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-info" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-text-primary">
                                    Manual Assign
                                </h3>
                                <p className="text-sm text-text-tertiary">
                                    Choose specific annotator
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setShowManualAssign(true)}
                            className="w-full"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Assign to Specific User
                        </Button>
                    </div>
                </div>
            )}

            {/* No Unassigned Tasks */}
            {selectedProjectId && unassignedCount === 0 && (
                <div className="p-8 bg-bg-secondary border border-border-subtle rounded-2xl text-center">
                    <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        All Tasks Assigned
                    </h3>
                    <p className="text-text-secondary">
                        There are no unassigned tasks in this project
                    </p>
                </div>
            )}

            {/* No Project Selected */}
            {!selectedProjectId && (
                <div className="p-12 bg-bg-secondary border border-border-subtle rounded-2xl text-center">
                    <AlertCircle className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Select a Project
                    </h3>
                    <p className="text-text-secondary">
                        Choose a project above to start assigning tasks
                    </p>
                </div>
            )}

            {/* Manual Assign Dialog */}
            <Dialog open={showManualAssign} onOpenChange={setShowManualAssign}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Tasks to User</DialogTitle>
                        <DialogDescription>
                            Select an annotator and specify how many tasks to assign
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Select User</Label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedUserId
                                            ? annotators.find((u) => u.id === selectedUserId)?.name
                                            : 'Choose annotator...'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full">
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

                        <div>
                            <Label htmlFor="task-count">Number of Tasks</Label>
                            <Input
                                id="task-count"
                                type="number"
                                min="1"
                                max={unassignedCount}
                                value={taskCount}
                                onChange={(e) => setTaskCount(e.target.value)}
                                placeholder="10"
                            />
                            <p className="text-xs text-text-tertiary mt-1">
                                Max: {unassignedCount} unassigned tasks
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setShowManualAssign(false)}
                            disabled={assignTasks.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleManualAssign}
                            disabled={
                                assignTasks.isPending ||
                                !selectedUserId ||
                                !taskCount ||
                                parseInt(taskCount) > unassignedCount
                            }
                        >
                            {assignTasks.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Assigning...
                                </>
                            ) : (
                                'Assign Tasks'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}