import { TaskStatus } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Circle, Clock, Play, CheckCircle2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: TaskStatus;
    showIcon?: boolean;
}

const STATUS_CONFIG = {
    [TaskStatus.UNASSIGNED]: {
        label: 'Unassigned',
        variant: 'outline' as const,
        icon: Circle,
        className: 'text-text-tertiary border-text-tertiary',
    },
    [TaskStatus.ASSIGNED]: {
        label: 'Assigned',
        variant: 'info' as const,
        icon: Clock,
        className: '',
    },
    [TaskStatus.IN_PROGRESS]: {
        label: 'In Progress',
        variant: 'warning' as const,
        icon: Play,
        className: '',
    },
    [TaskStatus.COMPLETED]: {
        label: 'Completed',
        variant: 'success' as const,
        icon: CheckCircle2,
        className: '',
    },
    [TaskStatus.REVIEWED]: {
        label: 'Reviewed',
        variant: 'default' as const,
        icon: Shield,
        className: '',
    },
};

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={cn('gap-1', config.className)}>
            {showIcon && <Icon className="w-3 h-3" />}
            {config.label}
        </Badge>
    );
}