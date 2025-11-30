import { useState } from "react";
import { Process, Status } from "@/types/data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { StatusControl } from "./StatusControl";
import { CommentSection } from "./CommentSection";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronRight, ChevronDown, Package, Eye } from "lucide-react";

interface ProcessListProps {
  processes: Process[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStatusChange: (processId: string, status: Status) => void;
  onAddComment: (processId: string, text: string) => void;
}

export function ProcessList({
  processes,
  selectedId,
  onSelect,
  onStatusChange,
  onAddComment,
}: ProcessListProps) {
  const [expandedProcesses, setExpandedProcesses] = useState<string[]>([]);

  const toggleProcess = (processId: string) => {
    if (expandedProcesses.includes(processId)) {
      setExpandedProcesses(expandedProcesses.filter((id) => id !== processId));
    } else {
      setExpandedProcesses([...expandedProcesses, processId]);
    }
  };

  const getProcessStats = (process: Process) => {
    const totalTasks = process.subprocesses.reduce(
      (sum, sub) => sum + sub.tasks.length,
      0
    );
    const approvedTasks = process.subprocesses.reduce(
      (sum, sub) =>
        sum + sub.tasks.filter((t) => t.status === "Approved").length,
      0
    );
    return { totalTasks, approvedTasks };
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Select a Process
          </h2>
        </div>
        {processes.map((process) => {
          const { totalTasks, approvedTasks } = getProcessStats(process);
          const isSelected = selectedId === process.id;
          const isExpanded = expandedProcesses.includes(process.id);

          return (
            <Tooltip key={process.id}>
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleProcess(process.id)}
              >
                <TooltipTrigger asChild>
                  <Card
                    className={`overflow-hidden transition-all hover:shadow-lg ${
                      isSelected
                        ? "border-primary border-2 bg-accent/50 shadow-md"
                        : ""
                    }`}
                  >
                    <CardHeader
                      className="p-4 cursor-pointer"
                      onClick={() => onSelect(process.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {process.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {process.description}
                          </p>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-2">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <div className="flex items-center justify-between mt-3 gap-2">
                        <StatusBadge status={process.status} />
                        <span className="text-sm font-medium text-muted-foreground">
                          {approvedTasks}/{totalTasks} approved
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(process.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4 space-y-4 border-t">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-foreground">
                            Update Status
                          </h4>
                          <StatusControl
                            currentStatus={process.status}
                            onStatusChange={(status) =>
                              onStatusChange(process.id, status)
                            }
                          />
                        </div>

                        <div className="pt-2 border-t">
                          <CommentSection
                            comments={process.comments}
                            onAddComment={(text) =>
                              onAddComment(process.id, text)
                            }
                          />
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">{process.name}</p>
                  <p className="text-xs">Click name to view subprocesses</p>
                  <p className="text-xs">Click arrow to review process</p>
                </TooltipContent>
              </Collapsible>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
