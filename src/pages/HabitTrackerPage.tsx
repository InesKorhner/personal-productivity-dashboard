import React, { useEffect } from 'react';
import type { Habit } from '@/types';
import { HabitList } from '@/components/HabitList';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { EditHabitDialog } from '@/components/EditHabitDialog';

export function HabitTrackerPage() {
  const [habits, setHabits] = React.useState<Habit[]>(() => {
    try {
      const savedHabits = localStorage.getItem('habits');
      const parsed = savedHabits ? JSON.parse(savedHabits) : [];
      return parsed.map((h: Habit) => ({ ...h, checkIns: h.checkIns || [] }));
    } catch (error) {
      console.error('Failed to parse habits from localStorage', error);
      return [];
    }
  });
  const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = (habit: Habit) => {
    setHabits([...habits, { ...habit, checkIns: [] }]);
  };

  const handleToggleCheckIn = (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;

        const updatedCheckIns = habit.checkIns.map((checkIn) =>
          checkIn.date === date
            ? { ...checkIn, isChecked: !checkIn.isChecked }
            : checkIn,
        );

        const exists = habit.checkIns.some((c) => c.date === date);
        if (!exists) {
          updatedCheckIns.push({ date, isChecked: true });
        }

        return { ...habit, checkIns: updatedCheckIns };
      }),
    );
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
  };

  const handleSaveEdit = (updatedHabit: Habit) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    );
    setEditingHabit(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <AddHabitDialog onSave={handleAddHabit} />
      <div className="p-6">
        <HabitList
          habits={habits}
          onToggleCheckIn={handleToggleCheckIn}
          onDelete={handleDeleteHabit}
          onEdit={handleEditHabit}
        />
      </div>
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
