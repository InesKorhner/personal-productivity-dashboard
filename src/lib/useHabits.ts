import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from './api';
import type { CheckIn, Habit } from '@/types';

async function fetchHabits(): Promise<Habit[]> {
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

  return habitsData.map((habit: Habit) => ({
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
}

export function useHabits() {
  return useQuery({
    queryKey: ['habits', 'checkIns'],
    queryFn: fetchHabits,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation<Habit, Error, Omit<Habit, 'id' | 'checkIns'>>({
    mutationFn: async (habitData) => {
      const response = await fetch(getApiUrl('habits'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: habitData.name,
          frequency: habitData.frequency,
          section: habitData.section,
          startDate: habitData.startDate,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create habit');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', 'checkIns'] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation<Habit, Error, Habit>({
    mutationFn: async (updatedHabit: Habit) => {
      const response = await fetch(getApiUrl(`habits/${updatedHabit.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', 'checkIns'] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const checkInsResponse = await fetch(getApiUrl('checkIns'));
      if (!checkInsResponse.ok) {
        throw new Error('Failed to fetch check-ins');
      }
      const checkInsData = await checkInsResponse.json();

      const associatedCheckIns = checkInsData.filter(
        (checkIn: CheckIn & { habitId: string | null }) =>
          checkIn.habitId === id && checkIn.habitId !== null,
      );

      await Promise.all(
        associatedCheckIns.map((checkIn: CheckIn & { habitId: string }) =>
          fetch(getApiUrl(`checkIns/${checkIn.id}`), {
            method: 'DELETE',
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete check-in ${checkIn.id}`);
            }
          }),
        ),
      );

      const habitResponse = await fetch(getApiUrl(`habits/${id}`), {
        method: 'DELETE',
      });
      if (!habitResponse.ok) {
        throw new Error('Failed to delete habit');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', 'checkIns'] });
    },
  });
}

export function useToggleCheckIn() {
  const queryClient = useQueryClient();

  return useMutation<
  CheckIn,
  Error,
  {
    habitId: string;
    date: string;
    existingCheckIn?: CheckIn;
    newCheckedState: boolean;
  }
>({
    mutationFn: async ({
      habitId,
      date,
      existingCheckIn,
      newCheckedState,
    }: {
      habitId: string;
      date: string;
      existingCheckIn?: CheckIn;
      newCheckedState: boolean;
    }) => {
      if (existingCheckIn) {
        const response = await fetch(
          getApiUrl(`checkIns/${existingCheckIn.id}`),
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isChecked: newCheckedState }),
          },
        );
        if (!response.ok) {
          throw new Error('Failed to update checkIn');
        }
        const data = await response.json();
        return {
          id: data.id,
          date: data.date,
          isChecked: data.isChecked,
        };
      } else {
        const response = await fetch(getApiUrl('checkIns'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            habitId,
            date,
            isChecked: newCheckedState,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create checkIn');
        }
        const data = await response.json();
        return {
          id: data.id,
          date: data.date,
          isChecked: data.isChecked,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', 'checkIns'] });
    },
  });
}
