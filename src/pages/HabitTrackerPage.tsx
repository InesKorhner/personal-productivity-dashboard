import React from 'react';
import type { Habit } from '@/types';
import { AddHabitButton } from '@/components/AddHabitButton';
import { AddHabitForm } from '@/components/AddHabitForm';
import { HabitList } from '@/components/HabitList';

export function HabitTrackerPage() {
  const [showForm, setShowForm] = React.useState(false);
  const [habits, setHabits] = React.useState<Habit[]>([]);

  const handleAddHabit = (habit: Habit) => {
    setHabits([...habits, habit]);
    setShowForm(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <AddHabitButton
        onClick={() => setShowForm(!showForm)}
        noHabitsText={
          habits.length === 0
            ? 'No habits yet. Try adding your first habit.'
            : undefined
        }
      />
      {showForm && (
        <AddHabitForm
          onSave={handleAddHabit}
          onCancel={() => setShowForm(false)}
        />
      )}
      <div className="p-6">
        <HabitList habits={habits} />
      </div>{' '}
    </div>
  );
}
