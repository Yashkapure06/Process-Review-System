/*
 * this is for type safety and to avoid any type errors and to make the code more readable and maintainable
 */

export type Status = "Pending" | "Approved" | "Needs Fix";

export interface Comment {
  id: string;
  text: string;
  user: string;
  timestamp: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: Status;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  comments: Comment[];
}

export interface Subprocess {
  id: string;
  name: string;
  description: string;
  status: Status;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  tasks: Task[];
  comments: Comment[];
}

export interface Process {
  id: string;
  name: string;
  description: string;
  status: Status;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  subprocesses: Subprocess[];
  comments: Comment[];
}

export interface ReviewState {
  processes: Process[];
  selectedProcessId: string | null;
  selectedSubprocessId: string | null;
}
