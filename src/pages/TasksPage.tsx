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
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from '@/lib/useTasks';
import { toast } from 'sonner';

export default function TasksPage() {
  const { data: tasks = [], isLoading, error, refetch } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

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
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const handleAddTask = async (taskData: {
    text: string;
    category: string;
    date?: string;
  }) => {
    try {
      const newTask: Omit<Task, 'id'> = {
        text: taskData.text,
        category: taskData.category,
        status: TaskStatus.TODO,
        deleted: false,
        deletedAt: null,
        notes: '',
        date: taskData.date, // Use the date from the form
      };

      const data = await createTask.mutateAsync(newTask);
      setSelectedTaskId(data.id);
      toast.success('Task created successfully');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save task';
      toast.error(message);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ id: taskId, status: newStatus });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update task status';
      toast.error(message);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await updateTask.mutateAsync({ id: taskId, deleted: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(message);
    }
  };

  const handleUndo = async (taskId: string) => {
    try {
      await updateTask.mutateAsync({ id: taskId, deleted: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to undo task deletion';
      toast.error(message);
    }
  };

  const handlePermanentDelete = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
      if (selectedTaskId === taskId) setSelectedTaskId(null);
      toast.success('Task permanently deleted');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to permanently delete task';
      toast.error(message);
    }
  };

  const handleSelectTask = (taskId: string | null) => {
    setSelectedTaskId(taskId);
  };

  const handleSaveNotes = async (taskId: string, notes: string) => {
    try {
      await updateTask.mutateAsync({ id: taskId, notes });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save notes';
      toast.error(message);
    }
  };

  const selectedTask: Task | null =
    tasks.find((t) => t.id === selectedTaskId) ?? null;

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
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  const resetErrorDismissed = () => {
    setIsErrorDismissed(false);
  };

  useEffect(() => {
    if (error) {
      resetErrorDismissed();
    }
  }, [error]);

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

        {errorMessage && !isErrorDismissed && (
          <div className="border-destructive/50 bg-destructive/10 flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-destructive size-5 shrink-0" />
              <p className="text-destructive text-sm font-semibold">
                {errorMessage}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="size-4" />
                Retry Load
              </Button>
              <Button
                onClick={() => setIsErrorDismissed(true)}
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
