import { Process } from '@/types/data';

/**
 * Mock API client
 * Uses Next.js API routes for data fetching
 */
export const mockApi = {
  /**
   * Fetches all processes from the API
   * @returns Promise resolving to array of processes
   */
  async getProcesses(): Promise<Process[]> {
    const response = await fetch('/api/processes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching for development
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch processes: ${response.statusText}`);
    }

    return response.json() as Promise<Process[]>;
  }
};
