import { useEffect, useState } from 'react';
import type { Habit } from '@/types';
import { HabitList } from '@/components/HabitList';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import {
  useCreateHabit,
  useDeleteHabit,
  useHabits,
  useToggleCheckIn,
  useUpdateHabit,
} from '@/lib/useHabits';

export function HabitTrackerPage() {
  const { data: habits = [], isLoading, error, refetch } = useHabits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const toggleCheckIn = useToggleCheckIn();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);

  const handleAddHabit = async (
    habitData: Omit<Habit, 'id' | 'checkIns'>,
  ): Promise<boolean> => {
    try {
      await createHabit.mutateAsync(habitData);
      toast.success(`Habit "${habitData.name}" added successfully`, {
        position: 'top-center',
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add habit';
      toast.error(message, {
        position: 'top-center',
      });
      return false;
    }
  };

  const handleToggleCheckIn = async (habitId: string, date: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existingCheckIn = habit.checkIns.find((c) => c.date === date);
    const newCheckedState = existingCheckIn ? !existingCheckIn.isChecked : true;

    try {
      await toggleCheckIn.mutateAsync({
        habitId,
        date,
        existingCheckIn,
        newCheckedState,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to toggle checkIn';
      toast.error(message, {
        position: 'top-center',
      });
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId);
    if (!habitToDelete) return;

    const habitName = habitToDelete.name;

    try {
      await deleteHabit.mutateAsync(habitId);
      toast.success(`Habit "${habitName}" deleted successfully`, {
        position: 'top-center',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete habit';
      toast.error(message, {
        position: 'top-center',
      });
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };
  const handleSaveEdit = async (updatedHabit: Habit) => {
    try {
      await updateHabit.mutateAsync(updatedHabit);
      setEditingHabit(null);
      toast.success('Habit updated successfully', {
        position: 'top-center',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update habit';
      toast.error(message, {
        position: 'top-center',
      });
    }
  };
  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;
  useEffect(() => {
    if (error) {
      setIsErrorDismissed(false);
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl px-4">
      <AddHabitDialog onSave={handleAddHabit} />

      {errorMessage && !isErrorDismissed && (
        <div className="border-destructive/50 bg-destructive/10 my-4 flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-destructive size-5 shrink-0" />
            <p className="text-destructive text-sm font-semibold">
              {errorMessage}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                refetch();
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="size-4" />
              Retry
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
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : (
        <div className="p-6">
          <HabitList
            habits={habits}
            onToggleCheckIn={handleToggleCheckIn}
            onDelete={handleDeleteHabit}
            onEdit={handleEditHabit}
          />
        </div>
      )}

      {editingHabit && (
        <EditHabitDialog
          key={editingHabit.id}
          habit={editingHabit}
          open={!!editingHabit}
          onOpenChange={(open) => !open && setEditingHabit(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
