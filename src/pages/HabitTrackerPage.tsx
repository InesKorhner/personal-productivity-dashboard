import { useEffect, useState } from 'react';
import type { Habit, CheckIn } from '@/types';
import { HabitList } from '@/components/HabitList';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

export function HabitTrackerPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  async function loadHabits() {
    setIsLoading(true);
    setError(null);
    try {
      const [habitsResponse, checkInsResponse] = await Promise.all([
        fetch(getApiUrl('habits')),
        fetch(getApiUrl('checkIns')),
      ]);

      if (!habitsResponse.ok) {
        throw new Error('Failed to fetch habits');
      }
      if (!checkInsResponse.ok) {
        throw new Error('Failed to fetch checkIns');
      }

      const habitsData = await habitsResponse.json();
      const checkInsData = await checkInsResponse.json();

      const habitsWithCheckIns: Habit[] = habitsData.map((habit: Habit) => ({
        ...habit,
        checkIns:
          checkInsData
            .filter(
              (checkIn: CheckIn & { habitId: string | null }) =>
                checkIn.habitId === habit.id && checkIn.habitId !== null,
            )
            .map(
              (checkIn: CheckIn & { habitId: string }): CheckIn => ({
                id: checkIn.id,
                date: checkIn.date,
                isChecked: checkIn.isChecked,
              }),
            ) || [],
      }));

      setHabits(habitsWithCheckIns);
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
    loadHabits();
  }, []);

  const handleAddHabit = async (
    habitData: Omit<Habit, 'id' | 'checkIns'>,
  ): Promise<boolean> => {
    try {
      const response = await fetch(getApiUrl('habits'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: habitData.name,
          frequency: habitData.frequency,
          section: habitData.section,
          startDate: habitData.startDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save habit to server');
      }

      const data = await response.json();
      const newHabit: Habit = {
        ...data,
        checkIns: [],
      };

      setHabits((prev) => [...prev, newHabit]);
      setError(null);
      toast.success(`Habit "${newHabit.name}" added successfully`, {
        position: 'top-center',
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to add habit';
      setError(message);
      console.error('Error saving habit to server:', err);
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
      let updatedCheckIn: CheckIn;

      if (existingCheckIn) {
        const response = await fetch(
          getApiUrl(`checkIns/${existingCheckIn.id}`),
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isChecked: newCheckedState,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update checkIn');
        }

        const data = await response.json();
        updatedCheckIn = {
          id: data.id,
          date: data.date,
          isChecked: data.isChecked,
        };
      } else {
        const newCheckInData: Omit<CheckIn, 'id'> & { habitId: string } = {
          habitId,
          date,
          isChecked: newCheckedState,
        };
        const response = await fetch(getApiUrl('checkIns'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCheckInData),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkIn');
        }

        const data = await response.json();
        updatedCheckIn = {
          id: data.id,
          date: data.date,
          isChecked: data.isChecked,
        };
      }

      // Update local state with server response (no full reload needed)
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;

          const checkInExists = h.checkIns.some((c) => c.date === date);
          const updatedCheckIns = checkInExists
            ? h.checkIns.map((c) => (c.date === date ? updatedCheckIn : c))
            : [...h.checkIns, updatedCheckIn];

          return { ...h, checkIns: updatedCheckIns };
        }),
      );
      setError(null);
    } catch (err) {
      console.error('Error toggling checkIn:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to toggle checkIn';
      setError(message);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId);
    if (!habitToDelete) return;

    const habitName = habitToDelete.name;

    try {
      const habitResponse = await fetch(getApiUrl(`habits/${habitId}`), {
        method: 'DELETE',
      });

      if (!habitResponse.ok) {
        throw new Error('Failed to delete habit');
      }

      await Promise.all(
        habitToDelete.checkIns.map(async (checkIn) => {
          await fetch(getApiUrl(`checkIns/${checkIn.id}`), {
            method: 'DELETE',
          });
        }),
      );

      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      setError(null);
      toast.success(`Habit "${habitName}" deleted successfully`, {
        position: 'top-center',
      });
    } catch (err) {
      console.error('Error deleting habit:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to delete habit';
      setError(message);
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
      const response = await fetch(getApiUrl(`habits/${updatedHabit.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedHabit.name,
          frequency: updatedHabit.frequency,
          section: updatedHabit.section,
          startDate: updatedHabit.startDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update habit');
      }

      const data = await response.json();
      setHabits((prev) =>
        prev.map((h) =>
          h.id === updatedHabit.id
            ? { ...data, checkIns: updatedHabit.checkIns }
            : h,
        ),
      );
      setEditingHabit(null);
      setError(null);
    } catch (err) {
      console.error('Error updating habit:', err);
      const message =
        err instanceof Error ? err.message : 'Failed to update habit';
      setError(message);
      toast.error(message, {
        position: 'top-center',
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <AddHabitDialog onSave={handleAddHabit} />

      {error && (
        <div className="border-destructive/50 bg-destructive/10 my-4 flex items-center justify-between gap-4 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-destructive size-5 shrink-0" />
            <p className="text-destructive text-sm font-semibold">{error}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setError(null);
                loadHabits();
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="size-4" />
              Retry
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
