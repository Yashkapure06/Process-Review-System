import { useState, useCallback } from 'react';
import { Process, Status } from '@/types/data';
import { toast } from 'sonner';

/**
 * Custom hook for managing process state and operations
 * Encapsulates all state update logic for better architecture
 */
export function useProcessState(initialProcesses: Process[] = []) {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);

  const updateProcessStatus = useCallback((processId: string, status: Status) => {
    setProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { ...p, status, lastUpdatedBy: 'Reviewer 1', lastUpdatedAt: new Date().toISOString() }
        : p
    ));
    toast.success('Process status updated');
  }, []);

  const addProcessComment = useCallback((processId: string, text: string) => {
    setProcesses(prev => prev.map(p => 
      p.id === processId 
        ? { 
            ...p, 
            comments: [
              { id: crypto.randomUUID(), text, user: 'Reviewer 1', timestamp: new Date().toISOString() },
              ...p.comments
            ],
            lastUpdatedBy: 'Reviewer 1',
            lastUpdatedAt: new Date().toISOString()
          }
        : p
    ));
    toast.success('Comment added');
  }, []);

  const updateSubprocessStatus = useCallback((subprocessId: string, status: Status) => {
    setProcesses(prev => prev.map(p => ({
      ...p,
      subprocesses: p.subprocesses.map(s => 
        s.id === subprocessId 
          ? { ...s, status, lastUpdatedBy: 'Reviewer 1', lastUpdatedAt: new Date().toISOString() }
          : s
      )
    })));
    toast.success('Subprocess status updated');
  }, []);

  const addSubprocessComment = useCallback((subprocessId: string, text: string) => {
    setProcesses(prev => prev.map(p => ({
      ...p,
      subprocesses: p.subprocesses.map(s => 
        s.id === subprocessId 
          ? {
              ...s,
              comments: [
                { id: crypto.randomUUID(), text, user: 'Reviewer 1', timestamp: new Date().toISOString() },
                ...s.comments
              ],
              lastUpdatedBy: 'Reviewer 1',
              lastUpdatedAt: new Date().toISOString()
            }
          : s
      )
    })));
    toast.success('Comment added');
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: Status) => {
    setProcesses(prev => prev.map(p => ({
      ...p,
      subprocesses: p.subprocesses.map(s => ({
        ...s,
        tasks: s.tasks.map(t => 
          t.id === taskId 
            ? { ...t, status, lastUpdatedBy: 'Reviewer 1', lastUpdatedAt: new Date().toISOString() }
            : t
        )
      }))
    })));
    toast.success('Task status updated');
  }, []);

  const addTaskComment = useCallback((taskId: string, text: string) => {
    setProcesses(prev => prev.map(p => ({
      ...p,
      subprocesses: p.subprocesses.map(s => ({
        ...s,
        tasks: s.tasks.map(t => 
          t.id === taskId 
            ? {
                ...t,
                comments: [
                  { id: crypto.randomUUID(), text, user: 'Reviewer 1', timestamp: new Date().toISOString() },
                  ...t.comments
                ],
                lastUpdatedBy: 'Reviewer 1',
                lastUpdatedAt: new Date().toISOString()
              }
            : t
        )
      }))
    })));
    toast.success('Comment added');
  }, []);

  const updateMultipleTaskStatuses = useCallback((taskIds: string[], status: Status) => {
    setProcesses(prev => prev.map(p => ({
      ...p,
      subprocesses: p.subprocesses.map(s => ({
        ...s,
        tasks: s.tasks.map(t => 
          taskIds.includes(t.id)
            ? { ...t, status, lastUpdatedBy: 'Reviewer 1', lastUpdatedAt: new Date().toISOString() }
            : t
        )
      }))
    })));
    toast.success(`${taskIds.length} tasks updated`);
  }, []);

  return {
    processes,
    setProcesses,
    updateProcessStatus,
    addProcessComment,
    updateSubprocessStatus,
    addSubprocessComment,
    updateTaskStatus,
    addTaskComment,
    updateMultipleTaskStatuses,
  };
}

