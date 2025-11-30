import { useMemo } from 'react';
import { Process, Status } from '@/types/data';

/**
 * Custom hook for filtering processes based on search query and status
 */
export function useProcessFilter(
  processes: Process[],
  searchQuery: string,
  statusFilter: Status | 'All'
) {
  const filteredProcesses = useMemo(() => {

    // filtering the processes based on the search query and status
    return processes.filter(process => {
      const matchesSearch = !searchQuery || 
        process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.subprocesses.some(sub => 
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.tasks.some(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      
      const matchesStatus = statusFilter === 'All' || 
        process.status === statusFilter ||
        process.subprocesses.some(sub => 
          sub.status === statusFilter ||
          sub.tasks.some(task => task.status === statusFilter)
        );
      
      return matchesSearch && matchesStatus;
    });
  }, [processes, searchQuery, statusFilter]);

  return filteredProcesses;
}

