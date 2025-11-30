import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Process, Subprocess, Task } from '@/types/data';
import { StatusBadge } from './StatusBadge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar, User, MessageSquare } from 'lucide-react';

interface DetailedDataViewProps {
  item: Process | Subprocess | Task;
  type: 'process' | 'subprocess' | 'task';
}

export function DetailedDataView({ item, type }: DetailedDataViewProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{item.name}</CardTitle>
            <CardDescription className="mt-2">{item.description}</CardDescription>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Last Updated By</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {item.lastUpdatedBy || 'Not updated yet'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Last Updated At</p>
              <p className="text-sm font-semibold text-foreground">
                {item.lastUpdatedAt 
                  ? format(new Date(item.lastUpdatedAt), 'PPp')
                  : 'Never'
                }
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Total Comments</p>
              <p className="text-sm font-semibold text-foreground">
                {item.comments.length}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground">ID</p>
              <p className="text-sm font-mono text-foreground truncate">
                {item.id}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Statistics for Process/Subprocess */}
        {'subprocesses' in item && (
          <>
            <div className="grid grid-cols-3 gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{item.subprocesses.length}</p>
                <p className="text-xs text-muted-foreground">Subprocesses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {item.subprocesses.reduce((sum, sub) => sum + sub.tasks.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {item.subprocesses.reduce(
                    (sum, sub) => sum + sub.tasks.filter(t => t.status === 'Approved').length,
                    0
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {'tasks' in item && !('subprocesses' in item) && (
          <>
            <div className="grid grid-cols-3 gap-4 p-4 bg-accent/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{item.tasks.length}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {item.tasks.filter(t => t.status === 'Approved').length}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {item.tasks.filter(t => t.status === 'Needs Fix').length}
                </p>
                <p className="text-xs text-muted-foreground">Needs Fix</p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Comment History */}
        {item.comments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Recent Comments
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {item.comments.slice(0, 5).map((comment) => (
                <div key={comment.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.timestamp), 'PPp')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
