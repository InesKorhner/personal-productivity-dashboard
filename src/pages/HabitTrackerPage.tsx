import React from 'react';
import type { Habit } from '@/types';
import { HabitList } from '@/components/HabitList';
import { AddHabitDialog } from '@/components/AddHabitDialog';

export function HabitTrackerPage() {
  const [habits, setHabits] = React.useState<Habit[]>([]);

  const handleAddHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <AddHabitDialog onSave={handleAddHabit} />
      <div className="p-6">
        <HabitList habits={habits} />
      </div>{' '}
    </div>
  );
}
