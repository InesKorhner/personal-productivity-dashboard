import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskStatus, type Task } from '@/types';
import { CATEGORIES } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { CategoryList } from '@/components/CategoryList';
import { TaskView } from '@/components/TaskView';
import { NotesAside } from '@/components/NotesAside';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTasks() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('tasks'));
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      const savedCategory = localStorage.getItem('selectedCategory');
      return savedCategory || 'MyList';
    },
  );

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory ?? '');
  }, [selectedCategory]);

  const [selectedView, setSelectedView] = useState<
    'category' | 'completed' | 'deleted'
  >('category');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleAddTask = async (taskData: {
    text: string;
    category: string;
  }) => {
    try {
      const newTask: Omit<Task, 'id'> = {
        text: taskData.text,
        category: taskData.category,
        status: TaskStatus.TODO,
        deleted: false,
        deletedAt: null,
        notes: '',
      };

      const response = await fetch(getApiUrl('tasks'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error('Failed to save task to server');
      }
      const data = await response.json();
      
      setTasks((prev) => [...prev, data]);
      setSelectedTaskId(data.id);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save task';
      setError(message);
      console.error('Error saving task to server:', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const previousStatus = tasks.find((t) => t.id === taskId)?.status;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    try {
      const response = await fetch(getApiUrl(`tasks/${taskId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      console.error('Error updating task status:', err);
      if (previousStatus) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: previousStatus } : task,
          ),
        );
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, deleted: true } : task,
      ),
    );

    try {
      const response = await fetch(getApiUrl(`tasks/${taskId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleted: true,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      console.error('Error deleting task:', err);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, deleted: false, deletedAt: null }
            : task,
        ),
      );
    }
  };

  const handleUndo = async (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, deleted: false, deletedAt: null }
          : task,
      ),
    );

    try {
      const response = await fetch(getApiUrl(`tasks/${taskId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deleted: false,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to undo task deletion');
      }
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch (err) {
      console.error('Error undoing task deletion:', err);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                deleted: true,
                deletedAt: task.deletedAt || Date.now(),
              }
            : task,
        ),
      );
    }
  };

  const handlePermanentDelete = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskId === taskId) setSelectedTaskId(null);

    try {
      const response = await fetch(getApiUrl(`tasks/${taskId}`), {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to permanently delete task');
      }
    } catch (err) {
      console.error('Error permanently deleting task:', err);
      loadTasks();
    }
  };

  const handleSelectTask = (taskId: string | null) => {
    setSelectedTaskId(taskId);
  };

  const handleSaveNotes = async (taskId: string, notes: string) => {
    const originalTask = tasks.find((t) => t.id === taskId);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, notes } : t)),
    );

    try {
      const response = await fetch(getApiUrl(`tasks/${taskId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) {
        throw new Error('Failed to save notes');
      }
      const updatedTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (err) {
      console.error('Error saving notes:', err);
      if (originalTask) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? originalTask : t)),
        );
      }
    }
  };

  const selectedTask: Task | null =
    tasks.find(
      (t) => t.id === selectedTaskId && t.category === selectedCategory,
    ) ?? null;

  const taskListProps = {
    onStatusChange: handleStatusChange,
    onDelete: handleDelete,
    onUndo: handleUndo,
    onPermanentDelete: handlePermanentDelete,
    onSelectTask: handleSelectTask,
  };

  const categoryTasks = useMemo(
    () => tasks.filter((t) => t.category === selectedCategory),
    [tasks, selectedCategory],
  );

  return (
    <div className="grid h-screen grid-cols-[250px_1fr_400px] gap-6 p-6">
      <CategoryList
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        selectedView={selectedView}
        onSelectCategory={setSelectedCategory}
        onSelectView={setSelectedView}
      />

      <div className="flex flex-col gap-4">
        <AddTaskForm
          onAddTask={handleAddTask}
          selectedCategory={selectedCategory}
        />

        {error && (
          <div className="border-destructive/50 bg-destructive/10 flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-destructive size-5 shrink-0" />
              <p className="text-destructive text-sm font-semibold">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setError(null);
                  loadTasks();
                }}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="size-4" />
                Retry Load
              </Button>
              <Button
                onClick={() => setError(null)}
                variant="ghost"
                size="sm"
                aria-label="Dismiss error"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <>
            {selectedView === 'category' && (
              <TaskView
                {...taskListProps}
                tasks={categoryTasks}
                showToDo
                showCompleted
              />
            )}

            {selectedView === 'completed' && (
              <TaskView {...taskListProps} tasks={tasks} showCompleted />
            )}

            {selectedView === 'deleted' && (
              <TaskView {...taskListProps} tasks={tasks} showDeleted />
            )}
          </>
        )}
      </div>
      <NotesAside selectedTask={selectedTask} onSaveNotes={handleSaveNotes} />
    </div>
  );
}
