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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TasksPageContext } from '@/contexts/TasksPageContext';

// Notes component helper - rendered as Sheet on mobile/tablet, aside on desktop
const renderNotesComponent = (
  selectedTask: Task | null,
  onSaveNotes: (taskId: string, notes: string) => void,
  scrollable: boolean,
) => (
  <NotesAside
    selectedTask={selectedTask}
    onSaveNotes={onSaveNotes}
    scrollable={scrollable}
  />
);

export default function TasksPage() {
  const { data: tasks = [], isLoading, error, refetch } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(min-width: 1280px)').matches;
    }
    return false;
  });

  // Check if we're on desktop (≥ 1280px) for grid layout
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      if (typeof window !== 'undefined') {
        const savedCategory = localStorage.getItem('selectedCategory');
        return savedCategory || CATEGORIES[0];
      }
      return CATEGORIES[0];
    },
  );

  // Save category to localStorage when it changes
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', selectedCategory);
    }
  }, [selectedCategory]);

  const [selectedView, setSelectedView] = useState<'category'>('category');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [notesSheetOpen, setNotesSheetOpen] = useState(false);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const resetErrorDismissed = () => {
    setIsErrorDismissed(false);
  };

  useEffect(() => {
    if (error) {
      resetErrorDismissed();
    }
  }, [error]);

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
    // Open notes sheet on mobile/tablet (< 1280px) when task is selected
    // On desktop (≥ 1280px), Notes are always visible in the grid sidebar
    if (taskId && !isDesktop) {
      setNotesSheetOpen(true);
    }
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

  const categoryTasks = useMemo(() => {
    if (!selectedCategory) return [];
    return tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({ selectedView, onSelectView: setSelectedView }),
    [selectedView],
  );

  return (
    <TasksPageContext.Provider value={contextValue}>
      <div className="flex h-full w-full flex-col overflow-hidden xl:grid xl:grid-cols-[250px_1fr_400px] xl:gap-6 xl:p-6">
        {/* Desktop: CategoryList sidebar */}
        <div className="hidden w-full min-w-0 xl:block">
          <CategoryList
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            selectedView="category"
            onSelectCategory={setSelectedCategory}
            onSelectView={setSelectedView}
          />
        </div>

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:h-full lg:min-h-0 lg:w-full">
          {/* Mobile/Tablet: Filter bar with category select */}
          {!isDesktop && (
            <div className="bg-background shrink-0 border-b px-4 py-3">
              <div className="mx-auto w-full max-w-3xl">
                <Select
                  value={selectedCategory || undefined}
                  onValueChange={(value) => {
                    setSelectedView('category');
                    setSelectedCategory(value);
                  }}
                >
                  <SelectTrigger className="h-9 w-full text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Tasks area - single scroll */}
          <div className="flex min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="w-full min-w-0 flex-1">
              <div className="w-full max-w-full p-4 md:p-6">
                <div className="mx-auto w-full max-w-3xl space-y-4">
                  <AddTaskForm
                    onAddTask={handleAddTask}
                    selectedCategory={selectedCategory}
                  />

                  {errorMessage && !isErrorDismissed && (
                    <div className="border-destructive/50 bg-destructive/10 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-3">
                        <AlertCircle className="text-destructive size-5 shrink-0" />
                        <p className="text-destructive text-sm font-semibold break-words">
                          {errorMessage}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          onClick={() => refetch()}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="size-4" />
                          <span className="hidden sm:inline">Retry Load</span>
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
                    <TaskView
                      {...taskListProps}
                      tasks={categoryTasks}
                      showToDo
                      showCompleted
                      showDeleted
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NotesAside - Desktop: visible in grid sidebar (≥ 1280px) */}
        <div className="bg-background hidden w-full min-w-0 xl:block">
          {renderNotesComponent(selectedTask, handleSaveNotes, true)}
        </div>

        {/* NotesAside - Mobile/Tablet: Sheet (< 1280px) */}
        {!isDesktop && (
          <Sheet open={notesSheetOpen} onOpenChange={setNotesSheetOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md">
              {renderNotesComponent(selectedTask, handleSaveNotes, false)}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </TasksPageContext.Provider>
  );
}
