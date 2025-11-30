import { Process, Comment, Status } from "@/types/data";

const STORAGE_KEY = "process-review-state";

export interface StoredReviewState {
  processes: Process[];
  lastSync: string;
}

/*
 * This is the storage object that is used to store the review state in the localStorage.
 */

export const storage = {
  //* this is a setter function to store the data in the localStorage.
  save(processes: Process[]): void {
    const state: StoredReviewState = {
      processes,
      lastSync: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  //* this is a getter function to get the data from the localStorage.
  load(): StoredReviewState | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};

/*
 * Helper to merge fresh data with stored changes
 * @param freshData - The fresh data to merge with the stored data
 * @returns The merged data
 */
export function mergeWithStoredState(freshData: Process[]): Process[] {
  const stored = storage.load();
  if (!stored) return freshData;

  return freshData.map((process) => {
    const storedProcess = stored.processes.find((p) => p.id === process.id);
    if (!storedProcess) return process;
    // console.log("storedProcess===>>>>>", storedProcess);

    // console.log("process===>>>>>", process);

    return {
      ...process,
      status: storedProcess.status,
      comments: storedProcess.comments,
      lastUpdatedBy: storedProcess.lastUpdatedBy,
      lastUpdatedAt: storedProcess.lastUpdatedAt,
      subprocesses: process.subprocesses.map((subprocess) => {
        const storedSubprocess = storedProcess.subprocesses.find(
          (s) => s.id === subprocess.id
        );
        if (!storedSubprocess) return subprocess;
        // console.log("storedSubprocess===>>>>>", storedSubprocess);

        return {
          ...subprocess,
          status: storedSubprocess.status,
          comments: storedSubprocess.comments,
          lastUpdatedBy: storedSubprocess.lastUpdatedBy,
          lastUpdatedAt: storedSubprocess.lastUpdatedAt,
          tasks: subprocess.tasks.map((task) => {
            const storedTask = storedSubprocess.tasks.find(
              (t) => t.id === task.id
            );
            if (!storedTask) return task;

            return {
              ...task,
              status: storedTask.status,
              comments: storedTask.comments,
              lastUpdatedBy: storedTask.lastUpdatedBy,
              lastUpdatedAt: storedTask.lastUpdatedAt,
            };
          }),
        };
      }),
    };
  });
}
