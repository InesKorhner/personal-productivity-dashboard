import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from './api';
import { type Task } from '@/types';

async function fetchTasks() {
  const response = await fetch(getApiUrl('tasks'));
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
    mutationFn: async (taskData: Omit<Task, 'id'>) => {
        const response = await fetch(getApiUrl('tasks'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData),
        });
        if (!response.ok) {
            throw new Error('Failed to save task to server');
        }
        return response.json();
    },
    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['tasks']});
    }
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
            const response = await fetch(getApiUrl(`tasks/${id}`), {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        }
    })
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(getApiUrl(`tasks/${id}`), {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tasks']});
        }
    })
}