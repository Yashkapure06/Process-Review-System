import { useState } from 'react';
import { Task, Status } from '@/types/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusControl } from './StatusControl';
import { CommentSection } from './CommentSection';
import { StatusBadge } from './StatusBadge';
import { ChevronDown, ChevronRight, ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, status: Status) => void;
  onAddComment: (taskId: string, text: string) => void;
  selectedTaskIds?: Set<string>;
  onToggleTaskSelection?: (taskId: string) => void;
}

export function TaskList({ 
  tasks, 
  onTaskUpdate, 
  onAddComment,
  selectedTaskIds = new Set(),
  onToggleTaskSelection
}: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);

  const toggleTask = (taskId: string) => {
    if (expandedTasks.includes(taskId)) {
      setExpandedTasks(expandedTasks.filter(id => id !== taskId));
    } else {
      setExpandedTasks([...expandedTasks, taskId]);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <ListTodo className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Review Tasks</h2>
        </div>
        {tasks.map((task) => {
          const isExpanded = expandedTasks.includes(task.id);
          const isSelected = selectedTaskIds.has(task.id);
          
          return (
            <Tooltip key={task.id}>
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleTask(task.id)}
              >
                <TooltipTrigger asChild>
                  <Card className={`overflow-hidden hover:shadow-md transition-all ${
                    isSelected ? 'border-primary border-2' : ''
                  }`}>
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-3">
                        {onToggleTaskSelection && (
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleTaskSelection(task.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                        )}
                        <CollapsibleTrigger className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base flex items-center gap-2">
                                {task.name}
                                <StatusBadge status={task.status} />
                              </CardTitle>
                              <CardDescription className="mt-1">{task.description}</CardDescription>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground ml-4" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground ml-4" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                      </div>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className="pt-4 space-y-4 border-t">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">Update Status</h4>
                          <StatusControl
                            currentStatus={task.status}
                            onStatusChange={(status) => onTaskUpdate(task.id, status)}
                          />
                        </div>

                        <div className="pt-2 border-t">
                          <CommentSection
                            comments={task.comments}
                            onAddComment={(text) => onAddComment(task.id, text)}
                          />
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-xs">Click to {isExpanded ? 'collapse' : 'expand'} details</p>
                </TooltipContent>
              </Collapsible>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
