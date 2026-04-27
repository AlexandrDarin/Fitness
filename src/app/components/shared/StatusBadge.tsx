import { cn } from "../ui/utils";

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'expired' | 'upcoming' | 'in-progress';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Активный',
    className: 'bg-primary/10 text-primary',
  },
  pending: {
    label: 'В ожидании',
    className: 'bg-yellow-500/10 text-yellow-500',
  },
  confirmed: {
    label: 'Подтверждено',
    className: 'bg-primary/10 text-primary',
  },
  cancelled: {
    label: 'Отменено',
    className: 'bg-red-500/10 text-red-500',
  },
  completed: {
    label: 'Завершено',
    className: 'bg-green-500/10 text-green-500',
  },
  expired: {
    label: 'Истекает',
    className: 'bg-orange-500/10 text-orange-500',
  },
  upcoming: {
    label: 'Предстоящая',
    className: 'bg-blue-500/10 text-blue-500',
  },
  'in-progress': {
    label: 'Идёт',
    className: 'bg-purple-500/10 text-purple-500',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
