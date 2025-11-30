import { Process } from "@/types/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface FinalConfirmationProps {
  process: Process;
  onComplete?: () => void;
  onBack?: () => void;
}

export function FinalConfirmation({
  process,
  onComplete,
  onBack,
}: FinalConfirmationProps) {
  const getReviewStats = () => {
    const totalSubprocesses = process.subprocesses.length;
    const totalTasks = process.subprocesses.reduce(
      (sum, sub) => sum + sub.tasks.length,
      0
    );

    const approvedSubprocesses = process.subprocesses.filter(
      (s) => s.status === "Approved"
    ).length;
    const approvedTasks = process.subprocesses.reduce(
      (sum, sub) =>
        sum + sub.tasks.filter((t) => t.status === "Approved").length,
      0
    );

    const needsFixSubprocesses = process.subprocesses.filter(
      (s) => s.status === "Needs Fix"
    ).length;
    const needsFixTasks = process.subprocesses.reduce(
      (sum, sub) =>
        sum + sub.tasks.filter((t) => t.status === "Needs Fix").length,
      0
    );

    const pendingSubprocesses = process.subprocesses.filter(
      (s) => s.status === "Pending"
    ).length;
    const pendingTasks = process.subprocesses.reduce(
      (sum, sub) =>
        sum + sub.tasks.filter((t) => t.status === "Pending").length,
      0
    );

    return {
      totalSubprocesses,
      totalTasks,
      approvedSubprocesses,
      approvedTasks,
      needsFixSubprocesses,
      needsFixTasks,
      pendingSubprocesses,
      pendingTasks,
    };
  };

  const stats = getReviewStats();
  const allReviewed =
    stats.pendingSubprocesses === 0 && stats.pendingTasks === 0;
  const hasNeedsFix = stats.needsFixSubprocesses > 0 || stats.needsFixTasks > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          Review Summary: {process.name}
        </CardTitle>
        <CardDescription>
          Review the summary before finalizing your review
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Process Status */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">
            Process Status
          </h3>
          <div className="flex items-center gap-2">
            <StatusBadge status={process.status} />
            <span className="text-sm text-muted-foreground">
              Last updated:{" "}
              {new Date(process.lastUpdatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Approved */}
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Approved
                </span>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {stats.approvedSubprocesses}/{stats.totalSubprocesses}{" "}
                subprocesses
              </div>
              <div className="text-lg text-green-600 dark:text-green-500">
                {stats.approvedTasks}/{stats.totalTasks} tasks
              </div>
            </CardContent>
          </Card>

          {/* Needs Fix */}
          {hasNeedsFix && (
            <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                    Needs Fix
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {stats.needsFixSubprocesses}/{stats.totalSubprocesses}{" "}
                  subprocesses
                </div>
                <div className="text-lg text-red-600 dark:text-red-500">
                  {stats.needsFixTasks}/{stats.totalTasks} tasks
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending */}
          {!allReviewed && (
            <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    Pending
                  </span>
                </div>
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {stats.pendingSubprocesses}/{stats.totalSubprocesses}{" "}
                  subprocesses
                </div>
                <div className="text-lg text-yellow-600 dark:text-yellow-500">
                  {stats.pendingTasks}/{stats.totalTasks} tasks
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Warnings */}
        {!allReviewed && (
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                    Review Incomplete
                  </p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">
                    There are still {stats.pendingSubprocesses} subprocesses and{" "}
                    {stats.pendingTasks} tasks pending review. You can still
                    finalize, but consider reviewing all items first.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comments Summary */}
        {process.comments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-foreground">
              Process Comments
            </h3>
            <div className="space-y-2">
              {process.comments.slice(0, 3).map((comment) => (
                <Card key={comment.id} className="bg-muted/50">
                  <CardContent className="pt-3 pb-3">
                    <p className="text-sm text-foreground">{comment.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {comment.user} •{" "}
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {process.comments.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{process.comments.length - 3} more comments
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back to Review
            </Button>
          )}
          <Button
            onClick={onComplete}
            className="flex-1"
            variant={allReviewed ? "default" : "default"}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {allReviewed ? "Finalize Review" : "Finalize Anyway"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
