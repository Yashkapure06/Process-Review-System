import { Status } from '@/types/data';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface StatusControlProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
}

export function StatusControl({ currentStatus, onStatusChange }: StatusControlProps) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={currentStatus === 'Approved' ? 'default' : 'outline'}
        onClick={() => onStatusChange('Approved')}
        className={currentStatus === 'Approved' ? 'bg-success hover:bg-success/90' : ''}
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Approve
      </Button>
      <Button
        size="sm"
        variant={currentStatus === 'Needs Fix' ? 'default' : 'outline'}
        onClick={() => onStatusChange('Needs Fix')}
        className={currentStatus === 'Needs Fix' ? 'bg-destructive hover:bg-destructive/90' : ''}
      >
        <XCircle className="mr-2 h-4 w-4" />
        Needs Fix
      </Button>
      <Button
        size="sm"
        variant={currentStatus === 'Pending' ? 'default' : 'outline'}
        onClick={() => onStatusChange('Pending')}
        className={currentStatus === 'Pending' ? 'bg-pending hover:bg-pending/90' : ''}
      >
        <Clock className="mr-2 h-4 w-4" />
        Pending
      </Button>
    </div>
  );
}
