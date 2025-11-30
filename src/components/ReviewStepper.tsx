import { Process, Subprocess } from "@/types/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReviewStep = "overview" | "subprocess" | "task" | "confirmation";

interface ReviewStepperProps {
  currentStep: ReviewStep;
  selectedProcess: Process | null;
  selectedSubprocess: Subprocess | null;
  onStepClick?: (step: ReviewStep) => void;
  allowSkip?: boolean;
}

interface StepInfo {
  id: ReviewStep;
  label: string;
  description: string;
}

const steps: StepInfo[] = [
  {
    id: "overview",
    label: "Process Overview",
    description: "Select and review processes",
  },
  {
    id: "subprocess",
    label: "Subprocess Review",
    description: "Review subprocesses",
  },
  {
    id: "task",
    label: "Task Review",
    description: "Review individual tasks",
  },
  {
    id: "confirmation",
    label: "Final Confirmation",
    description: "Confirm review completion",
  },
];

export function ReviewStepper({
  currentStep,
  selectedProcess,
  selectedSubprocess,
  onStepClick,
  allowSkip = false,
}: ReviewStepperProps) {
  const getStepIndex = (step: ReviewStep): number => {
    return steps.findIndex((s) => s.id === step);
  };

  const getStepStatus = (
    step: ReviewStep
  ): "completed" | "current" | "upcoming" | "blocked" => {
    const currentIndex = getStepIndex(currentStep);
    const stepIndex = getStepIndex(step);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";

    // Check if step is blocked
    if (step === "subprocess" && !selectedProcess) return "blocked";
    if (step === "task" && !selectedSubprocess) return "blocked";
    if (step === "confirmation" && !selectedProcess) return "blocked";

    return "upcoming";
  };

  const canNavigateToStep = (step: ReviewStep): boolean => {
    if (allowSkip) return true;

    const currentIndex = getStepIndex(currentStep);
    const stepIndex = getStepIndex(step);

    // Can always go back
    if (stepIndex < currentIndex) return true;

    // go to next step if prerequisites are met
    if (step === "subprocess" && selectedProcess) return true;
    if (step === "task" && selectedSubprocess) return true;
    if (step === "confirmation" && selectedProcess) return true;

    return false;
  };

  const handleStepClick = (step: ReviewStep) => {
    if (!onStepClick) return;

    const status = getStepStatus(step);
    if (status === "blocked" || (!allowSkip && !canNavigateToStep(step))) {
      return;
    }

    onStepClick(step);
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        {/* this is the steps component that displays the steps and their status */}
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable =
            canNavigateToStep(step.id) ||
            status === "completed" ||
            status === "current";
          const isBlocked = status === "blocked";

          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center gap-3 flex-1 min-w-0 text-left transition-all",
                    isClickable && !isBlocked
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-not-allowed opacity-50",
                    isBlocked && "opacity-40"
                  )}
                >
                  {/* this is the step icon component that displays the step icon and its status */}
                  <div className="flex-shrink-0">
                    {status === "completed" ? (
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                    ) : status === "current" ? (
                      <div className="h-7 w-7 ml-3 rounded-full bg-primary flex items-center justify-center ring-2 ring-primary ring-offset-2">
                        <Circle className="h-6 w-6 text-white fill-white" />
                      </div>
                    ) : isBlocked ? (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-semibold",
                        status === "current" && "text-primary",
                        status === "completed" && "text-green-600",
                        status === "blocked" && "text-muted-foreground",
                        status === "upcoming" && "text-foreground"
                      )}
                    >
                      {step.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {step.description}
                    </div>
                  </div>
                </button>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 mx-2">
                  <ChevronRight
                    className={cn(
                      "h-5 w-5",
                      status === "completed"
                        ? "text-green-500"
                        : "text-muted-foreground/30"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
