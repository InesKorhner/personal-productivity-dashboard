import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Habit } from '@/types';
import { HabitList } from '@/components/HabitList';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { toast } from 'sonner';
import { HabitListSkeleton } from '@/components/loading/HabitListSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import {
  useCreateHabit,
  useDeleteHabit,
  useHabits,
  useToggleCheckIn,
  useUpdateHabit,
} from '@/lib/useHabits';

export function HabitTrackerPage() {
  const location = useLocation();
  const { data: habits = [], isLoading, error, refetch } = useHabits();
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const toggleCheckIn = useToggleCheckIn();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const processedEditHabitIdRef = useRef<string | null>(null);

  // Check if we came from calendar with habit ID to edit
  // Only process once per navigation to prevent reopening on check-in clicks
  useEffect(() => {
    const editHabitId = (location.state as { editHabitId?: string })
      ?.editHabitId;

    // Only process if we have a new editHabitId that we haven't processed yet
    if (
      editHabitId &&
      editHabitId !== processedEditHabitIdRef.current &&
      habits.length > 0
    ) {
      const habitToEdit = habits.find((h) => h.id === editHabitId);
      if (habitToEdit && editingHabit?.id !== habitToEdit.id) {
        processedEditHabitIdRef.current = editHabitId;
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setEditingHabit(habitToEdit);
        // Clear the state to avoid reopening on re-render
        window.history.replaceState({}, document.title);
      }
    }

    // Reset the ref when location changes (new navigation)
    if (!editHabitId) {
      processedEditHabitIdRef.current = null;
    }
  }, [location.state, habits, editingHabit]);

  const handleAddHabit = async (
    habitData: Omit<Habit, 'id' | 'checkIns' | 'startDate'>,
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

      toast.success(`Habit "${updatedHabit.name}" updated successfully`, {
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

  const resetDismissed = () => {
    setIsErrorDismissed(false);
  };

  useEffect(() => {
    if (error) {
      resetDismissed();
    }
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-full space-y-4 p-4 sm:max-w-3xl md:p-6">
          {/* Add Habit Dialog button */}
          <AddHabitDialog onSave={handleAddHabit} />

          {/* Error message */}
          {errorMessage && !isErrorDismissed && (
            <ErrorMessage
              message={errorMessage}
              onRetry={() => refetch()}
              onDismiss={() => setIsErrorDismissed(true)}
              retryLabel="Retry"
            />
          )}

          {/* Loading or HabitList */}
          {isLoading ? (
            <HabitListSkeleton />
          ) : (
            <HabitList
              habits={habits}
              onToggleCheckIn={handleToggleCheckIn}
              onDelete={handleDeleteHabit}
              onEdit={handleEditHabit}
            />
          )}
        </div>
      </div>

      {/* EditHabitDialog - outside scrollable area */}
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
