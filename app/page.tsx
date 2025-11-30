"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockApi } from "@/lib/mockApi";
import { storage, mergeWithStoredState } from "@/lib/storage";
import { Status } from "@/types/data";
import { useProcessState } from "@/hooks/useProcessState";
import { useProcessFilter } from "@/hooks/useProcessFilter";
import { Dashboard } from "@/components/Dashboard";
import { ProcessList } from "@/components/ProcessList";
import { SubprocessList } from "@/components/SubprocessList";
import { TaskList } from "@/components/TaskList";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SearchFilter } from "@/components/SearchFilter";
import { BulkActions } from "@/components/BulkActions";
import { DetailedDataView } from "@/components/DetailedDataView";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ReviewStepper, ReviewStep } from "@/components/ReviewStepper";
import { FinalConfirmation } from "@/components/FinalConfirmation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw, RotateCcw, Download, FileText, Table } from "lucide-react";
import { toast } from "sonner";
import { exportToPDF, exportToCSV } from "@/lib/export";

/*
 * Main page component for the Process Review System
 * Implements a guided review flow with hierarchical navigation
 */
export default function Home() {
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(
    null
  );
  const [selectedSubprocessId, setSelectedSubprocessId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [focusedIndex, setFocusedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<ReviewStep>("overview");
  const [skipWarningOpen, setSkipWarningOpen] = useState(false);
  const [pendingStepNavigation, setPendingStepNavigation] =
    useState<ReviewStep | null>(null);

  /*
   * Data fetching from the API.
   */

  const { data, isLoading, error } = useQuery({
    queryKey: ["processes"],
    queryFn: mockApi.getProcesses,
  });

  /*
   * I have used useProcessState custom hook to manage the process state and operations.
   * It is a good practice to use useProcessState custom hook to manage the process state and operations.
   */

  const {
    processes,
    setProcesses,
    updateProcessStatus,
    addProcessComment,
    updateSubprocessStatus,
    addSubprocessComment,
    updateTaskStatus,
    addTaskComment,
    updateMultipleTaskStatuses,
  } = useProcessState();

  /*
   * here we are filtering the processes based on the search query and status filter.
   */

  const filteredProcesses = useProcessFilter(
    processes,
    searchQuery,
    statusFilter
  );

  /*
   * here we are initializing the processes from the API and merging with the stored state.
   */

  useEffect(() => {
    if (data) {
      const merged = mergeWithStoredState(data);
      setProcesses(merged);
    }
  }, [data, setProcesses]);

  /*
   * storing the changes to the localStorage.
   */

  useEffect(() => {
    if (processes.length > 0) {
      storage.save(processes);
    }
  }, [processes]);

  /*
   * deriving the state based on the selected process and subprocess.
   */

  const selectedProcess = processes.find((p) => p.id === selectedProcessId);
  const selectedSubprocess = selectedProcess?.subprocesses.find(
    (s) => s.id === selectedSubprocessId
  );

  // checking current step based on selections
  useEffect(() => {
    // this will avoid auto-changing the step if we're on confirmation
    if (currentStep === "confirmation") {
      return;
    }

    if (selectedSubprocessId) {
      setCurrentStep("task");
    } else if (selectedProcessId) {
      setCurrentStep("subprocess");
    } else {
      setCurrentStep("overview");
    }
  }, [selectedProcessId, selectedSubprocessId, currentStep]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(taskId)) {
        newSelection.delete(taskId);
      } else {
        newSelection.add(taskId);
      }
      return newSelection;
    });
  };

  const handleBulkApprove = () => {
    const count = selectedTaskIds.size;
    const taskIds = Array.from(selectedTaskIds);
    updateMultipleTaskStatuses(taskIds, "Approved");
    setSelectedTaskIds(new Set());
    toast.success(`${count} tasks approved`);
  };

  const handleBulkReject = () => {
    const count = selectedTaskIds.size;
    const taskIds = Array.from(selectedTaskIds);
    updateMultipleTaskStatuses(taskIds, "Needs Fix");
    setSelectedTaskIds(new Set());
    toast.success(`${count} tasks marked as needs fix`);
  };

  const handleBulkPending = () => {
    const count = selectedTaskIds.size;
    const taskIds = Array.from(selectedTaskIds);
    updateMultipleTaskStatuses(taskIds, "Pending");
    setSelectedTaskIds(new Set());
    toast.success(`${count} tasks marked as pending`);
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all review data? This cannot be undone."
      )
    ) {
      storage.clear();
      window.location.reload();
    }
  };

  const handleExportPDF = () => {
    exportToPDF(processes);
    toast.success("Exported to PDF");
  };

  const handleExportCSV = () => {
    exportToCSV(processes);
    toast.success("Exported to CSV");
  };

  // step navigation with validation
  const handleStepNavigation = (targetStep: ReviewStep) => {
    const stepOrder: ReviewStep[] = [
      "overview",
      "subprocess",
      "task",
      "confirmation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(targetStep);

    if (targetIndex < currentIndex) {
      // allowed to go back to previous step
      setCurrentStep(targetStep);
      if (targetStep === "overview") {
        setSelectedProcessId(null);
        setSelectedSubprocessId(null);
      } else if (targetStep === "subprocess") {
        setSelectedSubprocessId(null);
      }
      return;
    }

    if (targetStep === "subprocess" && !selectedProcessId) {
      setPendingStepNavigation(targetStep);
      setSkipWarningOpen(true);
      return;
    }

    if (targetStep === "task" && !selectedSubprocessId) {
      setPendingStepNavigation(targetStep);
      setSkipWarningOpen(true);
      return;
    }

    if (targetStep === "confirmation" && !selectedProcessId) {
      setPendingStepNavigation(targetStep);
      setSkipWarningOpen(true);
      return;
    }

    setCurrentStep(targetStep);
  };

  const handleSkipWarningConfirm = () => {
    if (pendingStepNavigation) {
      toast.warning("Skipping required steps may result in incomplete review");
      setCurrentStep(pendingStepNavigation);
      setPendingStepNavigation(null);
    }
    setSkipWarningOpen(false);
  };

  const handleFinalizeReview = () => {
    if (selectedProcess) {
      toast.success(`Review finalized for ${selectedProcess.name}`);
      // TODO: Add additional logic here like marking as complete
    }
  };

  /*
   * This is simple function to get the breadcrumb items based on the selected process and subprocess.
   */
  const getBreadcrumbItems = () => {
    const items = [
      {
        label: "Dashboard",
        onClick: () => {
          setSelectedProcessId(null);
          setSelectedSubprocessId(null);
        },
      },
    ];

    if (selectedProcess) {
      items.push({
        label: selectedProcess.name,
        onClick: selectedSubprocessId
          ? () => setSelectedSubprocessId(null)
          : () => {},
      });
    }

    if (selectedSubprocess) {
      items.push({ label: selectedSubprocess.name, onClick: () => {} });
    }

    return items;
  };
  /*
   * this is initial loading state
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg text-foreground">Loading processes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6">
          <p className="text-destructive">
            Error loading data. Please refresh the page.
          </p>
        </Card>
      </div>
    );
  }

  return (
    //* i have wrapped with error boundary component that displays the error message if the data is not loaded which is a good practice
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <img
                    src="/logo.jpg"
                    alt="Process Review System"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  Process Review System
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Pharmaceutical Manufacturing Process Data Review & Approval
                </p>
              </div>
              <div className="flex gap-2 self-start md:self-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCSV}>
                      <Table className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Data
                </Button>
              </div>
            </div>
            {(selectedProcessId || selectedSubprocessId) && (
              <div className="mt-4 pt-4 border-t">
                <Breadcrumb items={getBreadcrumbItems()} />
              </div>
            )}
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 md:py-8">
          {/* Review Stepper */}
          <ReviewStepper
            currentStep={currentStep}
            selectedProcess={selectedProcess || null}
            selectedSubprocess={selectedSubprocess || null}
            onStepClick={handleStepNavigation}
            allowSkip={false}
          />

          {currentStep === "confirmation" && selectedProcess ? (
            <FinalConfirmation
              process={selectedProcess}
              onComplete={handleFinalizeReview}
              onBack={() => {
                setCurrentStep("task");
              }}
            />
          ) : !selectedProcessId ? (
            <>
              <SearchFilter
                onSearchChange={setSearchQuery}
                onStatusFilter={setStatusFilter}
              />
              <Dashboard
                processes={filteredProcesses}
                onSelectProcess={(id) => {
                  setSelectedProcessId(id);
                  setSelectedSubprocessId(null);
                }}
              />
            </>
          ) : (
            <>
              <SearchFilter
                onSearchChange={setSearchQuery}
                onStatusFilter={setStatusFilter}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column - Process Selection */}
                <div className="lg:col-span-1">
                  <ProcessList
                    processes={filteredProcesses}
                    selectedId={selectedProcessId}
                    onSelect={(id) => {
                      setSelectedProcessId(id);
                      setSelectedSubprocessId(null);
                    }}
                    onStatusChange={updateProcessStatus}
                    onAddComment={addProcessComment}
                  />
                </div>

                {/* Middle Column - Subprocess Selection */}
                {selectedProcess && (
                  <div className="lg:col-span-1">
                    <SubprocessList
                      subprocesses={selectedProcess.subprocesses}
                      selectedId={selectedSubprocessId}
                      onSelect={setSelectedSubprocessId}
                      onStatusChange={updateSubprocessStatus}
                      onAddComment={addSubprocessComment}
                    />
                  </div>
                )}

                {/* Right Column -  Process/Subprocess Details */}
                {selectedProcess && (
                  <div className="lg:col-span-1 space-y-4">
                    {selectedSubprocess ? (
                      <>
                        <DetailedDataView
                          item={selectedSubprocess}
                          type="subprocess"
                        />
                        <TaskList
                          tasks={selectedSubprocess.tasks}
                          onTaskUpdate={updateTaskStatus}
                          onAddComment={addTaskComment}
                          selectedTaskIds={selectedTaskIds}
                          onToggleTaskSelection={toggleTaskSelection}
                        />
                      </>
                    ) : (
                      <DetailedDataView item={selectedProcess} type="process" />
                    )}
                  </div>
                )}
              </div>

              <BulkActions
                selectedCount={selectedTaskIds.size}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                onBulkPending={handleBulkPending}
                onClearSelection={() => setSelectedTaskIds(new Set())}
              />
            </>
          )}
        </main>

        {/* Skip Warning Dialog */}
        <Dialog open={skipWarningOpen} onOpenChange={setSkipWarningOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Skip Required Step?</DialogTitle>
              <DialogDescription>
                {pendingStepNavigation === "subprocess" &&
                  "You need to select a process before reviewing subprocesses."}
                {pendingStepNavigation === "task" &&
                  "You need to select a subprocess before reviewing tasks."}
                {pendingStepNavigation === "confirmation" &&
                  "You need to select a process before finalizing the review."}
                <br />
                <br />
                Skipping this step may result in an incomplete review. Do you
                want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSkipWarningOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSkipWarningConfirm}>
                Skip Anyway
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
}
