import { Status } from '@/types/data';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    Approved: {
      variant: 'default' as const,
      icon: CheckCircle2,
      className: 'bg-success text-success-foreground hover:bg-success/90'
    },
    'Needs Fix': {
      variant: 'destructive' as const,
      icon: AlertCircle,
      className: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    },
    Pending: {
      variant: 'secondary' as const,
      icon: Clock,
      className: 'bg-pending text-pending-foreground hover:bg-pending/90'
    }
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className}`}>
      <Icon className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
}
