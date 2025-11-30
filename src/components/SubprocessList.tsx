import { useState } from "react";
import { Subprocess, Status } from "@/types/data";
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
import { ChevronRight, ChevronDown, Layers, Eye } from "lucide-react";

interface SubprocessListProps {
  subprocesses: Subprocess[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStatusChange: (subprocessId: string, status: Status) => void;
  onAddComment: (subprocessId: string, text: string) => void;
}

/*
 * this is the subprocess list component that displays the subprocesses and their tasks
 */

export function SubprocessList({
  subprocesses,
  selectedId,
  onSelect,
  onStatusChange,
  onAddComment,
}: SubprocessListProps) {
  const [expandedSubprocesses, setExpandedSubprocesses] = useState<string[]>(
    []
  );

  const toggleSubprocess = (subprocessId: string) => {
    if (expandedSubprocesses.includes(subprocessId)) {
      setExpandedSubprocesses(
        expandedSubprocesses.filter((id) => id !== subprocessId)
      );
    } else {
      setExpandedSubprocesses([...expandedSubprocesses, subprocessId]);
    }
  };

  const getSubprocessStats = (subprocess: Subprocess) => {
    const totalTasks = subprocess.tasks.length;
    const approvedTasks = subprocess.tasks.filter(
      (t) => t.status === "Approved"
    ).length;
    return { totalTasks, approvedTasks };
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Select a Subprocess
          </h2>
        </div>
        {subprocesses.map((subprocess) => {
          const { totalTasks, approvedTasks } = getSubprocessStats(subprocess);
          const isSelected = selectedId === subprocess.id;
          const isExpanded = expandedSubprocesses.includes(subprocess.id);

          return (
            <Tooltip key={subprocess.id}>
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleSubprocess(subprocess.id)}
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
                      onClick={() => onSelect(subprocess.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">
                            {subprocess.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {subprocess.description}
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
                        <StatusBadge status={subprocess.status} />
                        <span className="text-sm font-medium text-muted-foreground">
                          {approvedTasks}/{totalTasks} approved
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(subprocess.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Tasks
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
                            currentStatus={subprocess.status}
                            onStatusChange={(status) =>
                              onStatusChange(subprocess.id, status)
                            }
                          />
                        </div>

                        <div className="pt-2 border-t">
                          <CommentSection
                            comments={subprocess.comments}
                            onAddComment={(text) =>
                              onAddComment(subprocess.id, text)
                            }
                          />
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">{subprocess.name}</p>
                  <p className="text-xs">Click name to view tasks</p>
                  <p className="text-xs">Click arrow to review subprocess</p>
                </TooltipContent>
              </Collapsible>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
