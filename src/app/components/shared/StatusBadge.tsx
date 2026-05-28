interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active': return { label: 'Активен', className: 'bg-green-500/20 text-green-500' };
      case 'confirmed': return { label: 'Подтверждён', className: 'bg-green-500/20 text-green-500' };
      case 'scheduled': return { label: 'Запланирован', className: 'bg-blue-500/20 text-blue-500' };
      case 'ongoing': return { label: 'Идёт', className: 'bg-yellow-500/20 text-yellow-500' };
      case 'inactive': return { label: 'Неактивен', className: 'bg-gray-500/20 text-gray-400' };
      case 'blocked': return { label: 'Заблокирован', className: 'bg-red-500/20 text-red-500' };
      case 'expired': return { label: 'Истёк', className: 'bg-orange-500/20 text-orange-500' };
      case 'frozen': return { label: 'Заморожен', className: 'bg-blue-500/20 text-blue-500' };
      case 'completed': return { label: 'Завершён', className: 'bg-green-500/20 text-green-500' };
      case 'cancelled': return { label: 'Отменён', className: 'bg-red-500/20 text-red-500' };
      case 'missed': return { label: 'Пропущен', className: 'bg-red-500/20 text-red-500' };
      default: return { label: status, className: 'bg-gray-500/20 text-gray-400' };
    }
  };
  const config = getStatusConfig();
  return <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>;
}