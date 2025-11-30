import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Status } from '@/types/data';

interface BulkActionsProps {
  selectedCount: number;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkPending: () => void;
  onClearSelection: () => void;
}

export function BulkActions({ 
  selectedCount, 
  onBulkApprove, 
  onBulkReject, 
  onBulkPending,
  onClearSelection 
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border-2 border-primary shadow-2xl rounded-lg p-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="font-semibold text-foreground">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={onBulkApprove} className="bg-success hover:bg-success/90">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve All
          </Button>
          <Button size="sm" onClick={onBulkReject} variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Reject All
          </Button>
          <Button size="sm" onClick={onBulkPending} className="bg-pending hover:bg-pending/90">
            <Clock className="h-4 w-4 mr-2" />
            Mark Pending
          </Button>
          <Button size="sm" onClick={onClearSelection} variant="outline">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
